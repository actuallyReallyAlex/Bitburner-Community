/*
POSTED BY:
u/MercuriusXeno (https://www.reddit.com/user/MercuriusXeno)

POSTED ON:
September 13th, 2017

COMMENT CONTEXT:
"Early in the game, hacknet nodes are a modest source of passive income, but I don't like clicking things. This is a lazy and simplistic method of slowly upgrading nodes that keeps some cash on hand for more important things (like RAM). I don't really bother trying to optimize hacknet because time can be better spent. That said, feel free to recommend better strategies; I'd be interested in seeing an elaborate/optimized hacknet algorithm, regardless of the RAM pressure.

Note: The "break;" calls in the script prevent it from doing more than one thing at a time - the reason for this is primarily to capitalize on only having one getServerMoneyAvailable() call at the beginning. This means it's going to move very slowly. Like I said, I tend to forget about the hacknet.

It's also worth pointing out that RAM costs on the hacknet functions are rather high. It's even pricey to call "hacknetnodes[i]" which is why the immediate declaration of "node = hacknetnodes[i]" saves a bit."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6zrcug/increment_hacknet/
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