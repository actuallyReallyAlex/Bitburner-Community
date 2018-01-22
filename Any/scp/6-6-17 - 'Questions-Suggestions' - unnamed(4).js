/*
POSTED BY:
u/Zinabas (https://www.reddit.com/user/Zinabas)

POSTED ON:
June 6th, 2017

COMMENT CONTEXT:
"its mostly useless right now, but once hacking hits 100 or so it becomes pretty efficient and self maintaining."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6fmyzo/questionssuggestions/
*/



home = getHostname();
mneLevel = 10000000;
secLevel = 2;

while(true) {
    if(getServerSecurityLevel(home) > secLevel) {
        weaken(home);
    } elif(getServerMoneyAvailable(home) < mneLevel) {
        grow(home);
    } else {
        hack(home);
    }
}