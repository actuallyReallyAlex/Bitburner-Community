/*
POSTED BY:
u/boz987 (https://www.reddit.com/user/boz987)

POSTED ON:
September 16th, 2017

COMMENT CONTEXT:
"Working on designing a script to optimally hack servers, from early to late game. Still some more I want to do to it, but for now, heres how it works:

15.15GB Ram, + 1.55 , so 32GB should run this.

Scans all servers recursively

If they are a hacking target (money > 0), gathers more info on them. And determines their profit / sec.

Checks number of port busters you have, gets current hacking level. Using these, if your hacking level has increased by 100 (saves rerunning calcs each time), it recaclulates the optimal profits for a list of servers you can currently hack

Finds the optimal profit targets, and nukes it if needed. In order of optimal, calcs as many threads as needed, and runs weaken/grow/hack as needed

Runs Weaken (if more than + 6 of min) Run Grow if not 75% of max. Hacks if above 75% of max.

Big Thanks to:

/user/MercuriusXeno

/user/Reydien

For large parts of the logic.

The Script:"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/70enbq/main_server_script/
*/



weaken(args[0]);