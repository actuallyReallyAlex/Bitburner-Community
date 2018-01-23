/*
POSTED BY:
u/MercuriusXeno (https://www.reddit.com/user/MercuriusXeno)

POSTED ON:
July 10th, 2017

COMMENT CONTEXT:
"Purpose: Handles actually nuking the target. Runs break once to continue the cascade. Runs daemon only if conditions are met. Daemon does all the real work."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6mf6zy/v0241_progression_scripts_update/
*/



thisTarget = args[0];
previousHost = args[1];
minimumHackLevel = args[2];
hackLimit = args[3];
thisHost = getHostname();
portsToBust = getServerNumPortsRequired(thisTarget);   
hasRunBreak = false;
shouldRunDaemon = true;
while (hasRunBreak == false || hasRootAccess(thisTarget) == false || (isRunning('daemon.script', thisHost, thisTarget, previousHost) == false && shouldRunDaemon == true)) {
    portBusters = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
    numPortBreakers = 0;
    for (i = 0; i < portBusters.length; i = i + 1) {
        if (fileExists(portBusters[i], 'home')) {
            numPortBreakers = numPortBreakers + 1;
        }
    }
    if (portsToBust <= numPortBreakers && hasRootAccess(thisTarget) == false) {
        if (portsToBust > 4)
            sqlinject(thisTarget);
        if (portsToBust > 3)
            httpworm(thisTarget);
        if (portsToBust > 2)
            relaysmtp(thisTarget);
        if (portsToBust > 1)
            ftpcrack(thisTarget);
        if (portsToBust > 0)
            brutessh(thisTarget);
        nuke(thisTarget);
    }
    while (isRunning('break.script', thisHost, thisTarget, previousHost, minimumHackLevel, hackLimit) == false && hasRunBreak == false) {
        run('break.script', 1, thisTarget, previousHost, minimumHackLevel, hackLimit);
    }
    hasRunBreak = true;
    serverLevel = getServerRequiredHackingLevel(thisTarget);
    shouldRunDaemon = serverLevel <= hackLimit && serverLevel >= minimumHackLevel && getServerMaxMoney(thisTarget) > 0;
    if (hasRootAccess(thisTarget) == true && shouldRunDaemon == true) {
        while (isRunning('daemon.script', thisHost, thisTarget, previousHost) == false) {
            run('daemon.script', 1, thisTarget, previousHost);    
        }
    }
}