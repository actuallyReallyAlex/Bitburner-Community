/*
POSTED BY:
u/MercuriusXeno (https://www.reddit.com/user/MercuriusXeno)

POSTED ON:
July 10th, 2017

COMMENT CONTEXT:
"Purpose: Runs nuke on all servers connected to the initial target. Nuke subsequently runs break on those targets. This is how the nuke-daemon-cascade works.

Usage: You don't. Just use start. It does all this automatically, and trying to run it manually is a waste of your time."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6mf6zy/v0241_progression_scripts_update/
*/



scanHost = args[0];
previousHost = args[1];
minimumHackLevel = args[2];
hackLimit = args[3];
hosts = scan(scanHost);
if (hosts.length > 0) {    
    for (j = 0; j < hosts.length; j = j + 1) {           
        nextHost = hosts[j];    
        if (nextHost != previousHost) {
            while (isRunning('nuke.script', getHostname(), nextHost, scanHost, minimumHackLevel, hackLimit) == false) {
                run('nuke.script', 1, nextHost, scanHost, minimumHackLevel, hackLimit);
            }     
        }
    }
}