/*
POSTED BY:
u/MercuriusXeno (https://www.reddit.com/user/MercuriusXeno)

POSTED ON:
June 13th, 2017

COMMENT CONTEXT:
"I'm personally very fond of:
...
which attempts to level all hacknet nodes up to whatever node 0 is. I use node 0 as a baseline and upgrade it manually and let the script try to do whatever it can to maintain the rest. After I make a bit of money I add
...
to the loop. I haven't gotten super far, so this has been touch-and-go. I turn it off when the costs become prohibitive, but it does well for its intended purpose, which is primarily just to save me clicking...."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6gx6hk/help_with_a_hacknet_script_please/
*/



while (true) {
    hl = hacknetnodes[0].level;
    for (i = 1; i < hacknetnodes.length; i = i + 1) {
        while (hacknetnodes[i].level < hl) 
            hacknetnodes[i].upgradeLevel(1);
    };
}

------------------
hacknetnodes[i].upgradeRam();
hacknetnodes[i].upgradeCore();