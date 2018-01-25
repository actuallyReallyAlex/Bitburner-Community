/*
POSTED BY:
u/i3aizey (https://www.reddit.com/user/i3aizey)

POSTED ON:
November 10th, 2017

COMMENT CONTEXT:
"you can fill out these 4 scripts, that the 2 above uses, yourself, since they are pretty straight forward:

hack.script -> hack(args[0]); RAM per thread: 1.6

grow.script -> grow(args[0]); RAM per thread: 1.6

weaken.script -> weaken(args[0]); RAM per thread: 1.6

crack.script -> try to get root access to args[0] (RAM per thread: 3.0)"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/79vncv/script_sharing_request/
*/



self = getHostname();
target = args[0];
hackThreads = args[1] - 0;
growThreads = args[2] - 0;
weakThreads = args[3] - 0;
level = args[4] - 0;

/**
 * starts a given script with a given thread-count
 * ALWAYS gives the target as first and only argument
 */
function execute(script, threads) { while(!run(script + ".script", threads, target)){} }

/**
 * Waits until a given script with target as only argument has ended
 */
function wait(script) { while(isRunning(script + ".script", self, target)){} }

/* Clean-up since scripts restart from the top on reloading page */

wait("grow");
wait("weaken");


/* Actual hacking procedure */

while(true) {

    // Recalculate every 10 level-ups
    if(level + 10 < getHackingLevel())
        break;

    // Start cycle
    execute("grow", growThreads);
    execute("weaken", weakThreads);
    hack(target);

    // Wait for cycle to end
    wait("grow");
    wait("weaken");

}

// Start re-calculation
execute("calculator", 1);