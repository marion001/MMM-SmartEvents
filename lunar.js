// ===== LUNAR VIETNAM - ANTI DUPLICATE =====
if (typeof window.Lunar === "undefined") {
    const TK21 = [0x46c960, 0x2ed954, 0x54d4a0, 0x3eda50, 0x2a7552, 0x4e56a0, 0x38a7a7, 0x5ea5d0, 0x4a92b0, 0x32aab5, 0x58a950, 0x42b4a0, 0x2cbaa4, 0x50ad50, 0x3c55d9, 0x624ba0, 0x4ca5b0, 0x375176, 0x5c5270, 0x466930, 0x307934, 0x546aa0, 0x3ead50, 0x2a5b52, 0x504b60, 0x38a6e6, 0x5ea4e0, 0x48d260, 0x32ea65, 0x56d520, 0x40daa0, 0x2d56a3, 0x5256d0, 0x3c4afb, 0x6249d0, 0x4ca4d0, 0x37d0b6, 0x5ab250, 0x44b520, 0x2edd25, 0x54b5a0, 0x3e55d0, 0x2a55b2, 0x5049b0, 0x3aa577, 0x5ea4b0, 0x48aa50, 0x33b255, 0x586d20, 0x40ad60, 0x2d4b63, 0x525370, 0x3e49e8, 0x60c970, 0x4c54b0, 0x3768a6, 0x5ada50, 0x445aa0, 0x2fa6a4, 0x54aad0, 0x4052e0, 0x28d2e3, 0x4ec950, 0x38d557, 0x5ed4a0, 0x46d950, 0x325d55, 0x5856a0, 0x42a6d0, 0x2c55d4, 0x5252b0, 0x3ca9b8, 0x62a930, 0x4ab490, 0x34b6a6, 0x5aad50, 0x4655a0, 0x2eab64, 0x54a570, 0x4052b0, 0x2ab173, 0x4e6930, 0x386b37, 0x5e6aa0, 0x48ad50, 0x332ad5, 0x582b60, 0x42a570, 0x2e52e4, 0x50d160, 0x3ae958, 0x60d520, 0x4ada90, 0x355aa6, 0x5a56d0, 0x462ae0, 0x30a9d4, 0x54a2d0, 0x3ed150, 0x28e952];
    const TK22 = [0x4eb520, 0x38d727, 0x5eada0, 0x4a55b0, 0x362db5, 0x5a45b0, 0x44a2b0, 0x2eb2b4, 0x54a950, 0x3cb559, 0x626b20, 0x4cad50, 0x385766, 0x5c5370, 0x484570, 0x326574, 0x5852b0, 0x406950, 0x2a7953, 0x505aa0, 0x3baaa7, 0x5ea6d0, 0x4a4ae0, 0x35a2e5, 0x5aa550, 0x42d2a0, 0x2de2a4, 0x52d550, 0x3e5abb, 0x6256a0, 0x4c96d0, 0x3949b6, 0x5e4ab0, 0x46a8d0, 0x30d4b5, 0x56b290, 0x40b550, 0x2a6d52, 0x504da0, 0x3b9567, 0x609570, 0x4a49b0, 0x34a975, 0x5a64b0, 0x446a90, 0x2cba94, 0x526b50, 0x3e2b60, 0x28ab61, 0x4c9570, 0x384ae6, 0x5cd160, 0x46e4a0, 0x2eed25, 0x54da90, 0x405b50, 0x2c36d3, 0x502ae0, 0x3a93d7, 0x6092d0, 0x4ac950, 0x32d556, 0x58b4a0, 0x42b690, 0x2e5d94, 0x5255b0, 0x3e25fa, 0x6425b0, 0x4e92b0, 0x36aab6, 0x5c6950, 0x4674a0, 0x31b2a5, 0x54ad50, 0x4055a0, 0x2aab73, 0x522570, 0x3a5377, 0x6052b0, 0x4a6950, 0x346d56, 0x585aa0, 0x42ab50, 0x2e56d4, 0x544ae0, 0x3ca570, 0x2864d2, 0x4cd260, 0x36eaa6, 0x5ad550, 0x465aa0, 0x30ada5, 0x5695d0, 0x404ad0, 0x2aa9b3, 0x50a4d0, 0x3ad2b7, 0x5eb250, 0x48b540, 0x33d556];

    function INT(d) {
        return Math.floor(d);
    }

    function jdn(dd, mm, yy) {
        let a = INT((14 - mm) / 12);
        let y = yy + 4800 - a;
        let m = mm + 12 * a - 3;
        return dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
    }

    function jdToDate(jd) {
        let a = jd + 32044;
        let b = INT((4 * a + 3) / 146097);
        let c = a - INT(b * 146097 / 4);
        let d = INT((4 * c + 3) / 1461);
        let e = c - INT(1461 * d / 4);
        let m = INT((5 * e + 2) / 153);
        let day = e - INT((153 * m + 2) / 5) + 1;
        let month = m + 3 - 12 * INT(m / 10);
        let year = b * 100 + d - 4800 + INT(m / 10);
        return new Date(year, month - 1, day);
    }

    function decodeLunarYear(yy, k) {
        let monthLengths = [29, 30];
        let regularMonths = [];
        let offsetOfTet = k >> 17;
        let leapMonth = k & 0xf;
        let leapMonthLength = monthLengths[(k >> 16) & 0x1];
        let solarNY = jdn(1, 1, yy);
        let currentJD = solarNY + offsetOfTet;
        let j = k >> 4;
        for (let i = 0; i < 12; i++) {
            regularMonths[12 - i - 1] = monthLengths[j & 1];
            j >>= 1;
        }
        let ly = [];
        for (let mm = 1; mm <= 12; mm++) {
            ly.push({
                month: mm,
                leap: 0,
                jd: currentJD,
                length: regularMonths[mm - 1]
            });
            currentJD += regularMonths[mm - 1];
            if (mm === leapMonth) {
                ly.push({
                    month: mm,
                    leap: 1,
                    jd: currentJD,
                    length: leapMonthLength
                });
                currentJD += leapMonthLength;
            }
        }
        return ly;
    }

    function getYearInfo(year) {
        if (year < 2100) return decodeLunarYear(year, TK21[year - 2000]);
        return decodeLunarYear(year, TK22[year - 2100]);
    }

    function lunarToSolar(day, month, year) {
        let ly = getYearInfo(year);
        for (let i = 0; i < ly.length; i++) {
            let m = ly[i];
            if (m.month === month && m.leap === 0) {
                let jd = m.jd + (day - 1);
                return jdToDate(jd);
            }
        }
        return null;
    }

    function solarToLunar(date) {
        let jd = jdn(date.getDate(), date.getMonth() + 1, date.getFullYear());
        let year = date.getFullYear();
        let ly = getYearInfo(year);
        for (let i = ly.length - 1; i >= 0; i--) {
            if (jd >= ly[i].jd) {
                return {
                    day: jd - ly[i].jd + 1,
                    month: ly[i].month,
                    leap: ly[i].leap || 0
                };
            }
        }
        return {
            day: 1,
            month: 1,
            leap: 0
        };
    }
    window.Lunar = {
        toSolar: function(dateStr, year) {
            let [d, m] = dateStr.split("/").map(Number);
            return lunarToSolar(d, m, year);
        },
        fromDate: solarToLunar
    };
    console.log("✅ Lunar.js loaded successfully");
}