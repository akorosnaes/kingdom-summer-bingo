const CONFIG = {


    // =====================================================
    // GOOGLE SHEETS
    // =====================================================

    SHEET_URL:
    "https://docs.google.com/spreadsheets/d/1s3AwXgU57BIKf-tsVPoM-0ZE6yaeWiqfR0M18AaiJLk/gviz/tq?tqx=out:csv&gid=0",


    DROP_SHEET_URL:
    "https://docs.google.com/spreadsheets/d/1s3AwXgU57BIKf-tsVPoM-0ZE6yaeWiqfR0M18AaiJLk/gviz/tq?tqx=out:csv&gid=1732365935",





    // =====================================================
    // GAME SETTINGS
    // =====================================================

    BOARD_SIZE: 25,



    /*
        ====================================================
        TILE WEIGHTS
        ====================================================

        EDIT THESE VALUES ONLY

        Tile positions:

        1   2   3   4   5
        6   7   8   9   10
        11  12  13  14  15
        16  17  18  19  20
        21  22  23  24  25


        Total tile points should equal:

        613 points

        BINGO BONUS:

        10 possible rows/columns
        20 points each

        200 bonus points


        TOTAL BOARD:

        613 + 200 = 813

    */


    tileWeights: [

        26, // Tile 1
        37, // Tile 2
        28, // Tile 3
        16, // Tile 4
        17, // Tile 5


        18, // Tile 6
        29, // Tile 7
        11, // Tile 8
        30, // Tile 9
        33, // Tile 10


        27, // Tile 11
        19, // Tile 12
        23, // Tile 13
        22, // Tile 14
        35, // Tile 15


        17, // Tile 16
        24, // Tile 17
        29, // Tile 18
        28, // Tile 19
        20, // Tile 20


        30, // Tile 21
        18, // Tile 22
        32, // Tile 23
        28, // Tile 24
        16,  // Tile 25

    ],




    /*
        Bonus awarded for every completed row
        or completed column
    */

    BINGO_BONUS: 20,





    // Calculated automatically
    get TILE_TOTAL(){

        return this.tileWeights.reduce(
            (a,b)=>a+b,
            0
        );

    },



    get TOTAL_POINTS(){

        return (
            this.TILE_TOTAL +
            (10 * this.BINGO_BONUS)
        );

    },





    // =====================================================
    // TEAMS
    // =====================================================


    teams: [

        {
            name:
            "Plankers Prolateriat",

            img:
            "images/team1.png",

            color:
            "red"
        },


        {
            name:
            "Tekie's Tickeaters",

            img:
            "images/team2.png",

            color:
            "blue"
        },


        {
            name:
            "Wet Arm",

            img:
            "images/team3.png",

            color:
            "green"
        }

    ],





    // =====================================================
    // TILE IMAGES
    // =====================================================

    tileImages: [

        "images/tile1.png",
        "images/tile2.png",
        "images/tile3.png",
        "images/tile4.png",
        "images/tile5.png",

        "images/tile6.png",
        "images/tile7.png",
        "images/tile8.png",
        "images/tile9.png",
        "images/tile10.png",

        "images/tile11.png",
        "images/tile12.png",
        "images/tile13.png",
        "images/tile14.png",
        "images/tile15.png",

        "images/tile16.png",
        "images/tile17.png",
        "images/tile18.png",
        "images/tile19.png",
        "images/tile20.png",

        "images/tile21.png",
        "images/tile22.png",
        "images/tile23.png",
        "images/tile24.png",
        "images/tile25.png"

    ],





    // =====================================================
    // TILE TOOLTIP DATA
    // =====================================================

    tileMeta: [

        { name:"Duke Sucellus", desc:"4 Vestige rolls from Duke [26]" },
        { name:"Chambers of Xeric", desc:"8 Points (4 Megarare Table, 3 Ancestral Table, 2 Buckler Table/Dust, 1 Scroll Table/Kits [37]" },
        { name:"Corrupted Gauntlet", desc:"4 Crystal armour seeds [28]" },
        { name:"Araxxor", desc:"3 Noxious halberd pieces [16]" },
        { name:"Vorkath", desc:"1 Unique (Non-head/Scaly Hide) [17]" },

        { name:"Tormented Demons", desc:"2 Tormented synapses [18]" },
        { name:"Singles Wildy Bosses", desc:"2/3 unique rings [29]" },
        { name:"Barrows Brothers", desc:"2 Frankensets from Barrows (2 of each slot) [11]" },
        { name:"Vardorvis", desc:"1 Virtus Piece [30]" },
        { name:"Maggot King", desc:"2 Crimson Kistens [33]" },

        { name:"King Black Dragon", desc:"Dragonic visage or Pet [27]" },
        { name:"Phantom Muspah", desc:"5 Venator shards [19]" },
        { name:"Cerberus", desc:"3 Smouldering stones or Jar of Souls [23]" },
        { name:"Grotesque Guardians", desc:"2 Granite hammers [22]" },
        { name:"Theatre of Blood", desc:"6 Points (4 Scythe, 3 Sang/Rapier, 2 Justiciar/Dust, 1 Avernic/Kit/Pet [35]" },

        { name:"Nex", desc:"2 Uniques (Max 5 players in instance) [17]" },
        { name:"Leviathan/Whisperer", desc:"3 Chromium ingots [24]" },
        { name:"Zulrah", desc:"3 Uncut Onyx or Mutagens [29]" },
        { name:"Tombs of Amascut: Expert", desc:"4 Purples [28]" },
        { name:"Doom", desc:"2 Eye of ayak or Treads [20]" },

        { name:"Phosani's Nightmare", desc:"2 Non-Orb drops (No Egg/Pet/Jar) [30]" },
        { name:"Abyssal Sire", desc:"8 Unsired [18]" },
        { name:"God Wars Dungeon", desc:"2 Unique hilts (No Ancient Hilt) [32]" },
        { name:"Yama", desc:"2 Unique Oathplate [28]" },
        { name:"Brutus", desc:"4 Pets [16]" }

    ]

};
