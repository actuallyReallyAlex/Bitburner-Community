/*
POSTED BY:
u/MercuriusXeno (https://www.reddit.com/user/MercuriusXeno)

POSTED ON:
September 16th, 2017

COMMENT CONTEXT:
"rent.script - COST: 6.60 GB

Use: run rent.script

Description: OPTIONAL, manages hacknet. This is what you run if you want hacknet nodes purchased and upgraded, albeit slowly. This attempts to spend up to 1% of your current cash, per upgrade, on the hacknet."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/70ikjm/progression_scripts_0286/
*/



//1% of current funds, per cycle.
allowancePercentage = 0.01;
while (true) {
    currentCash = getServerMoneyAvailable('home');
    currentCash *= allowancePercentage;
    if (getNextHacknetNodeCost() <= currentCash) {
        purchaseHacknetNode();
    } else {
        for (i = 0; i < hacknetnodes.length; i++) {
            node = hacknetnodes[i];
            upgradeCost = node.getLevelUpgradeCost(1);
            if (upgradeCost <= currentCash) {
                node.upgradeLevel(1);
                break;
            } else {
                ramCost = node.getRamUpgradeCost();
                if (ramCost <= currentCash) {
                    node.upgradeRam();
                    break;
                } else {
                    coreCost = node.getCoreUpgradeCost();
                    if (coreCost <= currentCash) {
                        node.upgradeCore();
                        break;
                    }
                }
            }
        }
    }
}