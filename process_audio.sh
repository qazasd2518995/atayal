#!/bin/bash

# 批量處理音檔：移除靜音部分
echo "🎵 開始批量處理音檔，移除靜音部分..."

# 創建備份目錄
backup_dir="public/alphabet/backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"
echo "📁 創建備份目錄: $backup_dir"

# 統計變數
processed=0
failed=0

# 處理函數
process_audio() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local extension="${filename##*.}"
    local basename="${filename%.*}"
    
    echo "🔄 處理: $filename"
    
    # 備份原檔案
    cp "$input_file" "$backup_dir/"
    
    # 創建臨時檔案
    local temp_file="public/alphabet/temp_${basename}.wav"
    
    # 使用 ffmpeg 移除靜音：
    # - silenceremove: 移除開頭和結尾的靜音
    # - start_periods=1: 檢查開頭1段靜音
    # - start_silence=0.1: 開頭靜音閾值0.1秒
    # - start_threshold=-50dB: 靜音判定閾值-50dB
    # - stop_periods=-1: 檢查結尾所有靜音段
    # - stop_silence=0.1: 結尾靜音閾值0.1秒
    # - stop_threshold=-50dB: 結尾靜音判定閾值-50dB
    
    if ffmpeg -i "$input_file" \
        -af "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB:stop_periods=-1:stop_silence=0.2:stop_threshold=-50dB" \
        -ar 16000 -ac 1 -y "$temp_file" 2>/dev/null; then
        
        # 檢查處理後的檔案是否有效且不為空
        if [ -f "$temp_file" ] && [ -s "$temp_file" ]; then
            # 檢查音檔長度是否合理（至少0.3秒）
            duration=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$temp_file" 2>/dev/null | cut -d. -f1)
            if [ "$duration" -gt 0 ] 2>/dev/null; then
                # 轉換回原始格式（如果不是wav）
                if [ "$extension" != "wav" ]; then
                    if [ "$extension" = "webm" ]; then
                        # 轉換為 WebM/Opus 格式
                        ffmpeg -i "$temp_file" -c:a libopus -b:a 128k -y "${input_file}.new" 2>/dev/null
                    else
                        # 轉換為 MP3 格式
                        ffmpeg -i "$temp_file" -c:a libmp3lame -b:a 128k -y "${input_file}.new" 2>/dev/null
                    fi
                    
                    if [ -f "${input_file}.new" ]; then
                        mv "${input_file}.new" "$input_file"
                        echo "✅ $filename - 已處理並轉換回$extension格式"
                    else
                        # 如果轉換失敗，保留為wav格式
                        mv "$temp_file" "${input_file%.*}.wav"
                        echo "⚠️  $filename - 已處理但轉換為WAV格式"
                    fi
                else
                    # 直接替換WAV檔案
                    mv "$temp_file" "$input_file"
                    echo "✅ $filename - 已處理"
                fi
                
                processed=$((processed + 1))
            else
                echo "❌ $filename - 處理後音檔過短，保留原檔案"
                rm -f "$temp_file"
                failed=$((failed + 1))
            fi
        else
            echo "❌ $filename - 處理失敗，保留原檔案"
            rm -f "$temp_file"
            failed=$((failed + 1))
        fi
    else
        echo "❌ $filename - FFmpeg處理失敗"
        failed=$((failed + 1))
    fi
    
    # 清理臨時檔案
    rm -f "$temp_file"
}

# 處理所有音檔
echo "🔍 搜尋音檔..."
find public/alphabet -maxdepth 1 \( -name "*.wav" -o -name "*.mp3" -o -name "*.webm" -o -name "*.mp4" \) -not -path "*/backup_*" | while read -r file; do
    # 跳過測試音調檔案
    if [[ "$(basename "$file")" == "test_tone.wav" ]]; then
        echo "⏭️  跳過測試音調: $(basename "$file")"
        continue
    fi
    
    # 跳過太小的檔案（可能已經處理過）
    size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    if [ "$size" -lt 1000 ]; then
        echo "⏭️  跳過過小檔案: $(basename "$file") (${size} bytes)"
        continue
    fi
    
    process_audio "$file"
done

echo ""
echo "🎉 批量處理完成！"
echo "📊 統計："
echo "   ✅ 成功處理: $processed 個檔案"
echo "   ❌ 處理失敗: $failed 個檔案"
echo "   📁 備份位置: $backup_dir"
echo ""
echo "💡 提示："
echo "   - 原始檔案已備份至 $backup_dir"
echo "   - 處理後的檔案已移除開頭和結尾的靜音"
echo "   - 所有檔案已標準化為 16kHz 單聲道"
echo "   - 如有問題，可從備份目錄還原" 