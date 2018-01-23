/*
POSTED BY:
u/Reydien (https://www.reddit.com/user/Reydien)

POSTED ON:
September 15th, 2017

COMMENT CONTEXT:
"FOREWARNING: This script is designed to be run on a server with tens of thousands of GB of free RAM. This script also does not always keep the full amount of necessary RAM occupied, so if you are checking server ram in other scripts it may not be accurate.

This script will automatically determine how many thread of hack is needed to take a given server (at minimum security) from 100% money to 0% money, how many threads of grow is then needed to take the server back to 100% money, and finally how many threads of weaken is needed to bring the server back down to minimum security to repeat the process. It then uses those numbers and runs a set of ultra-light scripts to run each function in turn. The end result is that you receive MAX_MONEY from the server for every cycle of weaken you run.

This script DOES NOT:

Nuke the server. You must hack it manually or with another script first.

Adjust its values as your hacking skill increases. At higher levels the hack script be overshooting the 100%, but that has no adverse effect.

Check to see if the server has enough RAM for the process. Because the sub-scripts are not always running, simply checking free RAM can be deceiving.

BE WARNED: If you run this when your hacking skill is exactly equal to the server's required skill, it will use A LOT of ram, like 300,000GB or more. I would recommend at least +10 skill, which would put the ram usage at about double the eventual lower limit.

Scripts

There are 4 scripts, Autohack.script, hack.script, grow.script, weaken.script. After saving all four, the syntax is simply "run Autohack.script target" Autohack.script"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/70dj0q/autohack_script_set_for_midtolate_game/
*/



//Skill Multiplier Constants, update after augmentations
hackmult = 2.6880;
growmult = 1.7708;
//Bitnode Multiplier Constants, update after changing Bitnodes
bitnodehackmult = 1.0000;
bitnodegrowmult = 1.0000;
bitnodeweakenmult = 1.0000;

target = args[0];

if (hasRootAccess(args[0]) === false) {tprint(target + " is not hacked yet.")}
else
{
    //Gather Hack-related Variables
    skill = getHackingLevel();
    reqHack = getServerRequiredHackingLevel(target);
    minsecurity = Math.max(round(getServerBaseSecurityLevel(target)/3),1);

    //Calculate number of Hack Threads Required
    perhack = (100-minsecurity) * ((skill-reqHack+1)/skill) / 24000 * hackmult * bitnodehackmult;
    hacks = Math.ceil(1/perhack);

    //Gather Growth-related Variables
    growth = getServerGrowth(target);
    security = minsecurity + hacks * 0.002;
    maxmoney = getServerMaxMoney(target);

    //Calculate number of Grow Threads Required
    growpercent = Math.min(1 + 0.03/security,1.0035);
    pergrow = Math.pow(growpercent,growth/100 * growmult * bitnodegrowmult);
    var1 = maxmoney * Math.log(pergrow);
    lambert = Math.log(var1)-Math.log(Math.log(var1))-Math.log(1-Math.log(Math.log(var1))/Math.log(var1));
    grows = Math.ceil(lambert/Math.log(pergrow));

    //Calculate number of Weaken Threads Required
    weakens = Math.ceil((((hacks * 0.002) + (grows * 0.004)) / (0.05 * bitnodeweakenmult)));
    maxweakens = (100 - minsecurity) / (0.05 * bitnodeweakenmult);
    if (weakens > maxweakens) {weakens = maxweakens}

    //Add up how much memory this will use, report the value
    totalmem = hacks * 1.80 + grows * 1.55 + weakens * 1.55 + 6.70;
    tprint("Preparing to attack " + target + " with " + hacks + " hacks, " + grows + " grows, and " + weakens + "weakens for a total of " + totalmem + "GB of memory use");

    currsecurity = getServerSecurityLevel(target);

    if (currsecurity > minsecurity)
    {
        //tprint("bringing " + target + " down to min security...");
        run('weaken.script',Math.ceil((currsecurity - minsecurity) / 0.05),target);

        while (isRunning('weaken.script',getHostname(),target))
        {
            sleep(1000,false);
        }
        //tprint(target + " weakened, beginning hack.");
    }

    while (true)
    {
        run('weaken.script',weakens,target);
        run('grow.script',grows,target);
        if (isRunning('hack.script',getHostname(),target) === false) {run('hack.script',hacks,target);}

        while (isRunning('weaken.script',getHostname(),target))
        {
            sleep(1000,false);
        }
    }
}