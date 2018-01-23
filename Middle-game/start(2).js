/*
POSTED BY:
u/Mirisme (https://www.reddit.com/user/Mirisme)

POSTED ON:
October 4th, 2017

COMMENT CONTEXT:
"UPDATE Server selection modified on start.script (earlier version ignored some servers due to faulty logic). Target update fixed (earlier version didn't replace less profitable servers correctly).

After using /u/MercuriusXeno progression script for a while (Found here), I wanted to have a better targetting script.

What does it do?

collect all potential target (it's pretty much the start.script modified to pass on target)
maintain a list of best target
attack target using servers
upgrade servers when there's enough money
How do I do that?

So for starters, you'll need every script on the link before, except start.script.

Warning: You may have trouble running the scripts if you have too little ram on you home server.

start.script COST 9.35GB

usage : run start.script"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/745i64/targetting_script/
*/



//presume the host to be the machine this script is running on, should probably be home, but don't let it assume so.
hostName = getHostname();
//initialize the scan array with just this host, this provides a starting point and saves a scan() call.
scanArray = [hostName];
//initialize the current scan length to 0
currentScanLength = 0;
//create an object (array) to hold our servers
servers = [];

canal = 10;
//some optional values to change the behavior of this method.
debugMode = false;
nukeOnlyMode = false;

mode = 0;

doLoop = true;

portBusters = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];

ownedBusters = 0;

getServer = false;

//arbitrary value added for valuating min security in a growth formula for speed/growth value.
minSecurityWeight = 100;
//here is where we keep track of the last run Daemon; when we run a new daemon, we kill the old one.
//this is a less sort-heavy method of targetting "optimally", though it comes with its own imperfections
targetServers = [];
//Empty Canal
empty = read(canal);
while (empty != "NULL PORT DATA"){
    empty = read(canal);
}
while (doLoop) {
    if (mode === 0) {
        previousScanLength = currentScanLength;
        currentScanLength = scanArray.length;
        for (i = previousScanLength; i < currentScanLength; i++) {
            currentHost = scanArray[i];
            //hostName, numPorts, hackingLevel, maxMoney, growthRate, minSecurity
            //0         1         2             3         4           5
            server = [currentHost, getServerNumPortsRequired(currentHost), getServerRequiredHackingLevel(currentHost), getServerMaxMoney(currentHost), getServerGrowth(currentHost), Math.max(1, Math.round(getServerBaseSecurityLevel(currentHost) / 3))];

            //skip home, we don't need to go nuking our machine. foodnstuff is our de facto test/staging server for debug mode.
            if (server[0] != 'home' && (server[0] == 'foodnstuff' || !debugMode) && !(server[1] == 5 && server[2] ==1)) {
                //add the server to the servers object
                servers.push(server);
                if (debugMode) {
                    mode = 1;
                    break; //debug mode stops at foodnstuff
                }
            }

            //add this servers connected nodes (other servers) to the scan list
            newScan = scan(currentHost);

            for (j = 0; j < newScan.length; j++) {
                //exclude anything we have already scanned. names are unique indexes which allows this to work.
                if (scanArray.indexOf(newScan[j]) == -1) {
                    scanArray.push(newScan[j]);
                }
            }
        }
        //if we're about to exit the loop, switch a mode variable from 0 to 1. This moves the script to phase 2, nuking.
        if (currentScanLength == scanArray.length) {
            run("get_server.script");
            mode = 1;
        }
    }
    if (mode == 1) {
        ownedBusters = 0;
        //get the port busters you've got so it's one less thing the nuke script has to figure out.
        //this is done inside the while loop for adaptability, but outside the server loop for speed.
        for (i = 0; i < portBusters.length; i++) {
            //always checking the home machine, presumes your port busters always live at home.
            if (fileExists(portBusters[i], 'home')) {
                ownedBusters++;
            }
        }
        print ('Portbusters the program thinks you own: ' + ownedBusters);
        //loop over all the servers and find potential victims.
        for (i = 0; i < servers.length; i++) {
            server = servers[i];
            //we need to know hacking level and ports needed to nuke to determine viable targets.
            numPorts = server[1];
            hackingLevel = server[2];
            growthRate = server[4];
            minSecurity = server[5];
            //ignore servers above your level and servers you don't have the busters for.
            playerHackingLevel = getHackingLevel();
            if (playerHackingLevel >= hackingLevel && numPorts <= ownedBusters) {
                print ('Vulnerable server ' + server[0] + ' found with difficulty of ' + hackingLevel + ' and ports: ' + numPorts);
                //now grab the other data, we're passing this to the knock script so it can pass it further to the daemon.
                target = server[0];
                hasRun = false;
                //we won't nuke if we have access
                if (!hasRootAccess(target)) {
                    if (numPorts > 0) {
                        brutessh(target);
                    }
                    if (numPorts > 1) {
                        ftpcrack(target);
                    }
                    if (numPorts > 2) {
                        relaysmtp(target);
                    }
                    if (numPorts > 3) {
                        httpworm(target);
                    }
                    if (numPorts > 4) {
                        sqlinject(target);
                    }
                    nuke(target);
                }
                if (!nukeOnlyMode) {
                    //we don't run a daemon on anything like CSEC - stuff with no money is nuke-only.
                    maxMoney = server[3];
                    if (maxMoney > 0) {
                        //calculate value of target
                        weightedValueOfCurrentTarget = round(maxMoney * (minSecurityWeight / minSecurity) * growthRate);
                        //send data of current target
                        write(canal ,[server[0], server[3], server[4], server[5], server[2], weightedValueOfCurrentTarget]);
                    }
                }
                //remove the server from the list, it will eventually be compromised. this lets us stop iterating on it.
                servers.splice(i, 1);
                //decrement to account for the deleted server entry
                i--;
            }
        }
    //if there are servers left in the list, keep going.
    doLoop = servers.length > 0;
    }
}