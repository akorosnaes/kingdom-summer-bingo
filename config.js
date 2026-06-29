const CONFIG = {
    // ================= GOOGLE SHEETS =================
    SHEET_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZxyt-8zatBlU9VKkaY8BsPCQsBvNp5lq_jf-YaLBv4Pq5bm_kuGkmhytmMzRHc54hfbbS3tsnCZfn/pub?gid=99397328&single=true&output=csv",

    // Drop log sheet (SECOND TAB)
    DROP_SHEET_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2FWpuuy2nZiDXoA1JlW90Vt65R1mAfW_3_ZNpI4ig0tdWJtKV4tg7uUj1QmYqox1fef2h4eokYHiD/pub?gid=1732365935&single=true&output=csv",

    // ================= GAME SETTINGS =================
    GOAL: 25,

    // ================= TEAMS =================
    teams: [
        {
            name: "Team 1",
            img: "images/team1.png",
            color: "red"
        },
        {
            name: "Team 2",
            img: "images/team2.png",
            color: "green"
        },
        {
            name: "Team 3",
            img: "images/team3.png",
            color: "blue"
        }
    ],

    // ================= TILE IMAGES (MANUAL CONTROL) =================
    tileImages: [
        "images/tile1.png",
        "images/tile2.png",
        "images/tile3.png",
        "images/tile4.png",
        "tile5.png",

        "tile6.png",
        "tile7.png",
        "tile8.png",
        "tile9.png",
        "tile10.png",

        "tile11.png",
        "tile12.png",
        "tile13.png",
        "tile14.png",
        "tile15.png",

        "tile16.png",
        "tile17.png",
        "tile18.png",
        "tile19.png",
        "tile20.png",

        "tile21.png",
        "tile22.png",
        "tile23.png",
        "tile24.png",
        "tile25.png"
    ],

    // ================= TILE METADATA (EDIT THESE FREELY) =================
    tileMeta: [
        { name: "Tile 1",  desc: "Complete objective 1" },
        { name: "Tile 2",  desc: "Complete objective 2" },
        { name: "Tile 3",  desc: "Complete objective 3" },
        { name: "Tile 4",  desc: "Complete objective 4" },
        { name: "Tile 5",  desc: "Complete objective 5" },

        { name: "Tile 6",  desc: "Complete objective 6" },
        { name: "Tile 7",  desc: "Complete objective 7" },
        { name: "Tile 8",  desc: "Complete objective 8" },
        { name: "Tile 9",  desc: "Complete objective 9" },
        { name: "Tile 10", desc: "Complete objective 10" },

        { name: "Tile 11", desc: "Complete objective 11" },
        { name: "Tile 12", desc: "Complete objective 12" },
        { name: "Tile 13", desc: "Complete objective 13" },
        { name: "Tile 14", desc: "Complete objective 14" },
        { name: "Tile 15", desc: "Complete objective 15" },

        { name: "Tile 16", desc: "Complete objective 16" },
        { name: "Tile 17", desc: "Complete objective 17" },
        { name: "Tile 18", desc: "Complete objective 18" },
        { name: "Tile 19", desc: "Complete objective 19" },
        { name: "Tile 20", desc: "Complete objective 20" },

        { name: "Tile 21", desc: "Complete objective 21" },
        { name: "Tile 22", desc: "Complete objective 22" },
        { name: "Tile 23", desc: "Complete objective 23" },
        { name: "Tile 24", desc: "Complete objective 24" },
        { name: "Tile 25", desc: "Complete objective 25" }
    ]
};
