#!/bin/bash
# LiftIQ website — image setup script
# Copies screenshots with correct filenames + generates QR code

set -e

REPO="/Users/aico/Documents/liftiq-website"
PICS="/Users/aico/Documents/LiftIQ website pictures"

cd "$REPO"

echo "1/3  Copying screenshots from $PICS..."
mkdir -p screenshots

cp "$PICS/HomeTab.png"          screenshots/hero.png
cp "$PICS/TrainingTabpng.png"   screenshots/screen-1.png
cp "$PICS/CelebratingGoals.png" screenshots/screen-2.png
cp "$PICS/ScanYourMeal.png"     screenshots/screen-3.png
cp "$PICS/NutritionTab.png"     screenshots/screen-4.png
cp "$PICS/ProgressTab.png"      screenshots/screen-5.png
cp "$PICS/AICoach.png"          screenshots/ai-coach.png

echo "     screenshots copied (7 files)"
echo ""

echo "2/3  Generating QR code..."

# Try to install qrcode library if not present (uses --user so no sudo needed)
python3 -c "import qrcode" 2>/dev/null || {
    echo "     installing qrcode library..."
    python3 -m pip install --user --quiet 'qrcode[pil]' 2>/dev/null || \
    pip3 install --user --quiet 'qrcode[pil]' 2>/dev/null || {
        echo "     WARNING: could not install qrcode library"
        echo "     skipping QR generation — add qr.png manually later"
        QR_FAILED=1
    }
}

if [ -z "$QR_FAILED" ]; then
    python3 <<'PYTHON'
import qrcode
from qrcode.constants import ERROR_CORRECT_H

qr = qrcode.QRCode(
    version=None,
    error_correction=ERROR_CORRECT_H,
    box_size=40,
    border=4,
)
qr.add_data("https://apps.apple.com/app/id6759868402")
qr.make(fit=True)

img = qr.make_image(fill_color="#0a0a0a", back_color="white")
img.save("qr.png")
print("     qr.png generated (1800x1800px)")
PYTHON
fi

echo ""
echo "3/3  Summary:"
echo ""
ls -lh screenshots/
echo ""
[ -f qr.png ] && ls -lh qr.png
echo ""
echo "========================================"
echo "Done. To publish these files, run:"
echo ""
echo "  cd $REPO"
echo "  git status"
echo "  git add -A"
echo "  git commit -m 'add: real app screenshots and QR code'"
echo "  git push origin main"
echo ""
echo "Then verify at: https://liftiqsolutions.app"
echo "========================================"
