/*
POSTED BY:
u/desci1 (https://www.reddit.com/user/desci1)

POSTED ON:
July 23rd, 2017

COMMENT CONTEXT:
"This one shouldn't consume more than 8gb ram, making it suitable for new games
Current memory usage without the comments: This script requires 7,72GB of RAM to run for 1 thread(s)"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6p24g8/deepscanscript/
*/



/*
    8gb-auto-deepscan.script
    for bitburner's netscript
    version: 12
    winners don't use copyright
    remove all comments to save RAM

    this is a lite version of the auto-deepscan.script intended for servers with a maximum of 8gb available.
*/

startingServer = 0;
allServers = scan(getHostname());
while (true) {
    servers = allServers;
    if (startingServer == allServers.length) startingServer = 0;
    for (server = startingServer; server < servers.length; server++) {
        if (getHackingLevel() >= getServerRequiredHackingLevel(servers[server])) {
            if (hasRootAccess(servers[server]) == false && getServerNumPortsRequired(servers[server]) == 0) {
                nuke(servers[server]);
            }
            if (hasRootAccess(servers[server]) == true) {
                if (isRunning('loop-hack.script', servers[server]) == false) {
                    scp('loop-hack.script', servers[server]);
                    exec('loop-hack.script', servers[server], 1);
                }
                if (isRunning('loop-grow.script', servers[server]) == false) {
                    scp('loop-grow.script', servers[server]);
                    for (t = 10; t > 0; t--) {
                        exec('loop-grow.script', servers[server], t);
                    }
                }
            }
        }
        newServers = scan(servers[server]);
        for (newServer = 0; newServer < newServers.length; newServer++) {
            isNewServer = true;
            for (checkServer = 0; checkServer < allServers.length; checkServer++) if (newServers[newServer] == 'home' || newServers[newServer] == allServers[checkServer]) isNewServer = false;
            if (isNewServer) allServers = allServers.concat(newServers[newServer]);
        }
    }
    startingServer = server;
}