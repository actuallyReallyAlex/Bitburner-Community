/*
POSTED BY:
u/minno (https://www.reddit.com/user/minno)

POSTED ON:
July 4th, 2017

COMMENT CONTEXT:
"Designed to have a complicated script running single-threaded to control things, and simple scripts spawned off from it to run multithreaded, to efficiently use RAM."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6gzpxg/any_useful_scripts_to_share/
*/



name = args[0];
if fileExists("BruteSSH.exe") {
    brutessh(name);
};
if fileExists("FTPCrack.exe") {
    ftpcrack(name);
};
if fileExists("relaySMTP.exe") {
    relaysmtp(name);
};
if fileExists("HTTPWorm.exe") {
    httpworm(name);
};
if fileExists("SQLInject.exe") {
    sqlinject(name);
};
nuke(name);