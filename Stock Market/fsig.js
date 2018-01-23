/*
POSTED BY:
u/XxZombGuyxX (https://www.reddit.com/user/XxZombGuyxX)

POSTED ON:
September 28th, 2017

COMMENT CONTEXT:
"I made a script with TIX API and I haven't seen a lot of people talk about it and figured I'd try it out. WITH THE WAY I SET IT UP THIS SCRIPT WILL SPAM AND UPDATE INTO THE TERMINAL. IM SORRY BUT I JUST LIKE IT THAT WAY, TO CHANGE IT CHANGE ALL tprint() FUNCTIONS to print()

fsig.script is 19.00 GB: you need the TIX API first ,basically I just made a script that would capitalize on highs and lows I used FSIG and studied how >low and high it would go at times, the lowest I have seen FSIG go is about 1.4 mill but rarely at times did it always go that far so for simplicities sake I did 1.700m and 1.900m for highs and lows. but it can pay out much higher if you change the "1700000" to a lower number above "1400000"."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/72xmgy/stock_script_i_made/
*/



pos = getStockPosition('FSIG'); //defines an usable array for stocks
shares = pos[0]; // gets the total amount of shares
avgPriPerStock = pos[1]; //gets AvgPricePerStock
//the above pos arrays are only defined because it was easier to explain and keep track of
while(true){
pos = getStockPosition('FSIG'); //this is so the pos array gets updated and shows appropriate amounts every loop
getServerMoneyAvailable("home"); //just cause, this wont print to terminal
getStockPrice('FSIG');// same reason as getServerMoneyAvailable
tprint('you own ' + pos[0] + ' shares from FSIG.');// shows how many
tprint('total stocks average value ammounts to: ' + (pos[0] * pos[1]));

if ((getServerMoneyAvailable("home") > 100000000000) && (getStockPrice('FSIG') < 1700000)){
	 buyStock('FSIG', 20); 
	 tprint("bought 20 stocks in FSIG");
	 tprint("stocks owned: " + pos[0]); 
	 //this block will buy 20 stocks if you have both more than 100b and the FSIG stock price is under 1.700m
	 //PLEASE READ: if you get a spam of alot of stocks being bought this is ok! 
	 //This Script is designed to be profitable and make you moola, I have tested this myself.
	 //if you notice anything that can be improved upon or messes up tell me!
}
if (getStockPrice('FSIG') > 1900000){
	 sellStock('FSIG', pos[0]);
	 profit = pos[0]*(getStockPrice('FSIG') - 1900000); //simple math to get the aproximate profit you earned from selling.
	 tprint("you gained: " + profit);
	 //if you want you can add a sleep(30000); here
	}
}