/*
POSTED BY:
u/havoc_mayhem (https://www.reddit.com/user/havoc_mayhem)

POSTED ON:
December 13th, 2017

COMMENT CONTEXT:
"Here's a very simple monitoring script I put together:"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7jgxpv/tip_work_while_monitoring_a_script/
*/



svName = args[0];

while(1) {
    getServerMoneyAvailable(svName);
    getServerMaxMoney(svName);
    getServerSecurityLevel(svName);
    getServerMinSecurityLevel(svName);
    getServerRam(svName);
    print("========================");
    print("Script Income: " + getScriptIncome()[0]);
    print("Script Exp: " + getScriptExpGain());
    print("========================");
    sleep(10000, false);
}