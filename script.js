const textInput = document.getElementById('text-input');
const generateBtn = document.getElementById('generate-btn');
const qrcodeContainer = document.getElementById('qrcode-container');
const downloadBtn = document.getElementById('download-btn');
const colorDarkInput = document.getElementById('color-dark-input');
const colorLightInput = document.getElementById('color-light-input');
const logoInput = document.getElementById('logo-input');
const logoPreview = document.getElementById('logo-preview');
const logoPreviewContainer = document.getElementById('logo-preview-container');
const removeLogoBtn = document.getElementById('remove-logo-btn');

let logoFile = null;

logoInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        logoFile = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            logoPreview.src = event.target.result;
            logoPreviewContainer.style.display = 'flex';
        };
        reader.readAsDataURL(logoFile);
    }
});

removeLogoBtn.addEventListener('click', () => {
    logoFile = null;
    logoInput.value = ''; // Reset file input
    logoPreviewContainer.style.display = 'none';
    logoPreview.src = '';
});

function isColorLight(hex) {
    const color = hex.substring(1);
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 186;
}

generateBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    const colorDark = colorDarkInput.value;
    const colorLight = colorLightInput.value;

    if (!isColorLight(colorLight)) {
        alert('背景色は薄い色を選択してください。QRコードが読み取れない可能性があります。');
        return;
    }

    if (text) {
        qrcodeContainer.innerHTML = '';
        qrcodeContainer.classList.remove('show');
        
        const options = {
            width: 256,
            margin: 2,
            color: {
                dark: colorDark,
                light: colorLight,
            },
            errorCorrectionLevel: logoFile ? 'H' : 'M',
        };

        QRCode.toCanvas(text, options, (error, canvas) => {
            if (error) {
                console.error(error);
                return;
            }

            if (logoFile) {
                const ctx = canvas.getContext('2d');
                const logoImg = new Image();
                logoImg.onload = () => {
                    const logoSize = canvas.width * 0.2; // Logo size is 20% of QR code size
                    const x = (canvas.width - logoSize) / 2;
                    const y = (canvas.height - logoSize) / 2;
                    ctx.fillStyle = colorLight;
                    ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10); // Add a white background behind the logo
                    ctx.drawImage(logoImg, x, y, logoSize, logoSize);
                    finalizeQrCode(canvas);
                };
                logoImg.src = URL.createObjectURL(logoFile);
            } else {
                finalizeQrCode(canvas);
            }
        });
    } else {
        alert('テキストを入力してください。');
    }
});

function finalizeQrCode(canvas) {
    qrcodeContainer.appendChild(canvas);
    downloadBtn.style.display = 'flex';
    qrcodeContainer.classList.add('show');
}

downloadBtn.addEventListener('click', () => {
    const canvas = qrcodeContainer.querySelector('canvas');
    if (canvas) {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'qrcode.png';
        a.click();
    }
});
