
MMM-SmartEvents - README

Smart Events Module for MagicMirror

FEATURES:

    - Solar + Lunar events
    - Birthday detection
    - Multi-time TTS
    - Config.js + events.js support

INSTALL:

    cd ~/MagicMirror/modules
    git clone https://github.com/marion001/MMM-SmartEvents.git

CONFIG:
Add to config.js:

    {
        module: "MMM-SmartEvents",
        position: "top_left",
        config: {
            maxEvents: 5,
            events: {
                solar: [
                    {
                        title: "Sinh nhật: Vũ Tuyển",
                        date: "01/01",
                        birthYear: 1000,
                        times: ["07:30", "18:00"],
                        message: "Chúc mừng sinh nhật Tuyển 🎉"
                    },
                    {
                        title: "ngày bình thường",
                        date: "17/11"
                    }
                ],
                lunar: [
                    {
                        title: "Ngày Giỗ, Lễ,...",
                        date: "01/01",
                        times: ["00:00"],
                        message: "Hôm nay là ngày giỗ"
                    }
                ]
            }
        }
    }

MULTI TIME TTS:

    {
      title: "Uống thuốc",
      date: "19/04",
      times: ["07:00","12:00"],
      message: "Đã đến giờ uống thuốc"
    }

TTS API:

    http://localhost:5000/tts
