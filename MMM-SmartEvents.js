Module.register("MMM-SmartEvents", {
    defaults: {
        maxEvents: 5,
        events: [
		/*
			solar: [
			
				{
					title: "Sinh nhật: Vũ Tuyển",
					date: "01/12",
					birthYear: 1000,
					times: ["07:30", "18:00"],
					message: "Chúc mừng sinh nhật Tuyển"
				}
			
			],
			lunar: [
				{ title: "Ngày Giỗ...", date: "01/01" }
			]
		*/
		]
    },
    getScripts: function() {
        return [
            this.file("lunar.js"),
            this.file("events.js"),
            this.file("tts.js")
        ];
    },
    getStyles: function() {
        return ["MMM-SmartEvents.css"];
    },
    start: function() {
        this.events = [];
        this._notifiedMap = {};
        //LOAD events.js
        if (typeof EVENTS !== "undefined") {
            if (EVENTS.solar) {
                EVENTS.solar.forEach(e => this.events.push({
                    ...e,
                    type: "solar"
                }));
            }
            if (EVENTS.lunar) {
                EVENTS.lunar.forEach(e => this.events.push({
                    ...e,
                    type: "lunar"
                }));
            }
        }
        //LOAD config.js
        if (this.config && this.config.events) {
            if (this.config.events.solar) {
                this.config.events.solar.forEach(e => this.events.push({
                    ...e,
                    type: "solar"
                }));
            }
            if (this.config.events.lunar) {
                this.config.events.lunar.forEach(e => this.events.push({
                    ...e,
                    type: "lunar"
                }));
            }
        }
        console.log("MMM-SmartEvents: Loaded", this.events.length, "events");
        //START TTS
        this.startNotificationChecker();
    },
    //HÀM KIỂM TRA VÀ GỌI TTS
	startNotificationChecker: function() {

		this.checkAndNotifyToday();
		this.lastDay = new Date().getDate();

		setInterval(() => {
			let now = new Date();
			//SANG NGÀY MỚI
			if (now.getDate() !== this.lastDay) {
				this._notifiedMap = {};
				this.lastDay = now.getDate();
				console.log("🔄 Sang ngày mới");
				//refresh UI
				this.updateDom(1000);
			}
			this.checkAndNotifyToday();
			//update mỗi phút
			this.updateDom(500);
		}, 60 * 1000);
	},
    checkAndNotifyToday: function() {
        let now = new Date();
        let currentMinutes = now.getHours() * 60 + now.getMinutes();
        let events = this.getAllProcessedEvents();
        //console.log("⏰ Kiêm tra TTS Tại:", now.toTimeString().slice(0, 5));
        events.forEach(event => {
            //bỏ qua nếu thiếu dữ liệu
            if (!event.times || !event.message) return;
            //nếu không phải hôm nay
            if (!event.isToday) return;
            event.times.forEach(time => {
                let [h, m] = time.split(":").map(Number);
                let eventMinutes = h * 60 + m;
                //chống xịt trong khoảng ±1 phút
                if (Math.abs(currentMinutes - eventMinutes) <= 1) {
                    let key = event.title + '_' + time;
                    if (this._notifiedMap[key]) return;
                    //console.log("🔊 TTS:", event.title, time);
                    sendTTS(event.message);
                    this._notifiedMap[key] = true;
                }
            });
        });
    },
    getAllProcessedEvents: function() {
        let now = new Date();
        now.setHours(0, 0, 0, 0);
        let year = now.getFullYear();
        return this.events.map(e => {
            let nextDate;
            if (e.type === "solar") {
                let [d, m] = e.date.split("/").map(Number);
                nextDate = new Date(year, m - 1, d);
                if (nextDate < now) nextDate = new Date(year + 1, m - 1, d);
            } else {
                nextDate = Lunar.toSolar(e.date, year);
                if (!nextDate || nextDate < now) {
                    nextDate = Lunar.toSolar(e.date, year + 1);
                }
            }
            if (!nextDate) return null;
            let daysLeft = Math.ceil((nextDate - now) / 86400000);
            let lunar = Lunar.fromDate(nextDate);
            return {
                ...e,
                nextDate,
                daysLeft,
                lunarStr: lunar.day + "/" + lunar.month,
                isToday: daysLeft === 0,
                isOneDay: daysLeft === 1
            };
        }).filter(e => e !== null).sort((a, b) => a.daysLeft - b.daysLeft);
    },
    getProcessedEvents: function() {
        let now = new Date();
        now.setHours(0, 0, 0, 0);
        let year = now.getFullYear();
        return this.events.map(e => {
            let nextDate;
            if (e.type === "solar") {
                let [d, m] = e.date.split("/").map(Number);
                nextDate = new Date(year, m - 1, d);
                if (nextDate < now) nextDate = new Date(year + 1, m - 1, d);
            } else {
                nextDate = Lunar.toSolar(e.date, year);
                if (!nextDate || nextDate < now) {
                    nextDate = Lunar.toSolar(e.date, year + 1);
                }
            }
            if (!nextDate) return null;
            let daysLeft = Math.ceil((nextDate - now) / 86400000);
            //ĐỊNH DẠNG NGÀY ĐẦY ĐỦ
            let weekday = nextDate.toLocaleDateString("vi-VN", {
                weekday: 'long'
            });
            weekday = weekday.replace("Thứ Hai", "Thứ 2").replace("Thứ Ba", "Thứ 3").replace("Thứ Tư", "Thứ 4").replace("Thứ Năm", "Thứ 5").replace("Thứ Sáu", "Thứ 6").replace("Thứ Bảy", "Thứ 7").replace("Chủ Nhật", "Chủ Nhật");
            let solarStr = '<span class="solar">' + weekday + ', ' + nextDate.getDate().toString().padStart(2, '0') + '/' + (nextDate.getMonth() + 1).toString().padStart(2, '0') + '</span>';
            let lunar = Lunar.fromDate(nextDate);
            let lunarStr = lunar.day + '/' + lunar.month + (lunar.leap ? ' (nhuận)' : '');
            let age = "";
            if (e.birthYear && e.type === "solar") {
                let currentYear = nextDate.getFullYear();
                age = ' (' + (currentYear - e.birthYear) + ' tuổi)';
            }
            return {
                ...e,
                nextDate,
                daysLeft,
                solarStr,
                lunarStr,
                age: age,
                isToday: daysLeft === 0,
                isOneDay: daysLeft === 1
            };
        }).filter(e => e !== null).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, this.config.maxEvents || 5);
    },
    getDom: function() {
        let wrapper = document.createElement("div");
        let events = this.getProcessedEvents();
        if (!events.length) {
            wrapper.innerHTML = "Không có sự kiện nào";
            return wrapper;
        }
        let table = document.createElement("table");
        table.className = "small";
        events.forEach(e => {
            let row = document.createElement("tr");

			let titleTd = document.createElement("td");
			titleTd.className = "title";

			//kiểm tra sinh nhật
			if (e.title &&
				(
					e.title.toLowerCase().includes("sinh nhật") ||
					e.title.toLowerCase().includes("ngày sinh")
				)
			) {
				titleTd.classList.add("birthday-title");
			}
			titleTd.innerHTML = e.title + (e.age || "");

            let dateTd = document.createElement("td");
            dateTd.className = "date";
            dateTd.innerHTML = e.solarStr + '<br><span class="lunar">(' + e.lunarStr + ')</span>';
            let daysTd = document.createElement("td");
            daysTd.className = "days";
            if (e.isToday) {
                if (e.title.toLowerCase().includes("sinh nhật")) {
                    daysTd.innerHTML = "🎂 Hôm nay sinh nhật!";
                    daysTd.classList.add("birthday-today");
                } else {
                    daysTd.innerHTML = "🎉 Hôm nay";
                    daysTd.classList.add("today");
                }
            } else if (e.isOneDay) {
                daysTd.innerHTML = "🔔 Còn 1 ngày";
                daysTd.classList.add("one-day");
            } else if (e.daysLeft <= 7) {
                daysTd.innerHTML = 'Còn ' + e.daysLeft + ' ngày';
                daysTd.classList.add("soon");
            } else {
                daysTd.innerHTML = 'Còn ' + e.daysLeft + ' ngày';
            }
            row.appendChild(titleTd);
            row.appendChild(dateTd);
            row.appendChild(daysTd);
            table.appendChild(row);
        });
        wrapper.appendChild(table);
        return wrapper;
    },
    getHeader: function() {
        let today = this.getProcessedEvents().find(e => e.isToday);
        if (today) return 'Hôm nay: 🎉 ' + today.title;
        return "📅 Sự kiện sắp tới";
    },
});