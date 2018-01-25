/*
POSTED BY:
u/havoc_mayhem (https://www.reddit.com/user/havoc_mayhem)

POSTED ON:
December 23rd, 2017

COMMENT CONTEXT:
"Run Hacking Scripts (distrAndRun.script, 6.75 GB)

Copy over scripts to all remote servers we have access to, and target them to hack the most efficient target server.

Code: (distrAndRun.script, 6.75 GB)"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7lmbpa/scripts_using_files/
*/


hackScripts = ["early-hack-template.script", "weaken.script"];
hack_mem = getScriptRam(hackScripts[0], "home");

bestTarget = read("best_target.txt").split(",");
tName = bestTarget[0];
tMaxMoney = bestTarget[4];
tMinSec = bestTarget[5];

money_target = 0.75 *  tMaxMoney;
sec_level = (tMinSec - 0) + 2;     //-0 to convert string to number

tprint("Money: " + money_target);
tprint("Security: " + sec_level);
tprint("Memory Needed: " + hack_mem);

rows = read("nmap.txt").split("\r\n");

for (i = 0; i < rows.length; ++i) {
    serverData = rows[i].split(',');
    if (serverData.length < 7) break; //Ignore last blank row

    svName = serverData[0];
    svRamAvail = serverData[1];
    if (hasRootAccess(svName) && (svName != "home")) {
        scp(hackScripts, "home", svName);
        num_threads = Math.floor(svRamAvail / hack_mem);
        //tprint(svName + " Numthreads: " + num_threads);
        if (num_threads > 0) {
            exec(hackScripts[0] , svName, num_threads, tName, money_target, sec_level);
        }
        exec(hackScripts[1], svName, 1, tName);
    }
}