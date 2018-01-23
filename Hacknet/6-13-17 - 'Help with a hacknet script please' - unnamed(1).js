/*
POSTED BY:
u/Mordredxxx (https://www.reddit.com/user/Mordredxxx)

POSTED ON:
June 13th, 2017

COMMENT CONTEXT:
"Oh i did that script here it is :
...
lvl up one by one all nodes by 5 lvls at first you have vars that you can edit to get it work more efficent :) i think my code is fine :3 it is buying nodes (because it is effecient this way trust me :)) Good game."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6gx6hk/help_with_a_hacknet_script_please/
*/



 // variables that you can change
    max_level = 150;
    power_upgrade = 5;
    max_node = 6;

while(true){
    //get the nomber of nodes
    nb = hacknetnodes.length;
    //if not max than buy one node
    if( nb < max_node) { 
        purchaseHacknetNode();
    };
//reget the number of node you could have just done it by nb = nb + 1;
 nb = hacknetnodes.length;
//for each node until the last one
 for (i = 0; i < nb; i = i + 1) {
    //if lvl max of this "i" node isn't archeved buy "power_upgrade" node
        if( hacknetnodes[i].level <= max_level ) {
            hacknetnodes[i].upgradeLevel(power_upgrade);
            sleep(100);
        };
    };
  };