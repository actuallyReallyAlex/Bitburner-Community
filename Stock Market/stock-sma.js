/*
POSTED BY:
u/OWD2010 (https://www.reddit.com/user/OWD2010)

POSTED ON:
November 27th, 2017

COMMENT CONTEXT:
"I did some tweaks to to the stock trading scripts to try and smooth out fluctuations in pricing causing frequent swaps in position and contributing to a slow bleed in money. I also added a small script to read new investment values from since killing/restarting the scripts to set a new investment value kinda sucks.

Combined, all of them running use up 31.90 GB, so any further improvements either need to cut something else or accept the fact that it can't work on a starting computer. The stock-sma script would be the best starting point, since I just bolted changes onto it without seeing if I could slim it down with its new purpose in mind.

Revised stock-sma.script"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/79vncv/script_sharing_request/
*/



sym = args[0];       //Symbol of stock
window = args[1];    //Number of price changes for the SMA's 'time period'
outPort = args[2];   //Port to write SMA to

prices = [];
sum = 0;
lastPrice = -1;

while(true) {
    price = getStockPrice(sym);
    if (price != lastPrice) {
        prices.push(price);
        sum += price;
        //The next several if statements pop out the most recent value if there's a one-off up/down bump in pricing that
        //interrupts a streak. This means that all price averages that are fed into the port will contain at least 2 recent
        //data points that move in that direction, which should smooth aberrant behavior in stock trading scripts.
        if (prices.length > window){
            if (prices[prices.length-1] > prices[prices.length-2]) {
                if (prices[prices.length-2] < prices[prices.length-3]) {
                    prices.pop();
                    prices.pop();
                    sum = sum - price - lastPrice;
                }
            }
            if (prices[prices.length-1] < prices[prices.length-2]) {
                if (prices[prices.length-2] > prices[prices.length-3]) {
                    prices.pop();
                    prices.pop();
                    sum = sum - price - lastPrice;
                }
            }
        }
        if (prices.length > window) {
            write(outPort, sum/window);
            print(sum/window);
            for (i = 0; i < window; i = i++) {
                prices.shift();
            }
            sum = price;
        }
           lastPrice = prices[prices.length-1];
    }
}