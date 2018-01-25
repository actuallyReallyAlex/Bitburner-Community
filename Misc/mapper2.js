/*
POSTED BY:
u/wingedRatite (https://www.reddit.com/user/wingedRatite)

POSTED ON:
January 1st, 2017

COMMENT CONTEXT:
"I used your mapper script to write one that creates 3 .txt files, one storing server hostnames, one storing server money value, and one storing server security values in a comma separated array. That way I can run a separate function that has 3 arrays built in it. I run this after I run MaptoFile. It's 8.55 GB currently."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7lmbpa/scripts_using_files/
*/


servers = ["home"];
//clear("nmap.txt");
clear("hostsip.txt");
clear("hostsmon.txt");
clear("hostssec.txt");

for (i = 0; i < servers.length; ++i) {
    hostname = servers[i];
//    write("nmap.txt", hostname
//        + "," + getServerRam(hostname)[0]
//        + "," + getServerNumPortsRequired(hostname)
//        + "," + getServerRequiredHackingLevel(hostname)
//        + "," + getServerMaxMoney(hostname)
//        + "," + getServerMinSecurityLevel(hostname)
//        + "," + getServerGrowth(hostname)
//        + "\r\n");

        if ((getServerMaxMoney(hostname) > 0) && (hasRootAccess(hostname) === true)) {
            write("hostsip.txt", hostname + ",");
            write("hostsmon.txt", getServerMaxMoney(hostname) + ",");
            write("hostssec.txt", getServerMinSecurityLevel(hostname) + ",");
        }

    newScan = scan(hostname);
    for (j = 0; j < newScan.length; j++) {
        if (servers.indexOf(newScan[j]) == -1) {
            servers.push(newScan[j]);
        }
    }
}

tprint("Network mapped.");