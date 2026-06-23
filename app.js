const tooltip = document.getElementById("tooltip");

init();
load();
setInterval(load, 5000);

/* ================= INIT ================= */
function init() {
    CONFIG.teams.forEach((t, i) => {
        document.getElementById(`team${i + 1}name`).innerText = t.name;
        document.getElementById(`team${i + 1}img`).src = t.img;
    });

    createParticles();

    requestAnimationFrame(animateTooltip);
}

/* ================= LOAD ================= */
async function load() {
    const data = await fetchSheet();

    render("board1", data.team1, CONFIG.teams[0].color);
    render("board2", data.team2, CONFIG.teams[1].color);
    render("board3", data.team3, CONFIG.teams[2].color);

    update(data);

    const drops = await fetchDropLog();
    renderDropLog(drops);

    bindTooltips();
}

/* ================= TILE STATE PARSER ================= */
function parseTileState(value) {
    const v = (value || "").trim().toUpperCase();

    if (v === "TRUE") return "complete";
    if (v === "IN PROGRESS") return "progress";

    return "empty";
}

/* ================= SHEET ================= */
async function fetchSheet() {
    const res = await fetch(CONFIG.SHEET_URL);
    const text = await res.text();

    const rows = text.trim().split("\n").slice(1);

    const team1 = [];
    const team2 = [];
    const team3 = [];

    rows.forEach(r => {
        const c = r.split(",");

        team1.push(parseTileState(c[0]));
        team2.push(parseTileState(c[1]));
        team3.push(parseTileState(c[2]));
    });

    return { team1, team2, team3 };
}

/* ================= DROP LOG ================= */
async function fetchDropLog() {
    if (!CONFIG.DROP_SHEET_URL) return [];

    try {
        const res = await fetch(CONFIG.DROP_SHEET_URL);
        const text = await res.text();

        const rows = text.trim().split("\n").slice(1);

        return rows.map(r => {
            const c = r.split(",");

            return {
                time: c[0] || "",
                text: c[1] || "",
                img: c[2] || ""
            };
        });

    } catch (e) {
        console.error("Drop log fetch failed:", e);
        return [];
    }
}

/* ================= BOARD RENDER ================= */
function render(id, team, color) {
    const board = document.getElementById(id);
    board.innerHTML = "";

    team.forEach((state, i) => {
        const tile = document.createElement("div");
        tile.className = "tile";

        tile.dataset.index = i;

        tile.innerHTML = `<img src="${CONFIG.tileImages[i]}">`;

        if (state === "complete") {
            tile.classList.add("completed", color);
        }

        if (state === "progress") {
            tile.classList.add("in-progress");
        }

        board.appendChild(tile);
    });
}

/* ================= PROGRESS ================= */
function update(data) {
    const teams = [data.team1, data.team2, data.team3];

    teams.forEach((t, i) => {

        const count = t.filter(x => x === "complete").length;

        document.getElementById(`score${i + 1}`).innerText = count;

        const bar = document.getElementById(`bar${i + 1}`);
        const percent = Math.max(
            0,
            Math.min(100, (count / CONFIG.GOAL) * 100)
        );

        bar.style.width = percent + "%";
    });
}

/* ================= DROP LOG ================= */
function renderDropLog(drops) {
    const el = document.getElementById("dropLog");
    el.innerHTML = "";

    drops.forEach(d => {
        const row = document.createElement("div");
        row.className = "drop-item";

        row.innerHTML = `
            <div>${d.time}</div>
            <div>${d.text}</div>
            <div>${d.img ? `<a href="${d.img}" target="_blank">view</a>` : ""}</div>
        `;

        el.appendChild(row);
    });
}

/* ================= PARTICLES ================= */
function createParticles() {
    const container = document.getElementById("bg-particles");

    for (let i = 0; i < 140; i++) {
        const p = document.createElement("div");
        p.className = "particle";

        p.style.left = Math.random() * 100 + "vw";
        p.style.top = Math.random() * 100 + "vh";

        p.style.animationDuration =
            (10 + Math.random() * 20) + "s";

        container.appendChild(p);
    }
}

/* ================= TOOLTIP SYSTEM ================= */

let tooltipX = 0;
let tooltipY = 0;
let targetX = 0;
let targetY = 0;

function bindTooltips() {
    const tiles = document.querySelectorAll(".tile");

    tiles.forEach(tile => {

        tile.onmouseenter = (e) => {
            const index = parseInt(tile.dataset.index, 10);

            const meta = CONFIG.tileMeta?.[index];
            if (!meta) return;

            tooltip.innerHTML = `
                <strong>${meta.name}</strong><br>
                ${meta.desc}
            `;

            tooltip.style.opacity = "1";
            tooltip.style.transform = "scale(1)";

            setTarget(e);
        };

        tile.onmousemove = setTarget;

        tile.onmouseleave = () => {
            tooltip.style.opacity = "0";
            tooltip.style.transform = "scale(0.98)";
        };
    });
}

function setTarget(e) {
    targetX = e.clientX + 14;
    targetY = e.clientY + 14;
}

function animateTooltip() {
    tooltipX += (targetX - tooltipX) * 0.18;
    tooltipY += (targetY - tooltipY) * 0.18;

    tooltip.style.left = tooltipX + "px";
    tooltip.style.top = tooltipY + "px";

    requestAnimationFrame(animateTooltip);
}