/*
POSTED BY:
u/Infra_asd (https://www.reddit.com/user/Infra_asd)

POSTED ON:
September 28th, 2017

COMMENT CONTEXT:
"I made a script with TIX API and I haven't seen a lot of people talk about it and figured I'd try it out. WITH THE WAY I SET IT UP THIS SCRIPT WILL SPAM AND UPDATE INTO THE TERMINAL. IM SORRY BUT I JUST LIKE IT THAT WAY, TO CHANGE IT CHANGE ALL tprint() FUNCTIONS to print()

fsig.script is 19.00 GB: you need the TIX API first ,basically I just made a script that would capitalize on highs and lows I used FSIG and studied how >low and high it would go at times, the lowest I have seen FSIG go is about 1.4 mill but rarely at times did it always go that far so for simplicities sake I did 1.700m and 1.900m for highs and lows. but it can pay out much higher if you change the "1700000" to a lower number above "1400000"."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/72xmgy/stock_script_i_made/
*/



ecp = [ "ECP",0,0];
mgcp = ["MGCP",0,0];
bld = ["BLD",0,0];
clrk = ["CLRK",0,0];
omtk = ["OMTK",0,0];
fsig = ["FSIG",0,0 ];
kgi = ["KGI",0,0 ];
flcm = ["FLCM",0,0];
stm = ["STM",0,0];
dcomm = ["DCOMM",0,0];
hls = ["HLS",0,0];
vita = ["VITA",0,0];
icrs = ["ICRS",0,0];
unv = ["UNV",0,0];
aero = ["AERO",0,0];
omn = ["OMN",0,0];
slrs = ["SLRS",0,0];
gph = ["GPH",0,0];
nvmd = ["NVMD",0,0];
wds = ["WDS",0,0];
lxo = ["LXO",0,0];
rhoc = ["RHOC",0,0];
aphe = ["APHE",0,0];
sysc = ["SYSC",0,0];
ctk = ["CTK",0,0];
ntlk = ["NTLK",0,0];
omga = ["OMGA",0,0];
fns = ["FNS",0,0];
sgc = ["SGC",0,0];
jgn = ["JGN",0,0];
ctys = ["CTYS",0,0];
mdyn = ["MDYN",0,0];
titn = ["TITN",0,0];

symbols = [ecp, mgcp, bld, clrk, omtk, fsig, kgi, flcm, stm,
            dcomm, hls, vita, icrs, unv, aero, omn, slrs, gph,
            nvmd, wds, lxo, rhoc, aphe, sysc, ctk, ntlk, omga,
            fns, sgc, jgn, ctys, mdyn, titn];
// Infinite loop
counter = 0;
while (true){ 
    //print('Times checked : ' + counter);

    for (i= 0; i < symbols.length; i++){
        //Buy 1 share of each as a built in average price
            pos = getStockPosition(symbols[i][0]);
            if (pos[1] === 0){
                buyStock(symbols[i][0], 1);
            }
            //Get the stock price
            stockPrice = getStockPrice(symbols[i][0]);
            //get stock position again
            pos = getStockPosition(symbols[i][0]);
            //Calculo de threshold para comprar, pero solo si tengo al menos un promedio de 2 pasadas
            //Calculate buying threshold after two, only if i have to script passes
            if(counter > 2){

                //I buy a maximum of 3 times the same share, as this would invest everything otherwise
                if (symbols[i][2] > 3){

                }else{
                    //Check if its worth buying
                        buyThresh = pos[1];

                    if (stockPrice < buyThresh){
                        //if it is, i calculate how much shares would i buy using 15% of total money
                        money = (getServerMoneyAvailable("home") * 0.15); //Only use 15% of cash to buy stock
                        shareAmount = Math.floor(money / stockPrice);
                        //I buy the stock and save the buying price on position1 of the array
                        tprint('Investing ' + money + " on " + shareAmount + " shares of " + symbols[i][0]);
                        buyStock(symbols[i][0], shareAmount);
                        symbols[i][1] = stockPrice;
                        symbols[i][2] = symbols[i][2] + 1;
                    }
                }
            }
            //Calculating sells
            //First i check if i have any more than the 1
            if(pos[0] > 1){
                // Calculate sellThresh using the buying price
                //Looking for a 3% profit on every sell
                //I take into account if the stocks was purchased before excecuting the script, and so i check the sellthresh to the average price of it
                if(symbols[i][1] === 0){
                    sellThresh = pos[1];
                }else{
                    sellThresh = (symbols[i][1] * 1.03);
                }
                //If the price is met i sell every stock but the 1 for the average
                if (stockPrice > sellThresh){
                    sellAmount = pos[0] - 1;
                    tprint('Selling all shares (' + pos[0] + ') of ' + symbols[i][0]);
                    sellStock(symbols[i][0], sellAmount);
                    symbols[i][2] = 0;
                }
            }






        }
    counter ++;
}