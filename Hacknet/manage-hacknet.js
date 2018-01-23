/*
POSTED BY:
u/MercuriusXeno (https://www.reddit.com/user/MercuriusXeno)

POSTED ON:
July 16th, 2017

COMMENT CONTEXT:
"Thanks, it's just for fun, and there's always some kind of improvement to be made.

If you don't mind it spending a lot of money, you can try something like this, and change the node limit (and other settings) to your liking. The script calls to do anything to hacknet are expensive, and so are the loops. It's 12.34 GB in all. The mincounter keeps it from having to loop through every node when it already has them maxed for a bit of extra ram overhead. You can simplify it greatly to just brute force upgrades and it will reduce cost by quite a bit.

I don't really mess with the hacknet much now; hacking (and other active income) starts to outpace it fairly quickly."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6mf6zy/v0241_progression_scripts_update/
*/



maxHacknetNodes = 30;
maxLevel = 200;
maxRam = 6;
maxCores = 16;
minCounterAlreadyMaxed = 0;
while (true) {
    if (hacknetnodes.length < maxHacknetNodes) {
        purchaseHacknetNode();
    }
    for (i = minCounterAlreadyMaxed; i < hacknetnodes.length; i = i + 1) {        
        toLevel = maxLevel - hacknetnodes[i].level;
        if (toLevel > 0) {
            hacknetnodes[i].upgradeLevel(toLevel);
        }
        ramLoop = 1;
        ramCounter = 0;
        while (ramLoop < hacknetnodes[i].ram) {
            ramLoop = ramLoop * 2;
            ramCounter = ramCounter + 1;
        }
        toRam = maxRam - ramCounter;
        while (toRam > 0) {
            hacknetnodes[i].upgradeRam();
            toRam = toRam - 1;
        }
        toCore = maxCores - hacknetnodes[i].cores;
        while (toCore > 0) {
            hacknetnodes[i].upgradeCore();
            toCore = toCore - 1;
        }
        if (i == minCounterAlreadyMaxed) {
            if (toRam == 0 && toCore == 0 && toLevel == 0) {
                print ('node ' + minCounterAlreadyMaxed + ' maxed');
                minCounterAlreadyMaxed++;
            }
        }
    }
}