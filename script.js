const textInput = document.getElementById('text-input');
const generateBtn = document.getElementById('generate-btn');
const qrcodeContainer = document.getElementById('qrcode-container');
const downloadBtn = document.getElementById('download-btn');
const colorDarkInput = document.getElementById('color-dark-input');
const colorLightInput = document.getElementById('color-light-input');

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
        QRCode.toCanvas(text, { width: 256, color: { dark: colorDark, light: colorLight } }, (error, canvas) => {
            if (error) console.error(error);
            qrcodeContainer.appendChild(canvas);
            downloadBtn.style.display = 'block';
        });
    } else {
        alert('テキストを入力してください。');
    }
});

downloadBtn.addEventListener('click', () => {
    const canvas = qrcodeContainer.querySelector('canvas');
    if (canvas) {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'qrcode.png';
        a.click();
    }
});
