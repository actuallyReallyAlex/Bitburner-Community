/*
POSTED BY:
u/MercuriusXeno (https://www.reddit.com/user/MercuriusXeno)

POSTED ON:
June 30th, 2017

COMMENT CONTEXT:
"Usage: run cull.script [hackLevelThreshold] (kills scripts running on servers BELOW this level [strictly less than])"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6kirxi/v023_progression_scripts/
*/



hackLimit = args[0];
thisHost = getHostname();
while (isRunning('return.script', thisHost, thisHost, '', hackLimit) == false) {
    run('return.script', 1, thisHost, '', hackLimit);
};