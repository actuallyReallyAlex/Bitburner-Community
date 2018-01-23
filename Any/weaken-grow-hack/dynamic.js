/*
POSTED BY:
u/MercuriusXeno (https://www.reddit.com/user/MercuriusXeno)

POSTED ON:
June 20th, 2017

COMMENT CONTEXT:
"Since it's based off so many user suggestions, it appears functionally similar, if not identical to the one above."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6i0ytr/weaken_grow_hack_script_all_in_one/
*/



i = getServerMoneyAvailable(args[0]);
i = i * 45;
while(true) {
    if (getServerSecurityLevel(args[0]) > 2) {
        weaken(args[0]);
    } else {
        if (getServerMoneyAvailable(args[0]) >= i) {
            hack(args[0]);
        } else {
            grown = grow(args[0]);
            print('grown x ' + grown);
            if(grown == 1)
                i = i * 0.99;
        };
    }
}