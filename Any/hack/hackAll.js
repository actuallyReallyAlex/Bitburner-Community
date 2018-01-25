/*
POSTED BY:
u/havoc_mayhem (https://www.reddit.com/user/havoc_mayhem)

POSTED ON:
December 23rd, 2017

COMMENT CONTEXT:
"Get Root Access (hackAll.script, 5.4 GB)

Gets root access to as many servers on the network as possible, using the text file created above.

Also determine the optimal server to target for a hack/grow/weaken cycle, and write its details to best_target.txt.

I currently choose the optimal server based on

svScore = (100 - svMinSec) * svMaxMoney * svGrowRt / svExecTime;
I'm sure this can be optimized further, and look forward to suggestions.

Code: (hackAll.script, 5.4 GB)"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7lmbpa/scripts_using_files/
*/


numBusters = 0;
portBusters = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
for(i = 0; i < portBusters.length; i++) {
    if (fileExists(portBusters[i], "home")) {
        tprint(portBusters[i] + " exists");
        ++numBusters;
    }
    else 
        tprint(portBusters[i] + " missing");
}

myHackLevel = getHackingLevel();
bestTargetIndex = 1;
bestTargetScore = 0;
rows = read("nmap.txt").split("\r\n");

for (i = 0; i < rows.length; ++i) {
    serverData = rows[i].split(',');
    if (serverData.length < 7) break; //Ignore last blank row

    svName = serverData[0];
    //svRamAvail = serverData[1];
    svPortsNeeded = serverData[2];
    svHackLevel = serverData[3];

    //tprint("Testing " + svName);

    if ( ! (hasRootAccess(svName))
        && (numBusters >= svPortsNeeded)
        && (myHackLevel >= svHackLevel) ) {

        if (numBusters > 0) brutessh(svName);
        if (numBusters > 1) ftpcrack(svName);
        if (numBusters > 2) relaysmtp(svName);
        if (numBusters > 3) httpworm(svName);
        if (numBusters > 4) sqlinject(svName);

        nuke(svName);
        tprint("Server hacked: " + svName);
    }
    if (hasRootAccess(svName)) {
        svMaxMoney = serverData[4];
        svMinSec = serverData[5];
        svGrowRt = serverData[6];
        svExecTime = getHackTime(svName);
        svScore = (100 - svMinSec) * svMaxMoney * svGrowRt / svExecTime;
        if(svScore > bestTargetScore){
            bestTargetScore = svScore;
            bestTargetIndex = i;
        }
    }
    //tprint("Done Testing " + svName);
}
write("best_target.txt", rows[bestTargetIndex], "w");
tprint(rows[bestTargetIndex]);