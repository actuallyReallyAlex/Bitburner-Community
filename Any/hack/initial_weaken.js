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



base_security = getServerBaseSecurityLevel(args[0]);
min_security = base_security / 3 + 0.5;
min_security = min_security - (min_security % 1);
while(getServerSecurityLevel(args[0]) > min_security + 1) {
    weaken(args[0]);
};