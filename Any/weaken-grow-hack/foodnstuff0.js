/*
POSTED BY:
u/boz987 (https://www.reddit.com/user/boz987)

POSTED ON:
June 13th, 2017

COMMENT CONTEXT:
"Update Version:

I have scripts such as foodnstuff[0-5].scipt for each server on home, where 0 is hack / grow, and 1-4 are weaken / grow.
..."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6gzpxg/any_useful_scripts_to_share/
*/



s = 'foodnstuff';
while(true) {
    if (getServerMoneyAvailable(s) > 49000000) { 
        hack(s);
    } else {
        grow(s);
    }
};