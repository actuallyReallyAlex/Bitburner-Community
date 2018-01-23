/*
POSTED BY:
u/MercuriusXeno (https://www.reddit.com/user/MercuriusXeno)

POSTED ON:
September 12th, 2017

COMMENT CONTEXT:
"Iterate and scan all the game servers and save some of the most important information to an array of arrays:

At the time of writing, the Array-Array looks like this:

[[HostName, HackingLevel, MaxMoney, GrowthRate, MinSecurity],
[HostName, HackingLevel, MaxMoney, GrowthRate, MinSecurity],
[HostName, HackingLevel, MaxMoney, GrowthRate, MinSecurity]...]
The reason you'd want to do this is, by using the array, you don't have to call the functions (getMaxMoney, getHackingLevel, getBaseSecurity, etc) anymore - you have them saved already. This saves you RAM in child scripts; there's a wide range of applications once you have this basic info "stored". Could be trivially modified to include Machine-RAM, Ports-Needed-To-Nuke and whatever other static values you can avoid calling twice. The whole point is to save RAM for functionality in other scripts by passing the values in as args; in RAM terms, args cost nothing.

Note: It takes a while to get its array finished; ideally you should only need to build the array once. Add scripts to the end of this template and you'll be able to use the servers array to perform whatever it is you want to do, whether that's nuking, running a daemon, a complex sorting/best-target algorithm, etc."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6zoeqn/recursive_scan_array_of_server_arrays/
*/



hostName = getHostname();
scanArray = [hostName];
currentScanLength = 0;
servers = [];
while (currentScanLength < scanArray.length) {
    previousScanLength = currentScanLength;
    currentScanLength = scanArray.length;
    for (i = previousScanLength; i < currentScanLength; i++) {
        currentHost = scanArray[i];
        minSecurity = Math.max(1, Math.round(getServerBaseSecurityLevel(currentHost) / 3));
        server = [currentHost, getServerRequiredHackingLevel(currentHost), getServerMaxMoney(currentHost), getServerGrowth(currentHost), minSecurity];
        servers.push(server);
        //uncomment this if you'd like to see a printout of the array as it is being made
        // tprint(server[0]);
        // tprint('----------------');
        // tprint('Difficulty: ' + server[1] + ' | Potential: $' + server[2]);
        // tprint('Growth Rate: ' + server[3] + ' | Security: ' + server[4]);
        // tprint('----------------');
        newScan = scan(currentHost);
        for (j = 0; j < newScan.length; j++) {
            if (scanArray.indexOf(newScan[j]) == -1) {
                scanArray.push(newScan[j]);
            }
        }
    }
}
//Put stuff in me starting here. Use the servers object. Start Nukers/Watcher Daemons/Etc.