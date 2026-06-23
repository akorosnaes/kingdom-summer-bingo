async function fetchSheet() {
    const status = document.getElementById("statusText");

    try {
        const res = await fetch(CONFIG.SHEET_URL);
        const text = await res.text();

        const rows = text.trim().split(/\r?\n/).map(r => r.split(","));
        rows.shift();

        const t1 = [], t2 = [], t3 = [];

        rows.forEach(r => {
            if (!r || r.length < 3) return;

            t1.push(clean(r[0]));
            t2.push(clean(r[1]));
            t3.push(clean(r[2]));
        });

        status.innerText = "Live • Updated";

        return {
            team1: normalize(t1),
            team2: normalize(t2),
            team3: normalize(t3)
        };

    } catch (err) {
        status.innerText = "Disconnected • Retrying...";
        return {
            team1: Array(25).fill(false),
            team2: Array(25).fill(false),
            team3: Array(25).fill(false)
        };
    }
}

function clean(v) {
    if (!v) return false;
    return String(v).trim().toUpperCase() === "TRUE";
}

function normalize(arr) {
    while (arr.length < 25) arr.push(false);
    return arr.slice(0, 25);
}