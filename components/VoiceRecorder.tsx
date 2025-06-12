'use client';

import { useState, useRef } from 'react';
import { StopIcon, ArrowPathIcon, MicrophoneIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import AudioButton from './AudioButton';

// --- Web Audio API 的類型定義 ---
interface AudioContextRef {
  context: AudioContext | null;
  stream: MediaStream | null;
  source: MediaStreamAudioSourceNode | null;
  processor: ScriptProcessorNode | null;
}

// --- 組件 Props ---
interface VoiceRecorderProps {
  referenceAudioPath: string;
  letterName: string;
  onScoreUpdate: (score: number) => void;
}

type ScoreStatus = 'idle' | 'recording' | 'processing' | 'success' | 'failure' | 'error';

// --- WAV 音檔編碼器 ---
// 此輔助函式會在瀏覽器中將原始音訊數據轉換為 WAV Blob
function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // Audio format 1 (PCM)
  view.setUint16(22, 1, true); // Num Channels 1
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // Byte Rate
  view.setUint16(32, 2, true); // Block Align
  view.setUint16(34, 16, true); // Bits Per Sample
  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  // Write samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// --- 主要組件 ---
export default function VoiceRecorder({ referenceAudioPath, letterName, onScoreUpdate }: VoiceRecorderProps) {
  const [status, setStatus] = useState<ScoreStatus>('idle');
  const [score, setScore] = useState<number | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const audioContextRef = useRef<AudioContextRef>({ context: null, stream: null, source: null, processor: null });
  const audioBufferRef = useRef<Float32Array[]>([]);
  const targetLetter = letterName.split(' ').pop()?.toLowerCase() || '';

  const startRecording = async () => {
    setStatus('recording');
    setScore(null);
    setTranscribedText('');
    setErrorMessage('');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(4096, 1, 1);

      audioBufferRef.current = [];
      processor.onaudioprocess = (e) => {
        audioBufferRef.current.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };

      source.connect(processor);
      processor.connect(context.destination);

      audioContextRef.current = { context, stream, source, processor };
    } catch (err) {
      console.error("無法取得麥克風或初始化 AudioContext:", err);
      setErrorMessage("無法啟動錄音功能，請檢查您的麥克風權限。");
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (status !== 'recording') return;
    
    const { context, stream, source, processor } = audioContextRef.current;
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (source) source.disconnect();
    if (processor) processor.disconnect();
    if (context) context.close();
    
    setStatus('processing');
    handleRecordingStop();
  };

  const handleRecordingStop = async () => {
    const recordedData = flattenBuffer(audioBufferRef.current);
    const sampleRate = audioContextRef.current.context?.sampleRate || 16000;
    const audioBlob = encodeWAV(recordedData, sampleRate);
    
    audioBufferRef.current = [];
    
    if (audioBlob.size < 100) { // WAV header is 44 bytes, so check for more
        setErrorMessage("錄音檔案是空的或時間太短，請重試。");
        setStatus('error');
        return;
    }

    try {
      const response = await fetch('/api/transcribe', { method: 'POST', body: audioBlob });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || '辨識失敗');

      const transcription = result.text.trim().toLowerCase();
      setTranscribedText(transcription);
      
      const newScore = calculateScore(transcription, targetLetter);
      setScore(newScore);
      onScoreUpdate(newScore);
      setStatus(newScore >= 70 ? 'success' : 'failure');
    } catch (error: any) {
      console.error("語音辨識錯誤:", error);
      setErrorMessage(error.message || '發生未知的辨識錯誤');
      setStatus('error');
    }
  };
  
  const flattenBuffer = (bufferArray: Float32Array[]): Float32Array => {
    const totalLength = bufferArray.reduce((acc, val) => acc + val.length, 0);
    const result = new Float32Array(totalLength);
    let offset = 0;
    for (const buffer of bufferArray) {
      result.set(buffer, offset);
      offset += buffer.length;
    }
    return result;
  };

  const calculateScore = (transcription: string, target: string): number => {
    if (!transcription || !target) return 0;
    if (transcription === target) return 100;
    if (transcription.includes(target)) return 75;
    return 20;
  };

  const reset = () => {
    setStatus('idle');
    setScore(null);
    setTranscribedText('');
    setErrorMessage('');
  };

  const renderStatusUI = () => {
    switch (status) {
      case 'recording':
        return <div className="text-center text-blue-500 text-lg font-semibold animate-pulse">錄音中...</div>;
      case 'processing':
        return <div className="text-center"><ArrowPathIcon className="w-12 h-12 text-gray-500 mx-auto animate-spin" /><div className="text-lg font-semibold mt-4">辨識中...</div></div>;
      case 'success':
      case 'failure':
        return (
          <div className="text-center">
            {status === 'success' ? <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" /> : <XCircleIcon className="w-16 h-16 text-red-500 mx-auto" />}
            <div className={`text-5xl font-bold my-2 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{score} 分</div>
            <p className="text-gray-700">您唸的是：<span className="font-semibold text-lg">{transcribedText || '...'}</span></p>
            <p className="text-gray-500">正確發音：<span className="font-semibold text-lg">{targetLetter}</span></p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <XCircleIcon className="w-16 h-16 text-yellow-500 mx-auto" />
            <div className="text-xl font-semibold my-2 text-yellow-700">發生錯誤</div>
            <p className="text-gray-600">{errorMessage}</p>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">🎤</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">點擊下方按鈕開始錄音</h3>
            <p className="text-gray-600">請清楚地念出字母 <span className="font-bold text-blue-600 text-lg">{targetLetter.toUpperCase()}</span></p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{letterName}</h2>
      <div className="text-center mb-6">
        <p className="text-gray-600">參考發音：</p>
        <AudioButton src={referenceAudioPath} />
      </div>
      <div className="bg-gray-50 rounded-lg p-6 min-h-[200px] flex items-center justify-center mb-6">{renderStatusUI()}</div>
      <div className="flex justify-center space-x-4">
        {status === 'idle' || status === 'error' || status === 'success' || status === 'failure' ? (
          <button
            onClick={status === 'idle' || status === 'error' ? startRecording : reset}
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            {status === 'idle' || status === 'error' ? (<><MicrophoneIcon className="w-6 h-6" />開始錄音</>) : (<><ArrowPathIcon className="w-6 h-6" />重新練習</>)}
          </button>
        ) : (
          <button
            onClick={stopRecording}
            disabled={status !== 'recording'}
            className="flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400"
          >
            <StopIcon className="w-6 h-6" />停止錄音
          </button>
        )}
      </div>
    </div>
  );
} 