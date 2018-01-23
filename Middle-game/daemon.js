/*
POSTED BY:
u/MercuriusXeno (https://www.reddit.com/user/MercuriusXeno)

POSTED ON:
September 16th, 2017

COMMENT CONTEXT:
"daemon.script - COST: 12.25GB with Auto-Player-Mults, 8.25GB if mults are defined manually

Note: You can use change-percentage.script to change the percent-to-steal in real-time without restarting the daemon. See optional scripts below

Note2: The script now gets your player mults, but the function is expensive (4GB!) You can reduce it by defining your multipliers in the script by hand (hard coding them).

Called by start.script automatically, if you call it by hand you must supply it with these params
Use: run daemon.script [target], [maxMoney], [growthRate], [minSecurity], [serverHackingLevel]

Description: Handles hacking using two timed scheduler processes that perform a hack-weaken grow-weaken in sequence. Fires as many cycles of this as it thinks you can handle based on RAM. Adjusts percentage up when you've got more cycles than it can fit into the weaken execution time, to a max of 98%."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/70ikjm/progression_scripts_0286/
*/



hostName = getHostname();

//thanks to these sweet functions you no longer have to do this manually
//THIS FUNCTION ALONE IS VERY EXPENSIVE (4GB!!), comment this out and input them manually if you're having RAM issues.
mults = getHackingMultipliers();
playerHackingMoneyMult = mults.money;

//and these are for growth
playerHackingGrowMult = mults.growth;

bitnodeGrowMult = 1.00;

bitnodeWeakenMult = 1.00;

//IMPORTANTE. Adjust this for bitnodes!
// //uncomment this at SF-5 to handle your bitnode multipliers for you
// mults = getBitNodeMultipliers();
// // ServerGrowthRate: 1,
// // ServerWeakenRate: 1,
// // ScriptHackMoney: 1,
// playerHackingMoneyMult *= mults.ScriptHackMoney; //applying the multiplier directly to the player mult
// bitnodeGrowMult = mults.ServerGrowthRate;

// //and this is for weaken
// bitnodeWeakenMult = mults.ServerWeakenRate;


//percent to take from the server with each pass, this is something you can configure if you want.. take care though.
percentageToSteal = 0.1;

//-----------------------------HERE BE ARGS.. ARRRGS. And other constants----------

//first thing's first, args
target = args[0];
//tprint('Calculating daemon constants and getting args for ' + target);
//Used to formulate growth rate, pulled from start.script
constantGrowthRate = args[2];

//unadjusted server growth rate, this is way more than what you actually get
unadjustedGrowthRate = 1.03;

//max server growth rate, growth rates higher than this are throttled.
maxGrowthRate = 1.0035;

//these are the most important things here.
maxMoney = args[1];
minSecurity = args[3];
serverHackingLevel = args[4];

//these are the variables we're using to record how long it takes to execute at minimum security
growExecutionTime = 0;
weakenExecutionTime = 0;
hackExecutionTime = 0;

//track how costly (in security) a growth/hacking thread is.
growthThreadHardening = 0.004;
hackThreadHardening = 0.002;

//constant, potency of weaken threads
weakenThreadPotency = 0.05 * bitnodeWeakenMult;

// hacking target requires 1.50GB of RAM to run for 1 thread(s)
hackCost = 1.5;

// weaken-target.script requires 1.55GB of RAM to run for 1 thread(s)
weakenCost = 1.555;

// grow-target.script requires 1.55GB of RAM to run for 1 thread(s)
growCost = 1.555;

// one-time scheduler cost per cycle
schedulerCost = 2.40 * 2;

//step delay to force the timing on the scheduler.
stepDelay = 7;

//window delay is twice the stepDelay
windowDelay = stepDelay * 2;

//activationDelay is what I'm using to say "scripts take a little time to spool up so don't start counting yet"
activationDelay = 6;

//killDelay is what I'm using to say "scripts take a little time to die down", similarly
killDelay = 8;

//--------------- PREEMPTIVE CULL ---------------------------------------------------
//if previous daemons were running, this kills all their child scripts
scriptsToCull = ['weaken-target.script', 'grow-target.script', 'hack-target.script'];
for (i = 0; i < scriptsToCull.length; i++) {
    scriptKill(scriptsToCull[i], hostName);
}

//according to chapt3r, it shouldn't take terribly long for all kills to finish terminating existing scripts - we sleep here just in case

sleep(killDelay * 1000, false);

//--------------- AND HERE'S THE SCRIPT ITSELF ---------------------------------------
//this is just a constant loop, I use a var just in case I change my mind.
doLoop = true;

while (doLoop) {
    changedPercentage = read(1);
    if (changedPercentage !== 'NULL PORT DATA') {
        percentageToSteal = changedPercentage;
    }
    hackingLevel = getHackingLevel();
    currentSecurity = getServerSecurityLevel(target);

    if (currentSecurity > minSecurity) {
        //execution times based on current security, how long to sleep, since we're using all available RAM to weaken target
        weakenExecutionTime = getWeakenTime(target);
        weakenExecutionTime = round(weakenExecutionTime * 1000) / 1000;

        threadsNeeded = Math.ceil((currentSecurity - minSecurity) / weakenThreadPotency);
        ramAvailableArray = getServerRam(hostName);
        ramAvailable = ramAvailableArray[0] - ramAvailableArray[1];
        threadsUsed = Math.min(Math.floor(ramAvailable / weakenCost), threadsNeeded);

        //this causes the script to pass through this cycle if it can't weaken, causing it to idle until some RAM is free.
        if (threadsUsed > 0) {
            run('weaken-target.script', threadsUsed, target);
            delay = (weakenExecutionTime + activationDelay + killDelay);

            sleep(delay * 1000, false);
        }
    } else {
        adjGrowthRate = 1 + ((unadjustedGrowthRate - 1) / minSecurity);
        adjGrowthRate = Math.min(maxGrowthRate, adjGrowthRate);
        serverGrowthPercentage = constantGrowthRate / 100;
        numServerGrowthCyclesAdjusted = serverGrowthPercentage * bitnodeGrowMult * playerHackingGrowMult;
        serverGrowth = Math.pow(adjGrowthRate, numServerGrowthCyclesAdjusted);

        neededToMaxInitially = maxMoney / Math.max(getServerMoneyAvailable(target), 1);

        //here we presume that 1 / (percentageToHack) is the actual coefficient to achieve our "recovery" growth each theft.
        neededToMax = 1 / (1 - percentageToSteal); //maxMoney / Math.max(getServerMoneyAvailable(target), 1);

        //this is the cycles needed not accounting for growth mults (bitnode/player) and growthPercentage yet.
        cyclesNeededToGrowInitially = Math.log(neededToMaxInitially) / Math.log(adjGrowthRate);
        cyclesNeededToGrow = Math.log(neededToMax) / Math.log(adjGrowthRate);

        //since the player growth mult and bitnode mult are applied to the *exponent* of the growth formula
        //this pulls them back out. serverGrowthPercentage ends up being a multiplier for threads needed in this case.
        threadsNeededToGrowInitially = Math.ceil(cyclesNeededToGrowInitially / (serverGrowthPercentage * bitnodeGrowMult * playerHackingGrowMult));

        totalGrowCostInitially = threadsNeededToGrowInitially * growCost;


        threadsNeededToGrow = Math.ceil(cyclesNeededToGrow / (serverGrowthPercentage * bitnodeGrowMult * playerHackingGrowMult));

        totalGrowCost = threadsNeededToGrow * growCost;


        //execution times based on min security, as a best guess for how much we can do in one weaken cycle.
        weakenExecutionTime = getWeakenTime(target);
        weakenExecutionTime = round(weakenExecutionTime * 1000) / 1000;

        growExecutionTime = getGrowTime(target);
        growExecutionTime = round(growExecutionTime * 1000) / 1000;

        hackExecutionTime = getHackTime(target);
        hackExecutionTime = round(hackExecutionTime * 1000) / 1000;

        //one of the money multipliers, we base it off of min security, but we have to account for the offsets we've fired.
        difficultyMult = (100 - Math.min(100, minSecurity)) / 100;

        skillMult = (hackingLevel - (serverHackingLevel - 1)) / hackingLevel;
        //difficulty mult is a constant based on min security, but skill mult is based on your current hacking level.
        percentMoneyHacked = difficultyMult * skillMult * (playerHackingMoneyMult / 240);

        //I can't imagine your hacking skills being this high but what the hell, it's part of the formula.
        percentMoneyHacked = Math.min(1, Math.max(0, percentMoneyHacked));

        threadsNeededToHack = Math.floor(percentageToSteal  / percentMoneyHacked);
        percentageToStealForDisplay = round(percentageToSteal * 100);
        totalHackCost = (threadsNeededToHack * hackCost);

        threadsNeededToWeakenForHack = (threadsNeededToHack * hackThreadHardening);
        threadsNeededToWeakenForHack = Math.ceil(threadsNeededToWeakenForHack / weakenThreadPotency);
        totalWeakenCostForHack = (threadsNeededToWeakenForHack * weakenCost);

        threadsNeededToWeakenForGrow = (threadsNeededToGrow * growthThreadHardening);
        threadsNeededToWeakenForGrow = Math.ceil(threadsNeededToWeakenForGrow / weakenThreadPotency);
        totalWeakenCostForGrow = (threadsNeededToWeakenForGrow * weakenCost);

        totalCostForAllCycles = totalHackCost + threadsNeededToWeakenForHack + totalGrowCost + totalWeakenCostForGrow + schedulerCost;
        hostRamAvailable = getServerRam(hostName);

        cyclesSupportedByRam = Math.floor((hostRamAvailable[0] - hostRamAvailable[1]) / totalCostForAllCycles);

        tprint (target + ' --- Hack to ' + percentageToStealForDisplay.toString() + '%' + ' x ' + cyclesSupportedByRam.toString() + ' cycles with a weaken execution time of ' + weakenExecutionTime.toString());

        skipHackDueToCycleImperfection = false;
        if (weakenExecutionTime / windowDelay < cyclesSupportedByRam && percentageToSteal < 0.98) { //max of 98%
            tprint ('Based on ' + windowDelay.toString() + ' second window timing, percentage to steal of ' + percentageToStealForDisplay.toString() + ' is too low. Adjusting for next run-loop.');
            percentageToSteal += 0.01;
            skipHackDueToCycleImperfection = true;
        } else if (cyclesSupportedByRam === 0 && percentageToSteal > 0.02) { //minimum of 2%
            tprint ('Current percentage to steal of ' + percentageToStealForDisplay.toString() +  ' is too high for even 1 cycle. Adjusting for next run-loop.')
            percentageToSteal -= 0.01;
            skipHackDueToCycleImperfection = true;
        }

        if (threadsNeededToGrowInitially > 0) {
            threadsAvailableToGrow = Math.min(threadsNeededToGrowInitially, (hostRamAvailable[0] - hostRamAvailable[1]) / growCost);
            run ('grow-target.script', threadsAvailableToGrow, target);
            tprint('Server is being grown..');
            delay = (growExecutionTime + activationDelay + killDelay);
            sleep(delay * 1000, false);
        } else {
            //pass over this run so that the script can obtain a better cycle estimation.
            if (!skipHackDueToCycleImperfection) {
                for (i = 0; i < cyclesSupportedByRam; i++) {
                    scripts = ['hack-scheduler.script', 'grow-scheduler.script'];
                    threadsNeededForWeaken = [threadsNeededToWeakenForHack, threadsNeededToWeakenForGrow];
                    threadsNeeded = [threadsNeededToHack, threadsNeededToGrow];
                    executionTime = [hackExecutionTime, growExecutionTime];
                    for (j = 0; j < scripts.length; j++) {
                        run (scripts[j], 1, target, threadsNeededForWeaken[j], threadsNeeded[j], weakenExecutionTime, executionTime[j], i);
                        sleep(stepDelay * 1000, false);
                    }
                }
                sleep ((weakenExecutionTime + activationDelay + killDelay) * 1000, false);
            }
        }
    }
}