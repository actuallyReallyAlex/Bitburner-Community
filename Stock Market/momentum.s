/*
POSTED BY:
u/Rinchwind (https://www.reddit.com/user/Rinchwind)

POSTED ON:
December 3rd, 2017

COMMENT CONTEXT:
"After running many, many simulations, I've come to a conclusion that in most cases, a script would perform worse than just putting money in a few stocks and forgetting about it for a few days (while letting the game run in the background). just like in real life... :)
 
However, with the highly volatile stocks (JGN, SGC, APHE and CTYS), a well-tuned script can produce much better results (statistically speaking. It can still perform miserably in some situations, but usually it will get me to several thousand trillion within a day or two)
 
To use the script, run InvestmentBroker.script and use _InvestmentBroker_Msg.script to send commands to it.
You can run the main script on a private server (just copy InvestmentBroker.script, _InvestmentBroker.script, _InvestmentBroker_Data.script and _InvestmentBroker_Manager.script. You can run the messaging script from the home server) or on the home server, it needs at least 153Mb to manage all 4 stocks.
 
I’ve also defined the following aliases to make using it easier:

alias InvestmentBrokerStatus="run _InvestmentBroker_Msg.script S"  
alias InvestmentBrokerBuyStock="run _InvestmentBroker_Msg.script A"  
alias InvestmentBrokerLiquidate="run _InvestmentBroker_Msg.script L"  
 
For instance, to buy 25,000,000$ worth of JGN stock, type the following:

InvestmentBrokerBuyStock JGN 25000000  
 
To liquidate all JGN stock, type the following:

InvestmentBrokerLiquidate JGN  "

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/78zva1/stock_script_brainstorming/
*/



//--------------------------------------------------------------------------------------------------------------------------
//---------------------------_InvestmentBroker_Msg.script-------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------

INPUT_PORT = 10;
msg = "";
for (i = 0; i < args.length; i++)
{
    msg = msg + args[i] + " ";
}
write(INPUT_PORT, msg);