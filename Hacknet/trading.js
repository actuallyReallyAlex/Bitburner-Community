/*
POSTED BY:
u/chapt3r (https://www.reddit.com/user/chapt3r)

POSTED ON:
December 3rd, 2017

COMMENT CONTEXT:
"I actually wipe my saves pretty frequently when testing different BitNodes, so I lost the exact script I was using. However, the script that worked best for me was just this script with a minor modification:

Whenever one of your trades is profitable, increase the 'money' variable by that profit (have to account for commission though). This makes it so that as the script earns money, it will dynamically increase the "funds" it trades with.
Also, contrary to what the author of the script wrote in his comment, I found that the script works best on megacorporation stocks like ECP MGCP rather than APHE and JGN. His/her script trades on momentum and stocks like APHE and JGN have too much volatility

Here is a script I made myself. It works decently but generally not as well as the one above:

https://pastebin.com/hSC2jMi0

This uses a very basic and common algorithmic trading strategy:

Let N > M

Buy stock when its moving average after M price changes goes above the moving average after N price changes
Sell the stock when its moving average after M price changes goes below the moving average after N price changes
I usually use values like M = 12 and N = 30"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7h0h3n/v0330_released_added_bitnode3_corporatocracy/
*/



sym = args[0];      //Stock symbol
window1 = args[1];  //Window for short-term SMA
window2 = args[2];  //Window for long-term SMA
inPort1 = args[3];  //Port to read/write short-term SMA
inPort2 = args[4];  //Port to read/write long-term SMA
money = args[5];    //Initial money to use


COMMISSION = 100000; //Commission fee
posFlag = false; //True if has shares, false otherwise

run("stock-sma.script", 1, sym, window1, inPort1);
run("stock-sma.script", 1, sym, window2, inPort2);

sleep((window2 + 5) * 6000); //Need to get SMA before trying to trade

while(true) {
    sma1 = 0;
    sma2 = 0;
    port1 = read(inPort1);
    if (port1 != 'NULL PORT DATA') {
        sma1 = port1;
    }
    port2 = read(inPort2);
    if (port2 != 'NULL PORT DATA') {
        sma2 = port2;
    }
    
    if (sma1 && sma2) {
        print("SMA1: " + sma1);
        print("SMA2: " + sma2);
        price = getStockPrice(sym);
        if (posFlag) { //Holds position
            if (sma1 < sma2) {
                pos = getStockPosition(sym);
                shares = pos[0];
                avgPx = pos[1];
                profit = (price - avgPx) * shares - COMMISSION;
                if (profit > 0) {
                    print("SMA < SMA2. Executing trade for profit: $" + profit);
                    if (!sellStock(sym, shares)) {
                        print("Error selling stocks. sellStock() failed");
                    }
                    money += profit;
                    posFlag = false;
                } else {
                    print("SMA1 < SMA2 but this trade is not profitable. Not executing.");
                }
            }
        } else { //No position
            if (sma1 > sma2) {
                if (getServerMoneyAvailable("home") < money) {
                    money = getServerMoneyAvailable('home');
                }
                
                shares = Math.floor((money - COMMISSION) / price);
                buyStock(sym, shares);
                posFlag = true;
                print("Purchasing " + shares + " shares of " + sym);
            }
        }
        sleep(3000);
    }
}