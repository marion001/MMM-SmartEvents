//Gửi thông báo tts sự kiện tới Loa VBot
function sendTTS(message) {
    fetch("http://192.168.14.131:5002", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type: 3,
            data: "tts",
            action: "notify",
            value: message
        })
    })
    .then(res => res.text()) // an toàn hơn JSON
    .then(data => console.log("✅ TTS sent:", message, "| Response:", data))
    .catch(err => console.error("❌ TTS error:", err));
}