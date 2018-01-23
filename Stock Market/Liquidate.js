/*
POSTED BY:
u/neruL02 (https://www.reddit.com/user/neruL02)

POSTED ON:
October 8th, 2017

COMMENT CONTEXT:
"This is my script: Liquidate.script"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/74rlny/request_sell_all_stocks_button/
*/



symbols = ["ECP", "MGCP", "BLD", "CLRK", "OMTK", "FSIG", "KGI", "FLCM", "STM", "DCOMM", "HLS", "VITA", "ICRS", "UNV", "AERO", "OMN", "SLRS", "GPH", "NVMD", "WDS", "LXO", "RHOC", "APHE", "SYSC", "CTK", "NTLK", "OMGA", "FNS", "SGC", "JGN", "CTYS", "MDYN", "TITN"];

for (i = 0; i < symbols.length; i++)
{
  pos = getStockPosition(symbols[i]);
  sellStock(symbols[i],pos[0]);
}