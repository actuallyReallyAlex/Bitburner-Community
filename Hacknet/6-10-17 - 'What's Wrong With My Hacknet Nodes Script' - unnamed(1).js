/*
POSTED BY:
u/Omelet (https://www.reddit.com/user/Omelet)

POSTED ON:
June 10th, 2017

COMMENT CONTEXT:
"You don't need curly braces if the if/while/for is only executing a single command.
...
The above code functions identically to what you posted."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6g8haa/whats_wrong_with_my_hacknet_nodes_script/
*/



for (i = 0; i <= hacknetnodes.length; i = i+1) {
   if (hacknetnodes[i].level < 100) hacknetnodes[i].upgradeLevel(100-hacknetnodes[i].level);
    while (hacknetnodes[i].ram < 16) hacknetnodes[i].upgradeRam();
    while (hacknetnodes[i].cores < 4) hacknetnodes[i].upgradeCore();
};