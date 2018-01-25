/*
POSTED BY:
u/havoc_mayhem (https://www.reddit.com/user/havoc_mayhem)

POSTED ON:
January 8th, 2017

COMMENT CONTEXT:
"I think I've been able to put together the ultimate Hacknet script. It takes a parameter for breakeven time (in seconds) and continues to buy upgrades and nodes which will pay back their cost within the time limit specified.

Features:

Optimizes calculation for any combination of Bitnode & Augment multipliers.
Breakeven time is currently specified as a constant, but can be passed as an argument instead if needed.
Most Netscript functions are in wrapper functions, to minimize the RAM footprint.
Shortcomings:

I have no straightforward way to track the total cash that has been spent on upgrading a node. Without this, I can't precisely calculate the cost effectiveness of new nodes. As a workaround, I currently just buy nodes where the initial cost for the node can pay off within half the breakeven time specified.
Upgrades are bought in order of cash availability, not best bang for buck, to save on calculation complexity.
Code: setup-hacknet.script (7.70GB)"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7ov7a6/the_ultimate_hacknet_script_almost/
*/


function calcGainRate(X, Y, Z) {
    return (X*1.6) * Math.pow(1.035,Y-1) * ((Z+5)/6);
}
function gainFromLevelUpgrade(X, Y, Z) {
    return (1*1.6) * Math.pow(1.035,Y-1) * ((Z+5)/6);
}
function gainFromRamUpgrade(X, Y, Z) {
    return (X*1.6) * (Math.pow(1.035,(2*Y)-1) - Math.pow(1.035,Y-1)) * ((Z+5)/6);
}
function gainFromCoreUpgrade(X, Y, Z) {
    return (X*1.6) * Math.pow(1.035,Y-1) * (1/6);
}
function hNodes(){  //Wrapper to save on RAM costs
    return hacknetnodes;
}
function upgradeNodeLevel(X, i, levels){   //Wrapper to save on RAM costs
    print("Node " + i + ": Attempting Level Upgrade: " + hNodes()[i].upgradeLevel(levels));
}
function upgradeNodeRam(Y, i){             //Wrapper to save on RAM costs
    print("Node " + i + ": Attempting RAM Upgrade: " + hNodes()[i].upgradeRam());
}
function upgradeNodeCore(Z, i){            //Wrapper to save on RAM costs
    print("Node " + i + ": Attempting Core Upgrade: " + hNodes()[i].upgradeCore());
}

breakevenTime = 3600*4;//Time in seconds

//Ensure at least one node has been purchased
if(hNodes().length === 0) purchaseHacknetNode();

//Calculate the gain multiplier by checking actual gain vs theoretical
firstNode = hNodes()[0];
X = firstNode.level;
Y = firstNode.ram;
Z = firstNode.cores;
gainMul = firstNode.moneyGainRatePerSecond/calcGainRate(X,Y,Z);

checkForMoreUpgrades = true;
while(checkForMoreUpgrades) {
    checkForMoreUpgrades = false;

    //Update the first node
    if ( (X < 200) &&
        (firstNode.getLevelUpgradeCost(1) < (breakevenTime * gainMul * gainFromLevelUpgrade(X, Y, Z))) ) {
        upgradeNodeLevel(X,0,1);
        checkForMoreUpgrades = true;
    }
    if ( (Y < 64) &&
        (firstNode.getRamUpgradeCost() < (breakevenTime * gainMul * gainFromRamUpgrade(X, Y, Z))) ) {
        upgradeNodeRam(Y,0);
        checkForMoreUpgrades = true;
    }
    if ( (Z < 16) &&
        (firstNode.getCoreUpgradeCost() < (breakevenTime * gainMul * gainFromCoreUpgrade(X, Y, Z))) ) {
        upgradeNodeCore(Z,0);
        checkForMoreUpgrades = true;
    }

    //Buy more nodes if cost effective 
    if( getNextHacknetNodeCost() < (breakevenTime * hNodes()[0].moneyGainRatePerSecond / 2) ) {
        i = purchaseHacknetNode();
        print("Bought a new node: " + i);
        checkForMoreUpgrades = true;
    }

    //Match all extra nodes to the first node
    for (i = 1; i < hNodes().length; i++){
        while(hNodes()[i].level < hNodes()[0].level)
            upgradeNodeLevel(hNodes()[i].level, i,(hNodes()[0].level - hNodes()[i].level));
        while(hNodes()[i].ram < hNodes()[0].ram)
            upgradeNodeRam(hNodes()[i].ram, i);
        while(hNodes()[i].cores < hNodes()[0].cores)
            upgradeNodeCore(hNodes()[i].cores, i);
    }
}

tprint("Done.");