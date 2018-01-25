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
//---------------------------_InvestmentBroker.script-----------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------

// kill any scripts from previous run
localHost = getHostname();
scriptKill("_InvestmentBroker_Data.script", localHost);
scriptKill("_InvestmentBroker_Manager.script", localHost);

COMMISION_FEE = 100000;

INPUT_PORT = 10;

// Stock ID (add entries here to handle more stocks)
function GetStockParamId(stockSymbol)
{
    if (stockSymbol === "APHE") return 0;
    if (stockSymbol === "CTYS") return 1;
    if (stockSymbol === "JGN") return 2;
    if (stockSymbol === "SGC") return 3;
    return -1;
}

// Stock paramaters, according to id returned by GetStockParamId
// Moving Average size, History buffer size, buy/sell threshold (0.01 - 1%)
STOCK_PARAMS = [];
STOCK_PARAMS[0] = [9, 5, 0.01];
STOCK_PARAMS[1] = [5, 10, 0.01];
STOCK_PARAMS[2] = [7, 7, 0.01];
STOCK_PARAMS[3] = [5, 6, 0.01];

// Port assignment per stock
StockPort = [-1, -1, -1, -1];

freePort = 1;

// Managed stock data, each managed stock will have an entry here (with the stock port as index) containing an array with the following data:
// 0 : StockSymbol
// 1 : available cash
// 2 : starting cash
// 3 : starting price
// 4 : total worth
ManagerData = [];

function SaveManagerDataInDB()
{
	// Write current managed stock data to file, will be used to restart the script after a reload
    write("_Investment_DB.txt","","w");
    for (i = 1; i < freePort; i++)
    {
        if (ManagerData[i][0] !== "")
        {
            write("_Investment_DB.txt", i + "," + ManagerData[i][0] + "," + ManagerData[i][1] + "," + ManagerData[i][2] + "," + ManagerData[i][3] + "," + ManagerData[i][4] + "|");
        }
    }   
}

previousData = read("_Investment_DB.txt");
if (previousData !== "")
{
    // load previous run data
    previousData = previousData.split("|");
    for (i = 0; i < previousData.length - 1; i++)
    {
        data = previousData[i].split(",");
        stockId = 1 * data[0];
        ManagerData[stockId] = [];
        ManagerData[stockId][0] = data[1];
        ManagerData[stockId][1] = 1 * data[2];
        ManagerData[stockId][2] = 1 * data[3];
        ManagerData[stockId][3] = 1 * data[4];
        ManagerData[stockId][4] = 1 * data[5];
        if (stockId >= freePort)
        {
            freePort = stockId + 1;
        }
        StockPort[GetStockParamId(data[1])] = stockId;
    }
    
    // re-run previous managers with new cash argument
    for (i = 1; i < freePort; i++)
    {
        stockSymbol = ManagerData[i][0];
        stockParamId = GetStockParamId(stockSymbol);
        run("_InvestmentBroker_Data.script", 1, stockSymbol, i, STOCK_PARAMS[stockParamId][0]);
        run("_InvestmentBroker_Manager.script", 1, stockSymbol, i, STOCK_PARAMS[stockParamId][1], STOCK_PARAMS[stockParamId][2], ManagerData[stockId][1]);
    }
}

doLoop = true;

while (doLoop)
{
    inputCommand = read(INPUT_PORT);
    if (inputCommand !== 'NULL PORT DATA')
    {
        inputCommand = inputCommand.split(" ");
        if (inputCommand[0] == "A" && freePort < INPUT_PORT)
        {
			// Add a new managed stock
            stockSymbol = inputCommand[1];
            stockParamId = GetStockParamId(stockSymbol);
            run("_InvestmentBroker_Data.script", 1, inputCommand[1], freePort, STOCK_PARAMS[stockParamId][0]);
            run("_InvestmentBroker_Manager.script", 1, inputCommand[1], freePort, STOCK_PARAMS[stockParamId][1], STOCK_PARAMS[stockParamId][2], 1 * inputCommand[2]);
            print("Adding managed stock " + inputCommand[1] + ", cash: " + inputCommand[2] + "$");
            stockPrice = getStockPrice(stockSymbol);
            cash = 1 * inputCommand[2];
            ManagerData[freePort] = [];
            ManagerData[freePort][0] = stockSymbol;
            ManagerData[freePort][1] = cash;
            ManagerData[freePort][2] = cash;
            ManagerData[freePort][3] = stockPrice;
            ManagerData[freePort][4] = cash;
            SaveManagerDataInDB();
            StockPort[stockParamId] = freePort;
            freePort++;
        }

        if (inputCommand[0] == "L")
        {
			// Liquidate stock
            stockSymbol = inputCommand[1];
            stockParamId = GetStockParamId(stockSymbol);
            stockId = StockPort[stockParamId];
            if (stockId != -1)
            {
				// Kill Data gathering script
                kill("_InvestmentBroker_Data.script", localHost, stockSymbol, stockId, STOCK_PARAMS[stockParamId][0]);
				// Send liquidation command to manage script (it is not killed immediatly to ensure any queued stock transactions will be handled before selling a stock to avoid selling with the wrong price)
                write(stockId, "_L");
            }
        }

        if (inputCommand[0] == "__L")
        {
			// Liquidation response from manage script, script has terminated and any outstanding transactions has been processed
            stockId = 1 * inputCommand[1];
            stockSymbol = ManagerData[stockId][0];
            stockPrice = getStockPrice(stockSymbol);
            stockData = getStockPosition(stockSymbol);
            profit = stockData[0] * (stockPrice - stockData[1]);
            if (profit > COMMISION_FEE * 2)
            {
                sellStock(stockSymbol, stockData[0]);
                print("Sold " + stockSymbol + " shares for " + profit.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "$");
                ManagerData[stockId][4] = ManagerData[stockId][4] + profit;

            }
            else
            {
                sellPrice = stockData[1] + (COMMISION_FEE * 2 / stockData[0]);
                placeOrder(stockSymbol, stockData[0], sellPrice, "limitsell", "long");
                tprint("placed limit sell order on " + stockSymbol + " for " + stockData[0] + " shares at " + sellPrice.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "$");
            }
            holdProfit = ((ManagerData[stockId][2] - COMMISION_FEE) / ManagerData[stockId][3]) * (stockPrice - ManagerData[stockId][3]);
            profit = ManagerData[stockId][4] - ManagerData[stockId][2];
            tprint("Final profit for " + stockSymbol + ": " + profit.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "$ (" +
                    holdProfit.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "$)");
			
			// End managment for stock
            ManagerData[stockId][0] = "";
            SaveManagerDataInDB();
        }

        if (inputCommand[0] == "_Sb")
        {
			// Process stock purchase transaction
            stockId = 1 * inputCommand[1];
            cost = 1 * inputCommand[2];
            print("Bought " + ManagerData[stockId][0] + " shares for " + cost.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "$");
			
			// Update available cash reserve
            ManagerData[stockId][1] = ManagerData[stockId][1] - cost;
            SaveManagerDataInDB();
        }
        
        if (inputCommand[0] == "_Ss")
        {
			// Process stock sale transaction
            stockId = 1 * inputCommand[1];
            income = 1 * inputCommand[2];
            print("Sold " + ManagerData[stockId][0] + " shares for " + income.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "$");
			
			// Update available cash reserve and total worth
            ManagerData[stockId][1] = ManagerData[stockId][1] + income;
            ManagerData[stockId][4] = ManagerData[stockId][1];
            SaveManagerDataInDB();
        }
        
        if (inputCommand[0] == "S")
        {
			// Print stock status
            totalProfit = 0;
            totalHoldProfit = 0;
            for (i = 1; i < freePort; i++)
            {
                if (ManagerData[i][0] !== "")
                {
                    profit = ManagerData[i][4] - ManagerData[i][2];
                    totalProfit += profit;
                    stockData = getStockPosition(ManagerData[i][0]);
                    stockPrice = getStockPrice(ManagerData[i][0]);
                    holdProfit = ((ManagerData[i][2] - COMMISION_FEE) / ManagerData[i][3]) * (stockPrice - ManagerData[i][3]);
                    totalHoldProfit += holdProfit;
                    tprint(ManagerData[i][0] + ": " + stockData[0] + " Shares, Profit: " + profit.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "$ (" +
                            holdProfit.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "$)");
                }
            }
            tprint("Total profit: " + totalProfit.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "$ (" +
                        totalHoldProfit.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "$)");
        }
    }  
}