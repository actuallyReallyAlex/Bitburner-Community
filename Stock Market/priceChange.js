/*
POSTED BY:
u/OWD2010 (https://www.reddit.com/user/OWD2010)

POSTED ON:
November 27th, 2017

COMMENT CONTEXT:
"Script to change investment amount in stock trader script (I call it priceChange)

write(9, args[0]);
... I feel like the last script could be eliminated somehow since it's literally one line of code, but I'm not versed enough for it. Is this a normal feeling for programmers?

In any case, testing shows it all works as intended. The script has a steadier hand with investing, and the script takes advantage of long rallys/declines to really make money. About the best I could hope for at the moment.

The next improvement for this type of script (doesn't bleed money in turbulent market, sells after long rallys/declines) would probably require a design overhaul - have it look across all the whole stock exchange and buy/sell shares in everything. It would keep money flowing in more regularly, which would let you bump up the investments faster. Doing it within, say, 64 GB would be a good goal. It's just one upgrade away from being used in regular nodes if you have access to shorting stocks.

The next script to attempt work on would be one that doesn't use the moving average, and instead attempts frequent trades with small gains in price (2%-5%). This would probably use the limit/stop features to cut off any stocks that drop by more than 1%-2%, and the bleed would need to be made up by trades elsewhere. It'd need to be fine-tuned to accomplish that on top of the commission fee, though.

As a summarized notes of changes:

-The moving average script (stock-sma.script) has additional lines to look for up-down-up or down-up-down price changes and eliminate the most recent two from consideration. Net effect is that any price change it reports has been moving in that direction for at least two consecutive data points, making trading behavior more stable.

-The stock trading script (stocktrader.script) has hardcoded port stock ports (10) and window sizes (3). Small sizes work best for this since the new stock-sma is generating responses as a much slower rate due to data scrubbing, but is more accurate about sensing a trend in price changes. Also, new variables and an if statement were added to read in a new investment amount from a different port (hardcoded to port 9).

-A one line script (priceChanges.script) was created to write in changes to investment amounts while the stock trading script is running."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/79vncv/script_sharing_request/
*/



write(9, args[0]);