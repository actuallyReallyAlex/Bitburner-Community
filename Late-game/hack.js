/*
POSTED BY:
u/Reydien (https://www.reddit.com/user/Reydien)

POSTED ON:
September 15th, 2017

COMMENT CONTEXT:
"FOREWARNING: This script is designed to be run on a server with tens of thousands of GB of free RAM. This script also does not always keep the full amount of necessary RAM occupied, so if you are checking server ram in other scripts it may not be accurate.

This script will automatically determine how many thread of hack is needed to take a given server (at minimum security) from 100% money to 0% money, how many threads of grow is then needed to take the server back to 100% money, and finally how many threads of weaken is needed to bring the server back down to minimum security to repeat the process. It then uses those numbers and runs a set of ultra-light scripts to run each function in turn. The end result is that you receive MAX_MONEY from the server for every cycle of weaken you run.

This script DOES NOT:

Nuke the server. You must hack it manually or with another script first.

Adjust its values as your hacking skill increases. At higher levels the hack script be overshooting the 100%, but that has no adverse effect.

Check to see if the server has enough RAM for the process. Because the sub-scripts are not always running, simply checking free RAM can be deceiving.

BE WARNED: If you run this when your hacking skill is exactly equal to the server's required skill, it will use A LOT of ram, like 300,000GB or more. I would recommend at least +10 skill, which would put the ram usage at about double the eventual lower limit.

Scripts

There are 4 scripts, Autohack.script, hack.script, grow.script, weaken.script. After saving all four, the syntax is simply "run Autohack.script target" Autohack.script"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/70dj0q/autohack_script_set_for_midtolate_game/
*/



while (true)
{
    if (hack(args[0])) {break;}
}