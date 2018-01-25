/*
POSTED BY:
u/OWD2010 (https://www.reddit.com/user/OWD2010)

POSTED ON:
November 27th, 2017

COMMENT CONTEXT:
"Revised stock trading script (I call it stocktrader.script)"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/79vncv/script_sharing_request/
*/



sym = args[0];      //Stock symbol
window = 3;   //How big the 'window' should be to look for upwards/downwards momentum.
                    //This is in term of number of price changes
smaPort = 10;  //Port to read SMA values from
money = args[1];    //Amount of money to initially invest

newMoney = 0;  //Intermediate variable, used to change 'money' variable without killing/restarting script
pricePort = 9;  //Port to read changes to the 'newMoney' variable from

COM = 100000; //Commission fee

shortPos = false;   //True if a short position is held
longPos = false;    //True if a long position is held

run("stock-sma.script", 1, sym, window, smaPort);

sleep((window + 5) * 6000); //Give SMA scripts time to 'calibrate'

smas = []; //Stores SMA values after reading port

while(true) {
    sma = read(smaPort);
    newMoney = read(pricePort);
    if (newMoney != 'NULL PORT DATA') {
        money = newMoney;
    }
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