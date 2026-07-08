/* ================= GOOGLE SHEET DATA ================= */


async function fetchSheet(){

    const MAX_ATTEMPTS = 3;


    for(
        let attempt = 1;
        attempt <= MAX_ATTEMPTS;
        attempt++
    ){

        try{


            const url =
                CONFIG.SHEET_URL +
                "&_t=" +
                Date.now();



            const res =
                await fetch(
                    url,
                    {
                        cache:"no-store"
                    }
                );



            if(!res.ok){

                throw new Error(
                    "HTTP " + res.status
                );

            }



            const text =
                await res.text();



            console.log(
                "RAW SHEET RESPONSE:",
                text
            );



            const clean =
                text.trim();



            /*
                Google sometimes returns:
                Loading...
            */

            if(
                !clean ||
                clean === "Loading..."
            ){

                throw new Error(
                    "Invalid Google response"
                );

            }



            const rows =
                clean
                .split(/\r?\n/)
                .filter(
                    r=>r.trim() !== ""
                );



            /*
                Remove header row
            */

            rows.shift();



            /*
                Need 25 tiles
            */

            if(
                rows.length < CONFIG.BOARD_SIZE
            ){

                throw new Error(
                    "Invalid tile count"
                );

            }



            const team1=[];
            const team2=[];
            const team3=[];



            rows
            .slice(
                0,
                CONFIG.BOARD_SIZE
            )
            .forEach(row=>{


                /*
                    gviz CSV returns:
                    "TRUE","FALSE","FALSE"

                    Strip quotes before parsing
                */


                const cols =
                    row
                    .split(",")
                    .map(c=>
                        c
                        .trim()
                        .replace(/^"|"$/g,"")
                    );



                team1.push(
                    parseTileState(cols[0])
                );


                team2.push(
                    parseTileState(cols[1])
                );


                team3.push(
                    parseTileState(cols[2])
                );


            });



            return {


                team1:
                    normalize(team1),


                team2:
                    normalize(team2),


                team3:
                    normalize(team3)


            };



        }
        catch(err){


            console.warn(
                `Sheet attempt ${attempt}/${MAX_ATTEMPTS} failed:`,
                err.message
            );



            if(
                attempt <
                MAX_ATTEMPTS
            ){

                await wait(750);

            }


        }

    }



    console.error(
        "Google Sheet unavailable"
    );


    return null;


}








function parseTileState(value){


    const v =
        String(value || "")
        .trim()
        .replace(/^"|"$/g,"")
        .toUpperCase();



    if(v==="TRUE")
        return "complete";



    if(
        v==="IN PROGRESS" ||
        v==="IN_PROGRESS"
    )
        return "progress";



    return "empty";

}








function normalize(arr){


    while(
        arr.length <
        CONFIG.BOARD_SIZE
    ){

        arr.push("empty");

    }



    return arr.slice(
        0,
        CONFIG.BOARD_SIZE
    );


}








function wait(ms){

    return new Promise(
        resolve =>
            setTimeout(resolve,ms)
    );

}
