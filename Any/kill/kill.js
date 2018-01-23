/*
POSTED BY:
u/MercuriusXeno (https://www.reddit.com/user/MercuriusXeno)

POSTED ON:
June 30th, 2017

COMMENT CONTEXT:
"Usage run kill.script [target] [previousHost] [hackLevelThreshold]"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6kirxi/v023_progression_scripts/
*/



thisTarget = args[0];
previousHost = args[1];
hackLimit = args[2];
thisHost = getHostname();
allKilled = false;
scriptsToKill = Array['nuke.script', 'break.script', 'daemon.script'];
hackLevel = getServerRequiredHackingLevel(thisTarget);
if (hackLevel < hackLimit) {
    for (i = 0; i < scriptsToKill.length; i = i + 1) {
        scriptToKill = scriptsToKill[i];
        if (isRunning(scriptToKill, thisHost, thisTarget, previousHost) == true) {
            kill(scriptToKill, thisHost, thisTarget, previousHost);
        };
    };
};
while (isRunning('return.script', thisHost, thisTarget, previousHost, hackLimit) == false) {
    run('return.script', 1, thisTarget, previousHost, hackLimit);
};