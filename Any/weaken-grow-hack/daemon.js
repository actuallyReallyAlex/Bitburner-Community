/*
POSTED BY:
u/MercuriusXeno (https://www.reddit.com/user/MercuriusXeno)

POSTED ON:
July 10th, 2017

COMMENT CONTEXT:
"You CAN run the daemon by hand, just give it a target. When run automatically, it has a second param that never gets used; its a leftover from me writing "auto-kill" scripts that isn't really needed as long as you change nuke not to check for it.

Usage: run daemon.script [target]

Purpose: Watches a server, gets some preliminary math out of the way and uses that to optimize itself. I've experimented with a number of things and came up with what I felt was a good strategy, perhaps not the best, but definitely functional.

I'll explain the phases of the daemon in its updated form:

weaken

Weakens the server to its minimum security level using a formula extrapolated from game code by another user.
Uses the right number of threads to do so.
Reduces thread counts when run fails due to memory constraints.
Idles until the security has reached its target.
grow

Once weakened to optimal (minSecurity) begins the grow routine.
Runs a single grow thread to approximate the server growth rate. Keeps it for as long as the script stays running, so it never has to do this again.
Uses that grow value to determine a close-to-exact number of threads needed to max out a server, based on its current money.
Has a hard cap to prevent this threading from being excessive.
Grow scripts can require hundreds and thousands of threads of grow to take a server from 50% to 100%.
Larger growth threading becomes more necessary if you adjust the percentageToSteal rate.
Prints some growth information between runs.
Shrinks the thread count until it CAN run a script, if max threading is excessive, resulting in some log spam.
hack

Once cash reaches its maximum, its time to weaken a bit, back to minimum, and then hack. This happens automatically.
Runs a single hack thread to approximate the server hack returns. Keeps it for as long as the script stays running, so it never has to do this again.
Obtains the value by observing the server at max cash, and then how much cash remains (percentage-wise) after a single hack. hackCoefficient is this difference, as a percentage.
percentageToSteal / hackCoefficient is how many threads are required to hack a server all the way to that percentage, approximately. This internal value can be changed for experimentation purposes. This presents 50% (0.5) as a starting point but experimenting with higher precentageToSteal yields much larger growth requirements, which in turn requires weakening.
Rinse repeat basically."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6mf6zy/v0241_progression_scripts_update/
*/



thisHost = getHostname();
thisTarget = args[0];
serverMaxMoney = getServerMaxMoney(thisTarget);
maxGrowThreads = 32000;
maxHackThreads = 32000;
percentageToSteal = 0.9;
baseSecurity = getServerBaseSecurityLevel(thisTarget);
minSecurity = baseSecurity / 3;
rem = minSecurity % 1;
if (rem >= 0.5) {
    minSecurity = minSecurity + 1 - rem;
} else {
    minSecurity = minSecurity - rem;
}
if (minSecurity < 1) {
    minSecurity = 1;
}
print('minSecurity of ' + minSecurity);
growCoefficient = 1;
hackCoefficient = 1;
offsetGrowCoefficient = 1;
canHack = false;
serverLevel = getServerRequiredHackingLevel(thisTarget);
while (canHack == false) {
    canHack = getHackingLevel() >= serverLevel;
    print ('idling until hack level ' + serverLevel);
}
while(canHack) {
    if (isRunning('weaken.script', thisHost, thisTarget) == false) {
        securityNow = getServerSecurityLevel(thisTarget);
        threadsNeeded = (securityNow - minSecurity) * 10;
        if ((threadsNeeded % 1) > 0) {
            threadsNeeded = threadsNeeded + 1 - (threadsNeeded % 1);
        }
        while (threadsNeeded > 0 && isRunning('weaken.script', thisHost, thisTarget) == false) {
            run('weaken.script', threadsNeeded, thisTarget);
            if (isRunning('weaken.script', thisHost, thisTarget) == true) {
                threadsNeeded = 0;
            }
            if (threadsNeeded > 2001) {
                threadsNeeded = threadsNeeded - 1000;                
            } else if (threadsNeeded > 201) {
                threadsNeeded = threadsNeeded - 100;                
            } else if (threadsNeeded > 21) {
                threadsNeeded = threadsNeeded - 10;
            } else if (threadsNeeded > 1) {
                threadsNeeded = threadsNeeded - 1;
            }
        }
    }
    if (isRunning('weaken.script', thisHost, thisTarget) == false) {
        serverMoney = getServerMoneyAvailable(thisTarget);
        while (growCoefficient == 1) {
            growCoefficient = grow(thisTarget);
            if (growCoefficient == 1) {
                print ('erroneous grow rate results in divide by zero. hacking to allow growth simulation.');
                hack(thisTarget);
            } else {
                print ('approximating grow coefficient as ' + growCoefficient);
            }
        }
        scriptToRun = '';
        if (serverMaxMoney > serverMoney) {
            scriptToRun = 'grow.script';
        } else {
            if (hackCoefficient == 1) {
                hasHacked = false;
                while (hasHacked == false) {
                    print('attempting preliminary hack to gain hack coefficient.');                    
                    hasHacked = hack(thisTarget);                    
                }
                hackCoefficient = hackCoefficient - (getServerMoneyAvailable(thisTarget) / serverMaxMoney);
                print ('approximating hack coefficient as ' + hackCoefficient);
            }
            scriptToRun = 'hack.script';
        }
        threadsNeeded = 0;
        if (scriptToRun == 'grow.script') {
            if (serverMoney == 0) {
                print('maxing grow threads instead of dividing by zero...');
                threadsNeeded = maxGrowThreads
            } else {                
                growCoefficientNeeded = (serverMaxMoney / serverMoney);
                threadsNeeded = growCoefficientNeeded / (growCoefficient - 1);
                print ('approaching ' + growCoefficientNeeded + ' coEff requiring ' + threadsNeeded + ' threads at a growCoeff ' + growCoefficient);
            }
            if (threadsNeeded > maxGrowThreads) {
                print('true thread count needed for growth is ' + threadsNeeded);
                threadsNeeded = maxGrowThreads;
            }
        } else {                
            threadsNeeded = percentageToSteal / hackCoefficient;
            totalRequired = (hackCoefficient * threadsNeeded);
            print('approaching removal of ' + percentageToSteal + ' requires a ' + threadsNeeded + ' thread hack by coEff ' + hackCoefficient);
            if (threadsNeeded > maxHackThreads) {        
                threadsNeeded = maxHackThreads;
            }
        }
        if (threadsNeeded % 1 > 0) {
            threadsNeeded = threadsNeeded + 1 - (threadsNeeded % 1);
        }
        isGrowing = false;
        isHacking = false;
        while (threadsNeeded > 0) {
            run(scriptToRun, threadsNeeded, thisTarget);
            if (isRunning(scriptToRun, thisHost, thisTarget) == true) {
                if (scriptToRun == 'grow.script') {
                    isGrowing = true;
                } else {
                    isHacking = true;
                }
                threadsNeeded = 0;
            }
            if (threadsNeeded > 2001) {
                threadsNeeded = threadsNeeded - 1000;                
            } else if (threadsNeeded > 201) {
                threadsNeeded = threadsNeeded - 100;                
            } else if (threadsNeeded > 21) {
                threadsNeeded = threadsNeeded - 10;
            } else if (threadsNeeded > 1) {
                threadsNeeded = threadsNeeded - 1;
            }
        }
        while (isGrowing == true || isHacking == true) {
            if (isGrowing == true && isRunning('grow.script', thisHost, thisTarget) == false) {
                isGrowing = false;
            } else if (isHacking == true && isRunning('hack.script', thisHost, thisTarget) == false) {
                isHacking = false;
            }
        }
    }
}