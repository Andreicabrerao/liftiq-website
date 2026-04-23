#!/bin/bash
# LiftIQ — video setup helper
# Extracts a poster frame AND compresses the howToDo video for web delivery

set -e

REPO="/Users/aico/Documents/liftiq-website"
SCREENSHOTS="$REPO/screenshots"
SRC_VIDEO=""

# Try to locate the source video — check common spots
for candidate in \
    "/Users/aico/Documents/howToDo.mp4" \
    "/Users/aico/Documents/howToDo.MP4" \
    "/Users/aico/Documents/LiftIQ website pictures/howToDo.mp4" \
    "/Users/aico/Documents/LiftIQ website pictures/howToDo.MP4" \
    "$SCREENSHOTS/howToDo.mp4" \
    "$SCREENSHOTS/howToDo.MP4"; do
    if [ -f "$candidate" ]; then
        SRC_VIDEO="$candidate"
        break
    fi
done

if [ -z "$SRC_VIDEO" ]; then
    echo "ERROR: No howToDo video found. Checked these locations:"
    echo "  /Users/aico/Documents/howToDo.mp4"
    echo "  /Users/aico/Documents/howToDo.MP4"
    echo "  /Users/aico/Documents/LiftIQ website pictures/howToDo.mp4"
    echo "  /Users/aico/Documents/LiftIQ website pictures/howToDo.MP4"
    echo "  $SCREENSHOTS/howToDo.mp4"
    echo "  $SCREENSHOTS/howToDo.MP4"
    echo ""
    echo "Put the video in one of those paths, then re-run this script."
    exit 1
fi

echo "Found source video: $SRC_VIDEO"
echo ""

# Check for ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "ffmpeg is not installed. Installing via Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "ERROR: Homebrew not installed either."
        echo ""
        echo "Install Homebrew first: https://brew.sh"
        echo "Then re-run this script."
        exit 1
    fi
    brew install ffmpeg
fi

echo "ffmpeg: $(ffmpeg -version | head -1)"
echo ""

# Show source file info
echo "Source file info:"
SRC_SIZE_MB=$(du -m "$SRC_VIDEO" | cut -f1)
echo "  Path:   $SRC_VIDEO"
echo "  Size:   ${SRC_SIZE_MB} MB"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,codec_name -of default=noprint_wrappers=1 "$SRC_VIDEO" 2>/dev/null || true
echo ""

mkdir -p "$SCREENSHOTS"

echo "1/2  Extracting poster frame at 1 second into the video..."
ffmpeg -y -i "$SRC_VIDEO" \
    -ss 00:00:01 \
    -vframes 1 \
    -q:v 2 \
    "$SCREENSHOTS/howToDo-poster.jpg" \
    -loglevel error
echo "     poster saved: screenshots/howToDo-poster.jpg"
du -h "$SCREENSHOTS/howToDo-poster.jpg" | awk '{print "     size:        " $1}'
echo ""

echo "2/2  Compressing video for web (this takes 30-90 seconds)..."
# Encode params:
#   libx264 + crf 28 = good quality, small file
#   scale=720:-2 = 720px wide, keep aspect ratio (even number for h264)
#   -movflags +faststart = video starts playing before fully downloaded
#   -an = strip audio (no sound needed for silent gym demo)
ffmpeg -y -i "$SRC_VIDEO" \
    -vcodec libx264 \
    -crf 28 \
    -preset slow \
    -vf "scale='min(720,iw)':-2" \
    -movflags +faststart \
    -an \
    "$SCREENSHOTS/howToDo.mp4" \
    -loglevel error
COMPRESSED_SIZE_MB=$(du -m "$SCREENSHOTS/howToDo.mp4" | cut -f1)
echo "     video saved:  screenshots/howToDo.mp4"
echo "     size:         ${COMPRESSED_SIZE_MB} MB (was ${SRC_SIZE_MB} MB)"
echo ""

echo "========================================"
echo "Done. To publish these files, run:"
echo ""
echo "  cd $REPO"
echo "  git add -A"
echo "  git commit -m 'add: howToDo video + poster for exercise demos'"
echo "  git push origin main"
echo ""
echo "========================================"
