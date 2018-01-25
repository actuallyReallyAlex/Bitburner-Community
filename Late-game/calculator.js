/*
POSTED BY:
u/i3aizey (https://www.reddit.com/user/i3aizey)

POSTED ON:
November 10th, 2017

COMMENT CONTEXT:
"A script in style of the progression hacking, mostly meant for when you have a large amount of ram on a server It uses 'trial and error' rather than the direct game formula to figure out threads count needed

calculator.script

usage: 'run calculator.script target'

this can easily hit a few billion per second :)

When hacking ALL servers for 50% of their money:

highest memory usage: ~400,000 GB < when it's calculating threads needed & growing servers to 100%

normal memory usage: ~100,000 GB < when things have been calculated & it's just in the hack/grow/weaken cycle

RAM per thread: 6.1

target is whatever server you want, megacorp, harakiri-sushi etc."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/79vncv/script_sharing_request/
*/



target = args[0];
self = getHostname();
maxmoney = getServerMaxMoney(target);
minsec = getServerMinSecurityLevel(target);

// Percentage a hack will take
taking = 0.5;

function getLevel() {
    return getHackingLevel();
}

function getSecurity(){
    return getServerSecurityLevel(target);
}

function getMoney(){
    return getServerMoneyAvailable(target);
}


function getMaxThreads(){
    ram = getServerRam(self);
    return Math.floor((ram[0] - ram[1]) / 1.6);
}

function wait(script){
    while(isRunning(script, self, target)){}
}

function end(script) {
    script += ".script";
    kill(script, self, target);
    wait(script);
}

end("hack");
end("grow");
end("weaken");

function execute(script, threads) {
    maxThreads = getMaxThreads();
    script += ".script";
    threads = Math.min(threads, maxThreads);
    threads = Math.max(threads, 1);
    run(script, threads, target)
    wait(script);
}

function getDown(){
    while(getSecurity() > minsec)
        execute("weaken", Math.ceil((getSecurity() - minsec) / 0.05));
}

function growUp(){
    money = getMoney();
    while(getMoney() < maxmoney){
        money = getMoney();
        need = (maxmoney - money) / money;
        threads = Math.ceil(need / growGives);
        execute("grow", threads);
        getDown();
    }
}

while (!hasRootAccess(target)  || getServerRequiredHackingLevel(target) > getLevel()) {
    print("Waiting for level or root access...");
    execute("crack", 1);
}

getDown();
// Makes sure we can get an accurate growth-read
if(getMoney() > maxmoney * 0.95)
    execute("hack", 100);

getDown();

growGives = 0;
while(growGives < 0.000001) {
    tm = getMoney();
    execute("grow", 1);
    growGives = Math.abs((getMoney() - (tm + 1)) / (tm + 1));
}

// Make sure we can get an accurate hack-read
if(getMoney() < 1000000)
    execute("grow", 10000);

getDown();

tm = getMoney();
while(getMoney() === tm)
    execute("hack", 1);
hackTakes = (tm - getMoney()) / tm;

hackThreads = Math.floor(taking / hackTakes);
growThreads = Math.ceil(1 / growGives) + 10;
weakThreads = Math.ceil((0.002 * hackThreads + 0.004 * growThreads) / 0.05);

print("Hack " + hackThreads + " threads");
print("Grow " + growThreads + " threads");
print("Weak " + weakThreads + " threads");

getDown();
growUp();

while(!run("smartHack.script", hackThreads, target, hackThreads, growThreads, weakThreads, getLevel())){}