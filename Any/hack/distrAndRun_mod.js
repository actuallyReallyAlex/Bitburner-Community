/*
POSTED BY:
u/wingedRatite (https://www.reddit.com/user/wingedRatite)

POSTED ON:
January 1st, 2017

COMMENT CONTEXT:
"Then I run a modified version of your distrAndRun script: it only runs scripts on my created servers and so is amicable to any RAM amount. It runs a couple of my universal three argument grow-weaken-hack script (2.4 GB, lightweight enough when you have 8TB servers), and then targets every single server with money with a universal hacking script. It's 11.30 GB currently.
...
It always returns 25 errors whenever it finishes because my .txt files end with a hanging comma. But I am bringing in $1.2B/sec on my first BitNode, and without any neutral servers running any scripts, just home and my dong servers.

permalinkembedsavereportgive goldreply"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7lmbpa/scripts_using_files/
*/


hackScripts = ["unihack.script"];
hack_mem = getScriptRam(hackScripts[0], "home");
bestTarget = read("best_target.txt").split(",");
tName = bestTarget[0];
tMaxMoney = bestTarget[4];
tMinSec = bestTarget[5];
money_target = 0.75 *  tMaxMoney;
sec_level = (tMinSec - 0) + 1;     //-0 to convert string to number
tprint("Target:         " + tName);
tprint("Money:          " + money_target);
tprint("Security:       " + sec_level);
tprint("Memory Needed:  " + hack_mem);
dong = 0;
while (dong < 25) {
    scp(hackScripts[0], "home", "dong"+dong);
        exec(hackScripts[0], "dong"+dong, 30, tName, money_target, sec_level);
        exec(hackScripts[0], "dong"+dong, 30, tName, money_target + 1, sec_level);
        exec(hackScripts[0], "dong"+dong, 30, tName, money_target + 2, sec_level);
    dong++;
}
arName = read("hostsip.txt").split(",");
arMoney = read("hostsmon.txt").split(",");
arSec = read("hostssec.txt").split(",");
svRamAvail = getServerRam("dong0");
num_threads = Math.floor((svRamAvail[0] - svRamAvail[1]) / (arName.length * hack_mem));
dong = 0;
i = 0;
while(i < arName.length) { for (i = 0; i < arName.length; ++i) {
    dong = 0;
    tname = arName[i];
    money = 0.75 * arMoney[i];
    sec = (arSec[i] - 0) + 2;
    while (dong < 25) {
        exec(hackScripts[0], "dong"+dong, num_threads, tname, money, sec);
        dong++;
    }
    tprint("Dongs enlarged for: " + tname);
    i++;
    }
}
tprint("Fin");