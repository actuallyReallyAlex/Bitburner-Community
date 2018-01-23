/*
POSTED BY:
u/desci1 (https://www.reddit.com/user/desci1)

POSTED ON:
July 23rd, 2017

COMMENT CONTEXT:
"This one hacks servers that are not running the loop-hack.script, which means they don't have enough memory to run scripts."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6p24g8/deepscanscript/
*/



/*
    4gb-auto-hack-0ram.script
    for bitburner's netscript
    version: 2
    winners don't use copyright
    remove all comments to save RAM

    this script hacks servers that have only 0gb of RAM and therefore can't run scripts on their own.
    TODO: as there's no getServerMemory() yet, the test for this is too complex and consume a lot of RAM.
*/

startingServer = 0;

hackVersion = 3;

ownServers = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ]

allServers = [ 'foodnstuff' ];

while (true) {
    servers = allServers;
    if (startingServer == allServers.length) startingServer = 0;
    for (server = startingServer; server < servers.length; server++) {
        if (getHackingLevel() >= getServerRequiredHackingLevel(servers[server]) && hasRootAccess(servers[server]) == true && isRunning('loop-hack.script', servers[server], hackVersion) == false) hack(servers[server]);
        newServers = scan(servers[server]);
        for (newServer = 0; newServer < newServers.length; newServer++) {
            isNewServer = true;
            if (newServers[newServer] == 'home') isNewServer = false;
            for (checkServer = 0; checkServer < ownServers.length; checkServer++) if (newServers[newServer] == 'home-' + ownServers[checkServer]) isNewServer = false;
            for (checkServer = 0; checkServer < allServers.length; checkServer++) if (newServers[newServer] == allServers[checkServer]) isNewServer = false;
            if (isNewServer) allServers = allServers.concat(newServers[newServer]);
        }
    }
    startingServer = server;
}