/*
POSTED BY:
u/MercuriusXeno (https://www.reddit.com/user/MercuriusXeno)

POSTED ON:
June 30th, 2017

COMMENT CONTEXT:
"Usage: run return.script [target] [previousHost] [hackLevelThreshold] (cascades kill/return)"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6kirxi/v023_progression_scripts/
*/



scanHost = args[0];
previousHost = args[1];
hackLimit = args[2];
hosts = scan(scanHost);
if (hosts.length > 0) {    
    for (j = 0; j < hosts.length; j = j + 1) {           
        nextHost = hosts[j];    
        if (nextHost != previousHost) {
            while (isRunning('kill.script', getHostname(), nextHost, scanHost) == false) {
                run('kill.script', 1, nextHost, scanHost);
            };         
        };
    };
};