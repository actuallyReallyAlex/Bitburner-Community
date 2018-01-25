/*
POSTED BY:
u/GwenPlaysGwent (https://www.reddit.com/user/GwenPlaysGwent)

POSTED ON:
December 12th, 2017

COMMENT CONTEXT:
"I did a quick search and didn't find anything, apologize if this is already on the radar.

The feature I'd like most of all for scripting is imports and exports. I have a ton of little helper functions I've written, and the best way I've found to use them is just copying them to each file, which obviously wastes RAM. I'm aware that theoretically I could setup a service that communicates on ports, but consuming the service would have a ton of boilerplate as I wait for ports to respond, make sure data is there, etc, and to me this boilerplate isn't worth the added RAM.

Ideally, I'd love to have something akin to es6 modules. Example:

Example
helpers.script"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7jdi39/request_imports_and_exports_modules_for_scripts/
*/



export function unlock(hostname){
    if (fileExists("BruteSSH.exe", "home")) {
        brutessh(hostname);
    }
    if (fileExists("FTPCrack.exe", "home")) {
        ftpcrack(hostname);
    }
    if (fileExists("relaySMTP.exe", "home")) {
        relaysmtp(hostname);
    }
    if (fileExists("HTTPWorm.exe", "home")) {
        httpworm(hostname);
    }
    if (fileExists("SQLInject.exe", "home")) {
        sqlinject(hostname);
    }

    nuke(hostname);
    return true;
}