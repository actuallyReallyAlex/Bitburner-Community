/*
POSTED BY:
u/boz987 (https://www.reddit.com/user/boz987)

POSTED ON:
September 16th, 2017

COMMENT CONTEXT:
"Working on designing a script to optimally hack servers, from early to late game. Still some more I want to do to it, but for now, heres how it works:

15.15GB Ram, + 1.55 , so 32GB should run this.

Scans all servers recursively

If they are a hacking target (money > 0), gathers more info on them. And determines their profit / sec.

Checks number of port busters you have, gets current hacking level. Using these, if your hacking level has increased by 100 (saves rerunning calcs each time), it recaclulates the optimal profits for a list of servers you can currently hack

Finds the optimal profit targets, and nukes it if needed. In order of optimal, calcs as many threads as needed, and runs weaken/grow/hack as needed

Runs Weaken (if more than + 6 of min) Run Grow if not 75% of max. Hacks if above 75% of max.

Big Thanks to:

/user/MercuriusXeno

/user/Reydien

For large parts of the logic.

The Script:"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/70enbq/main_server_script/
*/



//Define Variables
currentScanLength = 0;
scanArray = ['home'];
Servers = [];
ServersM = [];  // Money
ServersHL = []; // HackingLevel
ServersHP = []; // HackingPorts
ServersP = [];  // Profits
basehackinglevel = -101;
target = 'foodnstuff';
host = 'home';
mults = getHackingMultipliers();

//Skill Multiplier Constants
hackmult = mults.money;
growmult = mults.growth;
//Bitnode Multiplier Constants, update after changing Bitnodes
bitnodehackmult = 1.0000;
bitnodegrowmult = 1.0000;
bitnodeweakenmult = 1.0000;


//Scan Loop
while (currentScanLength < scanArray.length) {
    currentHost = scanArray[currentScanLength];
    newScan = scan(currentHost);
    for (j = 0; j < newScan.length; j++) {
        if (scanArray.indexOf(newScan[j]) == -1) {
            scanArray.push(newScan[j]);
            money = getServerMaxMoney(newScan[j]);
            if (money > 0) {
                Servers.push(newScan[j]);
                ServersM.push(money);
                ServersHP.push(getServerNumPortsRequired(newScan[j]));
                ServersHL.push(getServerRequiredHackingLevel(newScan[j]));
                time = 2 * getWeakenTime(newScan[j]) + getGrowTime(newScan[j]) + getHackTime(newScan[j]);
                profit = round(money / time);
                ServersP.push(profit);
            }
        }
    }
    currentScanLength++;
}

//Main Loop
while (true) {

    portBusters = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
    numPortBreakers = 0;
    for (i = 0; i < portBusters.length; i++) {
        if (fileExists(portBusters[i], 'home')) {
            numPortBreakers++;
        }
    }

    hackinglevel = getHackingLevel();
    print(basehackinglevel);

    //Recalc & RetargetProfits if Hacking level has increased by 100
    if (hackinglevel > basehackinglevel + 100) {
        basehackinglevel = hackinglevel;
        //Reset Profits
        ServersP = [];
        for (j = 0; j < Servers.length; j++) {
            time = 2 * getWeakenTime(Servers[j]) + getGrowTime(Servers[j]) + getHackTime(Servers[j]);
            profit = round(ServersM[j] / time);
            ServersP.push(profit);
        }

        print(Servers);
        print('Create Eligable Target List');
        targetlist = [];
        targetlistP = [];
        for (j = 0; j < Servers.length; j++) {
            if (ServersHP[j] <= numPortBreakers && ServersHL[j] <= hackinglevel) {
                targetlist.push(Servers[j]);
                targetlistP.push(ServersP[j]);
            }
        }

        print(targetlist);
        print('Find Optimal Target List');

        OptimalTargetList = [];
        OptimalTargetListM = [];
        OptimalTargetListG = [];
        OptimalTargetListHL = [];
        OptimalTargetListMS = [];

        for (i = 0; i < Math.min(targetlist.length,10); i++) {
            targetmaxprofit = 0;
            for (j = 0; j < targetlist.length; j++) {
                if (targetlistP[j] > targetmaxprofit) {
                    targetmaxprofit = targetlistP[j];
                }
            }
            index = targetlistP.indexOf(targetmaxprofit);
            OptimalTargetList.push(targetlist[index]);
            OptimalTargetListG.push(getServerGrowth(targetlist[index]));
            OptimalTargetListHL.push(getServerRequiredHackingLevel(targetlist[index]));
            OptimalTargetListMS.push(Math.max(round(getServerBaseSecurityLevel(targetlist[index])/3),1));
            OptimalTargetListM.push(getServerMaxMoney(targetlist[index]));
            targetlistP[index] = 0;
        }
        print(OptimalTargetList);

    }


    //Loop Through Targets
    for (k = 0; k < Math.min(OptimalTargetList.length,10); k++) {
        homeram = getServerRam('home');

        if (homeram[0] - homeram[1] < 2) {
            print('Not enough RAM available');
            k = 1000;
            break;
        }

        freememory = homeram[0] - homeram[1];
        target = OptimalTargetList[k];
        minsecurity = OptimalTargetListMS[k];
        reqHack = OptimalTargetListHL[k];
        maxmoney = OptimalTargetListM[k];
        growth = OptimalTargetListG[k];

        //Calculate number of Hack Threads Required
        perhack = (100-minsecurity) * ((hackinglevel-reqHack+1)/hackinglevel) / 24000 * hackmult * bitnodehackmult;
        hacks  = Math.ceil(1/perhack);

        security = minsecurity + hacks * 0.002;
        //Calculate number of Grow Threads Required
        growpercent = Math.min(1 + 0.03/security,1.0035);
        pergrow = Math.pow(growpercent,growth/100 * growmult * bitnodegrowmult);
        var1 = maxmoney * Math.log(pergrow);
        lambert = Math.log(var1)-Math.log(Math.log(var1))-Math.log(1-Math.log(Math.log(var1))/Math.log(var1));
        grows = Math.ceil(lambert/Math.log(pergrow));

        //Calculate number of Weaken Threads Required
        weakens = Math.ceil((((hacks * 0.002) + (grows * 0.004)) / (0.05 * bitnodeweakenmult)));
        maxweakens = (100 - minsecurity) / (0.05 * bitnodeweakenmult);
        if (weakens > maxweakens) {weakens = maxweakens}

        //Adjust if max threads > max memory
        if (weakens * 1.55 > freememory) {
            weakens = Math.max(Math.floor(freememory / 1.555),1);
        }
        if (hacks * 1.55 > freememory) {
            hacks = Math.max(Math.floor(freememory / 1.555),1);
        }
        if (grows * 1.55 > freememory) {
            grows = Math.max(Math.floor(freememory / 1.555),1);
        }

        if (hasRootAccess(target) == false) {
            if (numPortBreakers > 4)
                sqlinject(target);
            if (numPortBreakers > 3)
                httpworm(target);
            if (numPortBreakers > 2)
                relaysmtp(target);
            if (numPortBreakers > 1)
                ftpcrack(target);
            if (numPortBreakers > 0)
                brutessh(target);
            nuke(target);
        }

        if (isRunning('RemoteWeaken.script',host,target) == false && isRunning('RemoteHack.script',host,target) == false  && isRunning('RemoteGrow.script',host,target) == false) {
            if (getServerSecurityLevel(target) > getServerBaseSecurityLevel(target) / 3 + 6) {
                exec('RemoteWeaken.script', host, weakens, target);
            } else if (getServerMoneyAvailable(target) >= 0.75 * getServerMaxMoney(target)) {
                exec('RemoteHack.script', host, hacks, target);
            } else {
                exec('RemoteGrow.script', host, grows, target);
            }    
        }
    }
}