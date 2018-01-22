/*
POSTED BY:
u/Zinabas (https://www.reddit.com/user/Zinabas)

POSTED ON:
June 6th, 2017

COMMENT CONTEXT:
"you can be alittle more efficient actually, you can simulate a case switch code with 0 consequences at the moment.

I have 1 file that auto hacks 11 servers from 1 loop. (I would add more but I stop after servers that only need 1 port open.)"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6fmyzo/questionssuggestions/
*/



target = 'N/A';
for (i = 0; i < 11; i = i+1) {
    if (i == 0) {
        target = 'foodnstuff';
    } elif (i == 1) {
        target = 'sigma-cosmetics';
    } elif (i == 2) {
        target = 'joesguns';
    } elif (i == 3) {
        target = 'nectar-net';
    } elif (i == 4) {
        target = 'hong-fang-tea';
    } elif (i == 5) {
        target = 'harakiri-sushi';
    } elif (i == 6) {
        target = 'neo-net';
    } elif (i == 7) {
        target = 'CSEC';
    } elif (i == 8) {
        target = 'zer0';
    } elif (i == 9) {
        target = 'max-hardware';
    } elif (i == 10) {
        target = 'iron-gym';
    };

    while (hasRootAccess(target) == false) {
        if (i >= 6) {
            brutessh(target);
        };
        nuke(target);
        sleep(5000);
    };
    if (target == 'CSEC') {
        hack(target);
    } else {
        scp('autoHack.script', target);
        exec('autoHack.script', target);
    };
};