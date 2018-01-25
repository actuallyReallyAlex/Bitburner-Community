/*
POSTED BY:
u/inFatum (https://www.reddit.com/user/inFatum)

POSTED ON:
October 27th, 2017

COMMENT CONTEXT:
"I haven't gotten to the new BitNode yet, but a script that's been pretty successful in other BitNodes has just been one that trades on "momentum". I detect whenever the price changes for a stock and calculate a moving average. If that moving average starts increasing then I buy the stock. When the moving average starts decreasing I sell my shares, and repeat.

With shorting, this will be even better because on downward momentum I can short, and on upward momentum I can long.

I'll post my scripts after I get to the new BitNode and test it out

Edit:

I've been using the stock simple moving average script posted here.

Then here is the actual stock trading script. Worth noting that this will make trades purely based on momentum even if they lose money. Over a long period of time and for certain stocks it has been profitable for me though (APHE and JGN are two stocks that it seems to do well on)"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/78zva1/stock_script_brainstorming/
*/



sym = args[0];      //Stock symbol
window = args[1];   //How big the 'window' should be to look for upwards/downwards momentum.
                    //This is in term of number of price changes
smaPort = args[2];  //Port to read SMA values from
money = args[3];    //Amount of money to initially invest

COM = 100000; //Commission fee

shortPos = false;   //True if a short position is held
longPos = false;    //True if a long position is held

run("stock-sma.script", 1, sym, window, smaPort);

sleep((window + 5) * 6000); //Give SMA scripts time to 'calibrate'

smas = [];
while(true) {
    sma = read(smaPort);
    if (sma != 'NULL PORT DATA') {
        smas.push(sma);
        if (smas.length > window) {
            smas.shift();
            //Only execute trading logic if smas is full
            if (smas[window-1] > smas[0]) {
                //Upwards momentum
                pos = getStockPosition(sym);
                stockPrice = getStockPrice(sym);
                if (shortPos) {
                    //Get out of short position 
                    if (!sellShort(sym, pos[2])) {
                        print("ERROR: sellShort failed");
                    }
                    shortPos = false;
                }

                if (!longPos) {
                    //Enter long position
                    if (getServerMoneyAvailable('home') < money) {
                        money = getServerMoneyAvailable('home');
                    }
                    buyStock(sym, Math.floor((money - COM) / stockPrice));
                    longPos = true;
                }

            } else {
                //Downwards momentum
                pos = getStockPosition(sym);
                stockPrice = getStockPrice(sym);
                if (longPos) {
                    //Get out of long position
                    if (!sellStock(sym, pos[0])) {
                        print("ERROR: sellStock failed");
                    }

                    longPos = false;
                }

                if (!shortPos) {
                    //Enter short position
                    if (getServerMoneyAvailable('home') < money) {
                        money = getServerMoneyAvailable('home');
                    }
                    shortStock(sym, Math.floor((money-COM) / stockPrice));
                    shortPos = true;
                }
            }
        }
    }
}