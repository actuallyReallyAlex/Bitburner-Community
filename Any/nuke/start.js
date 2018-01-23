/*
POSTED BY:
u/MercuriusXeno (https://www.reddit.com/user/MercuriusXeno)

POSTED ON:
July 10th, 2017

COMMENT CONTEXT:
"Purpose: A fire and forget way to start a nuke-and-run-daemon cascade. Read through it to understand the optional params. You will only run daemons on servers above minimum and below limit. If you want to change your conditions, you have to run the cascade all over again. By default it has no real limits.

Usage: run start.script"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6mf6zy/v0241_progression_scripts_update/
*/



minimumHackLevel = 0;
if (args.length > 0) {
    minimumHackLevel = args[0];
} else {
    minimumHackLevel = 1;
}

if (args.length > 1) {
    hackLimit = args[1];
} else {
    hackLimit = 2147483647;
}

run('break.script', 1, getHostname(), '', minimumHackLevel, hackLimit);