/*
POSTED BY:
u/Mirisme (https://www.reddit.com/user/Mirisme)

POSTED ON:
October 4th, 2017

COMMENT CONTEXT:
"get_server.script 16.30GB

usage : let start.script start it

Description:

Get target from port (default 10, see variable canal)
Buy servers
Launch daemon on home server if it has more ram than the minimum ram (default 64 GB)
Upgrade servers (hold off buying server to upgrade every 3 servers by defaut) until they have a maximum value of ram (65536 GB)
You can limit the number of servers used for the daemons."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/745i64/targetting_script/
*/



canal = 10;//Communication channel with start.script
maxRam = 65536; //max value of server ram
minRam = 64; //starting value of server ram
maxServers = 24; //max number of server the script will buy
maxUpgrade = [3, 3]; //max server to be bought before trying to upgrade old ones, the second value is the increment after the upgrade
neededFiles = ["daemon.script", "grow-scheduler.script", "hack-scheduler.script", "grow-target.script", "hack-target.script", "weaken-target.script"];
serversPrefix = "AttackServer";
homeRam = getServerRam("home");

//Variable initialization
tryForUpgrade = false;
checkForUpgrade = false;
bougthServer = 0;
targetServers = [];
homeServerOffset = 0;
//Comment this if you don't want to use your home server
if (homeRam[0] > minRam){
    homeServerOffset = 1;
}
//[0] Hostname [1] Maxmoney [2] GrowthRate [3] MinSecurity [4] HackingLevel [5] ServerValue [6] AttackServer [7] AttackServerCreated
//  ##Functions##
//NewServer Server Assignment
function serverExistFunction(server){
    return serverExists(server);
}
//Assign to home or to normal assignment
function assignServer(newServer){
    if (targetServers.length == 0 && homeServerOffset == 1){
        newServer[6] = "home";
        newServer[7] = true;
    } else{
        newServer[6] = serversPrefix + (targetServers.length - homeServerOffset);
        newServer[7] = serverExistFunction(newServer[6]);
    }
    return newServer;
}
//Check for needed file on server and launch daemon
function daemonCheck(server){
    if (server[7]){
        for (j = 0; j < neededFiles.length; j++) {
            file = fileExists(neededFiles[j], server[6]);
            if (!file){
                scp(neededFiles[j], server[6]);
            }
        }
        hasRunDaemon = isRunning('daemon.script', server[6], server[0], server[1], server[2], server[3], server[4]);
        while (!hasRunDaemon) {
            scriptKill("daemon.script", server[6]);
            hasRunDaemon = exec('daemon.script', server[6], 1, server[0], server[1], server[2], server[3], server[4]);
        }
    }
}
doLoop = true;
while(doLoop){
    newServer = read(canal);
    while (newServer != "NULL PORT DATA"){
        tprint(newServer);
        if (targetServers.length < maxServers + homeServerOffset) { //if targetServers length < maxServers, you need to populate the array
            targetServers.push(assignServer(newServer, targetServers));
            daemonCheck(targetServers[targetServers.length - 1]);
        } else { //here is the full targetting procedure, it compares the new target with the ones on the list, and replace the least profitable one
            replacedServer = [-1, 0];
            for (i = 0; i < targetServers.length; i++){
                if (newServer[5] > targetServers[i][5] && (targetServers[i][5] < replacedServer[1] || replacedServer[1] == 0)){
                    replacedServer = [i, targetServers[i][5]];
                    newServer = assignServer(newServer, targetServers);
                }
            }
            tprint(replacedServer);
            if (replacedServer[0] >= 0) {
                tprint("Replaced " + targetServers[replacedServer[0]][0] + " by " + newServer[0]);
                targetServers.splice(replacedServer[0], 1, newServer);
                daemonCheck(newServer);
            }

        }
        newServer = read(canal);
    }
    /*To be redone, for the moment check all servers each loop and buy 
    a base server except if the ratio to upgraded and base server is not good. 
    This ratio does not work if the script is reset.*/
    bougthServer = 0;
    for (i = homeServerOffset; i < targetServers.length && bougthServer < maxUpgrade[0]; i++){
        serverToTest = targetServers[i][6];
        isCreated = false;
        if(!targetServers[i][7]){
            purchaseServer(serverToTest, minRam);
            isCreated = serverExistFunction(serverToTest);
            if (isCreated){
                targetServers[i][7] = true;
                checkForUpgrade = true;
                daemonCheck(targetServers[i]);
                bougthServer++;
            }
        } else {
            bougthServer++;
        }
    }
    //check which server is to be upgraded
    if (checkForUpgrade){
        tryForUpgrade = false;
        // 0 : Server, 1 : ServerNewRam, 2 : TargetValue, 3 : ServerPrice, 4 : TargetArray
        serverToUpgrade = [0, -1, -1, 0, 0];
        for (i = homeServerOffset; i < targetServers.length; i++){
            if (targetServers[i][7]){
                serverRam = getServerRam(targetServers[i][6])[0];
                serverPrice = (serverRam * 50000 * 4); //apparently server price is 50000 x the desired ram
                newRam = serverRam * 4;
                if ((newRam < serverToUpgrade[1] || serverToUpgrade[1] < 0) && newRam <= maxRam){ //choose the first server with the less RAM which has the greatest weightedValueOftargetServers
                    tryForUpgrade = true;
                    checkForUpgrade = false;
                    serverToUpgrade = [targetServers[i][6], newRam, targetServers[i][5], serverPrice, targetServers[i]];
                }
            }
        }
    } else if (serverExistFunction(serversPrefix + "0") && !tryForUpgrade){
        checkForUpgrade = true;
    }
    /*TryToUpgrade the server passed on, need to be check each loop
    because the server is bought only if there's enough money
    the script would be stuck waiting for money otherwise*/
    if (tryForUpgrade){
        money = getServerMoneyAvailable("home");
        canBuy = (serverToUpgrade[3] < money); //check if server can be bougth 
        if (canBuy){
            //Print upgrade details
            tprint("Upgrade server " + serverToUpgrade[0] + " Previous RAM : " + (serverToUpgrade[1]/4) + " Installed RAM : " + serverToUpgrade[1]);
            upgradedServerName = serverToUpgrade[0];
            exist = serverExistFunction(upgradedServerName);
            while (exist){ //kill all program on the server to upgrade and delete it
                killall(upgradedServerName);
                exist = deleteServer(upgradedServerName);
                exist = !exist;
            }
            while (!exist){ //buy server with new ram value
                purchaseServer(upgradedServerName, serverToUpgrade[1]);
                exist = serverExistFunction(upgradedServerName);

            }
            daemonCheck(serverToUpgrade[4]);
            maxUpgrade[0] = maxUpgrade[0] + maxUpgrade[1];
            checkForUpgrade = true;
            tryForUpgrade = false;
        }
    }
}