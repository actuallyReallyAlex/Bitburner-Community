/*
POSTED BY:
u/desci1 (https://www.reddit.com/user/desci1)

POSTED ON:
July 23rd, 2017

COMMENT CONTEXT:
"This script will scan recursively through every reachable server in the game.

If you delete the print() lines between the comments you may use this very script to do more complex things like hacking all servers or whatever you may think of.

Amount of memory needed (after comments and print()s removed): This script requires 3,08GB of RAM to run for 1 thread(s)"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6p24g8/deepscanscript/
*/



/*
    deepscan.script
    for bitburner's netscript
    version: 14
    winners don't use copyright
    remove all comments to save RAM

    this script scans through every server and prints information about each server, as well as the whole list of all found servers.
    this is meant to be a skeleton to make more complex scripts.
*/

startingServer = 0;
allServers = scan(getHostname());
while (true) {
    servers = allServers;
    // when we reach the last server, start it all over
    if (startingServer == allServers.length) startingServer = 0;
    for (server = startingServer; server < servers.length; server++) {
        // you can change this part to perform whatever you want to servers[server]
        print('============================================================');
        print('all the servers we already found trough scanning:');
        print(allServers);
        print('============================================================');
        print('we are now scanning ' + servers[server]);
        print('root access: ' + hasRootAccess(servers[server]));
        getServerRequiredHackingLevel(servers[server]);
        getServerSecurityLevel(servers[server]);
        getServerBaseSecurityLevel(servers[server]);
        getServerMoneyAvailable(servers[server]);
        getServerMaxMoney(servers[server]);
        getServerRam(servers[server]);
        print('============================================================');
        // end of servers[server] proccessing
        // scans more servers from the current server
        newServers = scan(servers[server]);
        for (newServer = 0; newServer < newServers.length; newServer++) {
            isNewServer = true;
            // we don't want home server or a server which is already in the list
            for (checkServer = 0; checkServer < allServers.length; checkServer++) if (newServers[newServer] == 'home' || newServers[newServer] == allServers[checkServer]) isNewServer = false;
            if (isNewServer) allServers = allServers.concat(newServers[newServer]);
        }
    }
    // next loop should start from the server we just scanned
    startingServer = server;
}