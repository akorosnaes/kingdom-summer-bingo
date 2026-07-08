/* ================= GLOBAL ================= */

const tooltip = document.getElementById("tooltip");

let loading = false;
let pendingBoardState = null;
let pendingCount = 0;

let refreshID = 0;
let lastBoardState = null;

let tooltipX = 0;
let tooltipY = 0;

let targetX = 0;
let targetY = 0;


/* ================= INIT ================= */

init();

setTimeout(load, 500);

setInterval(load, 15000);



function init(){

    CONFIG.teams.forEach((team,index)=>{

        document.getElementById(
            `team${index+1}name`
        ).innerText = team.name;


        document.getElementById(
            `team${index+1}img`
        ).src = team.img;

    });


    createParticles();


    requestAnimationFrame(
        animateTooltip
    );

}



/* ================= LOAD ================= */

async function load(){

    const thisRefresh = ++refreshID;


    if(loading)
        return;


    loading = true;


    try{


        let data = await fetchSheet();



        if(thisRefresh !== refreshID){

            console.log(
                "Ignoring stale sheet response"
            );

            loading=false;
            return;

        }



        if(!data){

            console.warn(
                "Retrying sheet..."
            );


            await wait(1000);


            data = await fetchSheet();


            if(thisRefresh !== refreshID){

                console.log(
                    "Ignoring stale retry"
                );

                loading=false;
                return;

            }

        }





        if(data){


const currentState =
    JSON.stringify(data);



if(currentState !== lastBoardState){


    if(currentState === pendingBoardState){

        pendingCount++;

    }
    else{

        pendingBoardState = currentState;
        pendingCount = 1;

    }



    /*
        Require two matching reads
    */

    if(pendingCount < 2){

        console.log(
            "Waiting for stable sheet data"
        );

        loading=false;
        return;

    }



    console.log(
        "Stable board update accepted"
    );


    lastBoardState = currentState;
    pendingCount = 0;



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



                updateScores(data);


            }
            else{

                console.log(
                    "No board changes"
                );

            }


        }





        const drops =
            await fetchDropLog();



        if(thisRefresh !== refreshID){

            console.log(
                "Ignoring stale drop response"
            );

            loading=false;
            return;

        }



        if(drops.length){

            renderDropLog(drops);

        }



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
/* ================= BOARD RENDER ================= */


function render(id,team,color,boardNumber){

    const board =
        document.getElementById(id);


    board.innerHTML="";



    team.forEach((state,index)=>{


        const tile =
            document.createElement("div");


        tile.className="tile";


        tile.dataset.index=index;



        /*
            FIX TILE PATHS
            Supports both:
            images/tile1.png
            tile1.png
        */

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



        if(state==="complete"){

            tile.classList.add(
                "completed",
                color
            );

        }


        if(state==="progress"){

            tile.classList.add(
                "in-progress"
            );

        }



        board.appendChild(tile);


    });



    updateBingoIndicators(
        team,
        boardNumber
    );

}




/* ================= SCORING ================= */


function updateScores(data){


    const teams=[

        data.team1,
        data.team2,
        data.team3

    ];



    teams.forEach((team,index)=>{


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
            percent+"%";


    });


}




function calculateScore(team){


    let total=0;



    team.forEach(
        (state,index)=>{


            if(state==="complete"){


                total +=
                    CONFIG.tileWeights[index];


            }


        }
    );



    const bingoCount =
        calculateBingos(team);



    total +=
        bingoCount * CONFIG.BINGO_BONUS;



    return total;

}





/* ================= BINGO LOGIC ================= */


function calculateBingos(team){


    let count=0;



    // rows

    for(let row=0; row<5; row++){


        let complete=true;



        for(
            let col=0;
            col<5;
            col++
        ){


            if(
                team[row*5+col]
                !==
                "complete"
            ){

                complete=false;

            }


        }



        if(complete)
            count++;

    }




    // columns

    for(let col=0; col<5; col++){


        let complete=true;



        for(
            let row=0;
            row<5;
            row++
        ){


            if(
                team[row*5+col]
                !==
                "complete"
            ){

                complete=false;

            }


        }



        if(complete)
            count++;

    }



    return count;

}




function updateBingoIndicators(team,board){


    let index=1;



    // rows

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
                team[row*5+col]
                !==
                "complete"
            )
                complete=false;

        }



        toggleBingo(
            `b${board}-r${index}`,
            complete
        );


        index++;

    }





    index=1;



    // columns

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
                team[row*5+col]
                !==
                "complete"
            )
                complete=false;


        }



        toggleBingo(
            `b${board}-c${index}`,
            complete
        );


        index++;

    }


}




function toggleBingo(id,on){

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
        .map(r=>{


            const c =
                r.split(",");


            return {

                time:c[0] || "",
                text:c[1] || "",
                img:c[2] || ""

            };


        });



    }
    catch{

        return [];

    }


}




function renderDropLog(drops){


    const el =
        document.getElementById(
            "dropLog"
        );


    el.innerHTML="";



    drops.forEach(d=>{


        const row =
            document.createElement(
                "div"
            );


        row.className =
            "drop-item";



        row.innerHTML=
        `
        <div>${d.time}</div>
        <div>${d.text}</div>
        <div>
        ${
            d.img
            ?
            `<a href="${d.img}" target="_blank">view</a>`
            :
            ""
        }
        </div>
        `;



        el.appendChild(row);


    });


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


        p.className="particle";


        p.style.left =
            Math.random()*100+"vw";


        p.style.top =
            Math.random()*100+"vh";


        p.style.animationDuration =
            (
                10+
                Math.random()*20
            )
            +"s";


        container.appendChild(p);

    }

}



/* ================= TOOLTIP ================= */


function bindTooltips(){


    document.querySelectorAll(".tile")
    .forEach(tile=>{


        tile.onmouseenter=e=>{


            const meta =
                CONFIG.tileMeta[
                    tile.dataset.index
                ];


            if(!meta)
                return;



            tooltip.innerHTML=
            `
            <strong>${meta.name}</strong>
            <br>
            ${meta.desc}
            `;



            tooltip.style.opacity=1;

            tooltip.style.transform=
            "scale(1)";


            setTarget(e);


        };



        tile.onmousemove=setTarget;



        tile.onmouseleave=()=>{

            tooltip.style.opacity=0;

            tooltip.style.transform=
            "scale(.98)";

        };


    });


}




function setTarget(e){

    targetX =
        e.clientX+14;


    targetY =
        e.clientY+14;

}




function animateTooltip(){


    tooltipX +=
        (
            targetX-tooltipX
        )*.18;



    tooltipY +=
        (
            targetY-tooltipY
        )*.18;



    tooltip.style.left =
        tooltipX+"px";


    tooltip.style.top =
        tooltipY+"px";



    requestAnimationFrame(
        animateTooltip
    );

}
