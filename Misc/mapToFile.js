/*
POSTED BY:
u/havoc_mayhem (https://www.reddit.com/user/havoc_mayhem)

POSTED ON:
December 23rd, 2017

COMMENT CONTEXT:
"I haven't yet seen any scripts that utilize the files interface, so I put together a few of my own:

Map Network to File (mapToFile.script, 4.7 GB)

This file needs to be run just once at the start of your run, and will create a text file like this:

home,2048,5,1,0,1,0
iron-gym,32,1,100,500000000,10,20
foodnstuff,16,0,1,50000000,3,5
sigma-cosmetics,16,0,5,57500000,3,10
...
Code:(mapToFile.script, 4.7 GB)"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7lmbpa/scripts_using_files/
*/


servers = ["home"];
clear("nmap.txt");

for (i = 0; i < servers.length; ++i) {
    hostname = servers[i];
    write("nmap.txt", hostname
        + "," + getServerRam(hostname)[0]
        + "," + getServerNumPortsRequired(hostname)
        + "," + getServerRequiredHackingLevel(hostname)
        + "," + getServerMaxMoney(hostname)
        + "," + getServerMinSecurityLevel(hostname)
        + "," + getServerGrowth(hostname)
        + "\r\n");

    newScan = scan(hostname);
    for (j = 0; j < newScan.length; j++) {
        if (servers.indexOf(newScan[j]) == -1) {
            servers.push(newScan[j]);
        }
    }
}

tprint("Network mapped.");