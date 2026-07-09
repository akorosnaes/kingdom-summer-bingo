/* ================= GLOBAL ================= */

const tooltip = document.getElementById("tooltip");

let loading = false;
let currentTeamSlide = 0;


/*
    BOARD MEMORY

    Stores the board currently displayed.
*/
let displayedBoardState = null;


/*
    Candidate update waiting
    for confirmation
*/
let pendingBoardState = null;
let pendingCount = 0;


/*
    First successful load
*/
let firstLoad = true;



/*
    DROP LOG MEMORY

    Append-only system.
*/
let displayedDrops = [];



let refreshID = 0;



let tooltipX = 0;
let tooltipY = 0;

let targetX = 0;
let targetY = 0;




/* ================= INIT ================= */


init();



/*
    Slight delay gives Google
    Apps Script time to wake up
*/
setTimeout(
    load,
    1000
);



setInterval(
    load,
    5000
);





function init(){


    CONFIG.teams.forEach((team,index)=>{


        document.getElementById(
            `team${index+1}name`
        ).innerText =
            team.name;



        document.getElementById(
            `team${index+1}img`
        ).src =
            team.img;


    });



    createParticles();

    initTeamSwipeDots();

    requestAnimationFrame(
        animateTooltip
    );


}






/* ================= LOAD ================= */


async function load(){


    const thisRefresh =
        ++refreshID;



    if(loading)
        return;



    loading=true;



    try{


        const data =
            await getStableSheetData();



        if(
            thisRefresh !== refreshID
        ){

            console.log(
                "Ignoring stale response"
            );

            loading=false;
            return;

        }





        if(data){


            const currentState =
                JSON.stringify(data);





            /*
                FIRST LOAD

                Accept immediately.
            */

            if(firstLoad){


                console.log(
                    "Initial board accepted"
                );


                displayedBoardState =
                    currentState;


                firstLoad=false;


                applyBoardUpdate(
                    data
                );


            }





            /*
                NORMAL UPDATES
            */

            else if(
                currentState !== displayedBoardState
            ){



                if(
                    currentState === pendingBoardState
                ){

                    pendingCount++;

                }

                else{

                    pendingBoardState =
                        currentState;


                    pendingCount=1;

                }




                console.log(
                    "Possible update:",
                    pendingCount
                );





                /*
                    Require two matching
                    reads before changing
                */

                if(
                    pendingCount >= 2
                ){


                    console.log(
                        "Confirmed update"
                    );



                    displayedBoardState =
                        currentState;



                    pendingBoardState=null;

                    pendingCount=0;



                    applyBoardUpdate(
                        data
                    );


                }



            }

            else{


                pendingBoardState=null;

                pendingCount=0;


                console.log(
                    "No board changes"
                );


            }


        }





        /*
            DROP LOG

            handled separately
        */

        const drops =
            await fetchDropLog();



        if(
            thisRefresh !== refreshID
        ){

            loading=false;
            return;

        }



        updateDropLog(
            drops
        );



        bindTooltips();



    }

    catch(err){


        console.error(
            "Dashboard error:",
            err
        );


    }



    loading=false;


}







/*
    GOOGLE SHEET STARTUP PROTECTION


    Prevents blank boards when
    Google returns "Loading..."
*/

async function getStableSheetData(){


    const attempts = 5;



    for(
        let i=1;
        i<=attempts;
        i++
    ){


        const data =
            await fetchSheet();



        if(data){


            return data;


        }



        console.log(
            `Waiting for sheet (${i}/${attempts})`
        );



        await wait(
            1000
        );


    }



    return null;


}






function wait(ms){

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}








/* ================= APPLY UPDATE ================= */


function applyBoardUpdate(data){



    render(
        "board1",
        data.team1,
        CONFIG.teams[0].color,
        1
    );



    render(
        "board2",
        data.team2,
        CONFIG.teams[1].color,
        2
    );



    render(
        "board3",
        data.team3,
        CONFIG.teams[2].color,
        3
    );



    updateScores(
        data
    );


}








/* ================= BOARD RENDER ================= */


function render(
    id,
    team,
    color,
    boardNumber
){


    const board =
        document.getElementById(id);



if(
    !team ||
    team.length !== 25
){

    console.warn(
        "Invalid board data, keeping current board",
        team
    );


    return;

}



    board.innerHTML="";



    team.forEach(
        (state,index)=>{


            const tile =
                document.createElement(
                    "div"
                );



            tile.className =
                "tile";



            tile.dataset.index =
                index;



            let img =
                CONFIG.tileImages[index];



            if(
                img &&
                !img.startsWith("images/")
            ){

                img =
                "images/" + img;

            }



            tile.innerHTML =
            `
            <img src="${img}">
            `;





            if(
                state==="complete"
            ){

                tile.classList.add(
                    "completed",
                    color
                );

            }





            if(
                state==="progress"
            ){

                tile.classList.add(
                    "in-progress"
                );

            }





            board.appendChild(
                tile
            );


        }
    );




    updateBingoIndicators(
        team,
        boardNumber
    );


}
/* ================= SCORING ================= */


function updateScores(data){


    const teams = [

        data.team1,
        data.team2,
        data.team3

    ];



    teams.forEach(
        (team,index)=>{


            const score =
                calculateScore(team);



            document.getElementById(
                `score${index+1}`
            )
            .innerText =
                score;




            const percent =
                Math.min(
                    100,
                    (score / CONFIG.TOTAL_POINTS) * 100
                );



            document.getElementById(
                `bar${index+1}`
            )
            .style.width =
                percent + "%";


        }
    );


}







function calculateScore(team){


    let total = 0;



    team.forEach(
        (state,index)=>{


            if(
                state === "complete"
            ){

                total +=
                    CONFIG.tileWeights[index];

            }


        }
    );




    total +=
        calculateBingos(team) *
        CONFIG.BINGO_BONUS;



    return total;


}








/* ================= BINGO LOGIC ================= */


function calculateBingos(team){


    let count = 0;



    /*
        ROWS
    */


    for(
        let row=0;
        row<5;
        row++
    ){


        let complete=true;



        for(
            let col=0;
            col<5;
            col++
        ){


            if(
                team[row*5+col] !== "complete"
            ){

                complete=false;

            }


        }



        if(complete)
            count++;


    }






    /*
        COLUMNS
    */


    for(
        let col=0;
        col<5;
        col++
    ){


        let complete=true;



        for(
            let row=0;
            row<5;
            row++
        ){


            if(
                team[row*5+col] !== "complete"
            ){

                complete=false;

            }


        }



        if(complete)
            count++;


    }



    return count;


}









function updateBingoIndicators(
    team,
    board
){


    let index=1;



    /*
        SIDE BINGOS
        ROWS
    */


    for(
        let row=0;
        row<5;
        row++
    ){


        let complete=true;



        for(
            let col=0;
            col<5;
            col++
        ){


            if(
                team[row*5+col] !== "complete"
            ){

                complete=false;

            }


        }




        toggleBingo(
            `b${board}-r${index}`,
            complete
        );



        index++;


    }






    index=1;



    /*
        BOTTOM BINGOS
        COLUMNS
    */


    for(
        let col=0;
        col<5;
        col++
    ){


        let complete=true;



        for(
            let row=0;
            row<5;
            row++
        ){


            if(
                team[row*5+col] !== "complete"
            ){

                complete=false;

            }


        }




        toggleBingo(
            `b${board}-c${index}`,
            complete
        );



        index++;


    }


}







function toggleBingo(
    id,
    on
){


    const el =
        document.getElementById(id);



    if(!el)
        return;



    el.classList.toggle(
        "active",
        on
    );


}









/* ================= DROP LOG ================= */


async function fetchDropLog(){


    try{


        const res =
            await fetch(
                CONFIG.DROP_SHEET_URL +
                "&_t=" +
                Date.now()
            );



        const text =
            await res.text();




        return text
        .trim()
        .split(/\r?\n/)
        .slice(1)
        .map(row=>{


    const c =
        row
        .split(",")
        .map(value =>
            value
            .trim()
            .replace(/^"|"$/g,"")
        );



    return {


        time:
            c[0] || "",


        text:
            c[1] || "",


        img:
            c[2] || ""


    };


});


    }


    catch(err){


        console.error(
            "Drop log failed:",
            err
        );


        return [];


    }


}








/*
    APPEND ONLY DROP LOG

    Existing entries remain.
    New entries are appended.
*/


function updateDropLog(drops){


    if(
        !drops.length
    )
        return;




    const newDrops =
        drops.filter(
            drop=>{


                return !displayedDrops.some(
                    old =>

                    old.time === drop.time &&
                    old.text === drop.text &&
                    old.img === drop.img

                );


            }
        );





    if(
        !newDrops.length
    )
        return;




    const el =
        document.getElementById(
            "dropLog"
        );





    newDrops.forEach(
        drop=>{


            displayedDrops.push(
                drop
            );



            const row =
                document.createElement(
                    "div"
                );



            row.className =
                "drop-item";



            row.innerHTML =
            `
            <div>${drop.time}</div>

            <div>${drop.text}</div>

            <div>
            ${
                drop.img
                ?
                `<a href="${drop.img}" target="_blank">view</a>`
                :
                ""
            }
            </div>
            `;



            el.appendChild(
                row
            );


        }
    );


}









/* ================= PARTICLES ================= */


function createParticles(){


    const container =
        document.getElementById(
            "bg-particles"
        );



    for(
        let i=0;
        i<140;
        i++
    ){


        const p =
            document.createElement(
                "div"
            );



        p.className =
            "particle";



        p.style.left =
            Math.random()*100 + "vw";



        p.style.top =
            Math.random()*100 + "vh";



        p.style.animationDuration =
            (
                10 +
                Math.random()*20
            )
            + "s";



        container.appendChild(
            p
        );


    }


}









/* ================= TOOLTIP ================= */


function bindTooltips(){


    document.querySelectorAll(".tile")
    .forEach(tile=>{


        tile.onmouseenter = e=>{


            const meta =
                CONFIG.tileMeta[
                    tile.dataset.index
                ];



            if(!meta)
                return;




            tooltip.innerHTML =
            `
            <strong>${meta.name}</strong>
            <br>
            ${meta.desc}
            `;




            tooltip.style.opacity=1;



            tooltip.style.transform =
                "scale(1)";



            setTarget(e);


        };




        tile.onmousemove =
            setTarget;




        tile.onmouseleave = ()=>{


            tooltip.style.opacity=0;



            tooltip.style.transform =
                "scale(.98)";


        };


    });


}







function setTarget(e){


    targetX =
        e.clientX + 14;



    targetY =
        e.clientY + 14;


}







function animateTooltip(){


    tooltipX +=
        (
            targetX-tooltipX
        ) * .18;



    tooltipY +=
        (
            targetY-tooltipY
        ) * .18;




    tooltip.style.left =
        tooltipX + "px";



    tooltip.style.top =
        tooltipY + "px";



    requestAnimationFrame(
        animateTooltip
    );


}
function initTeamSwipeDots(){


    const container =
        document.querySelector(".team-pages");


    const dots =
        document.querySelectorAll(".team-dot");


    if(!container || !dots.length)
        return;



    container.addEventListener(
        "scroll",
        ()=>{


            const index =
                Math.round(
                    container.scrollLeft /
                    container.clientWidth
                );


            if(index === currentTeamSlide)
                return;



            currentTeamSlide=index;



            dots.forEach(
                (dot,i)=>{

                    dot.classList.toggle(
                        "active",
                        i===index
                    );

                }
            );


        }
    );

}
