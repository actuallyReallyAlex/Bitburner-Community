/*
POSTED BY:
u/desci1 (https://www.reddit.com/user/desci1)

POSTED ON:
July 23rd, 2017

COMMENT CONTEXT:
"Current memory usage without the comments: This script requires 13,06GB of RAM to run for 1 thread(s)"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6p24g8/deepscanscript/
*/



/*
    auto-deepscan.script
    for bitburner's netscript
    version: 12
    winners don't use copyright
    remove all comments to save RAM
*/

// these variables should be incremented when the loop scripts are modified. we will overwrite the loop-scripts on all servers with the latest version, kill the scripts running old versions if any, and execute the new ones.
hackVersion = 3;
growVersion = 3;

// these are my own servers, which shouldn't be hacked, grown, weakened, etc.
ownServers = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ]

startingServer = 0;

allServers = [ 'foodnstuff' ];
newServers = scan(getHostname());

for (newServer = 0; newServer < newServers.length; newServer++) {
    isNewServer = true;
    if (newServers[newServer] == 'home') isNewServer = false;
    for (checkServer = 0; checkServer < ownServers.length; checkServer++) if (newServers[newServer] == 'home-' + ownServers[checkServer]) isNewServer = false;
    for (checkServer = 0; checkServer < allServers.length; checkServer++) if (newServers[newServer] == allServers[checkServer]) isNewServer = false;
    if (isNewServer) allServers = allServers.concat(newServers[newServer]);
}

while (true) {
    servers = allServers;
    // when we reach the last server, start it all over
    if (startingServer == allServers.length) startingServer = 0;
    for (server = startingServer; server < servers.length; server++) {
        if (getHackingLevel() >= getServerRequiredHackingLevel(servers[server])) {
            if (hasRootAccess(servers[server]) == false) {
                // i've decided to do this way after much testing and logic. netscript needs more features to make this code simplier for every and all possibilities. either that or my solution is not good.
                if (getServerNumPortsRequired(servers[server]) > 0) {
                    if (getServerNumPortsRequired(servers[server]) == 1 && fileExists('brutessh.exe')) {
                        brutessh(servers[server]);
                        nuke(servers[server]);
                    } else if (getServerNumPortsRequired(servers[server]) == 2 && fileExists('ftpcrack.exe')) {
                        brutessh(servers[server]);
                        ftpcrack(servers[server]);
                        nuke(servers[server]);
                    } else if (getServerNumPortsRequired(servers[server]) == 3 && fileExists('relaysmtp.exe')) {
                        brutessh(servers[server]);
                        ftpcrack(servers[server]);
                        relaystmp(servers[server]);
                        nuke(servers[server]);
                    } else if (getServerNumPortsRequired(servers[server]) == 4 && fileExists('httpworm.exe')) {
                        brutessh(servers[server]);
                        ftpcrack(servers[server]);
                        relaystmp(servers[server]);
                        httpworm(servers[server]);
                        nuke(servers[server]);
                    } else if (getServerNumPortsRequired(servers[server]) == 5 && fileExists('sqlinject.exe')) {
                        brutessh(servers[server]);
                        ftpcrack(servers[server]);
                        relaystmp(servers[server]);
                        httpworm(servers[server]);
                        sqlinject(servers[server]);
                        nuke(servers[server]);
                    }
                } else {
                    nuke(servers[server]);
                } 
            }
            if (hasRootAccess(servers[server]) == true) {
                if (isRunning('loop-hack.script', servers[server], hackVersion) == false) {
                    while (isRunning('loop-hack.script', servers[server]) == true) kill('loop-hack.script', servers[server]);
                    for (version = 0; version < hackVersion; version++) {
                        while (isRunning('loop-hack.script', servers[server], version) == true) kill('loop-hack.script', servers[server], version);
                    }
                    scp('loop-hack.script', servers[server]);
                    exec('loop-hack.script', servers[server], 1, hackVersion);
                }
                if (isRunning('loop-grow.script', servers[server], growVersion) == false) {
                    while (isRunning('loop-grow.script', servers[server]) == true) kill('loop-grow.script', servers[server]);
                    for (version = 0; version < growVersion; version++) {
                        while (isRunning('loop-grow.script', servers[server], version) == true) kill('loop-grow.script', servers[server], version);
                    }
                    scp('loop-grow.script', servers[server]);
                    // try to run the grow script with as much threads as possible
                    for (threads = 10; threads > 0; threads--) {
                        exec('loop-grow.script', servers[server], threads, growVersion);
                    }
                }
            }
        }
        // scans more servers from the current server
        newServers = scan(servers[server]);
        for (newServer = 0; newServer < newServers.length; newServer++) {
            isNewServer = true;
            // we don't want home server
            if (newServers[newServer] == 'home') isNewServer = false;
            // i don't want my own servers
            for (checkServer = 0; checkServer < ownServers.length; checkServer++) if (newServers[newServer] == 'home-' + ownServers[checkServer]) isNewServer = false;
            // we don't want a server which is already in the list
            for (checkServer = 0; checkServer < allServers.length; checkServer++) if (newServers[newServer] == allServers[checkServer]) isNewServer = false;
            if (isNewServer) allServers = allServers.concat(newServers[newServer]);
        }
    }
    // next loop should start from the server we just scanned
    startingServer = server;
}