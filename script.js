const textInput = document.getElementById('text-input');
const generateBtn = document.getElementById('generate-btn');
const qrcodeContainer = document.getElementById('qrcode-container');

generateBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (text) {
        qrcodeContainer.innerHTML = '';
        QRCode.toCanvas(text, { width: 256 }, (error, canvas) => {
            if (error) console.error(error);
            qrcodeContainer.appendChild(canvas);
        });
    } else {
        alert('テキストを入力してください。');
    }
});
