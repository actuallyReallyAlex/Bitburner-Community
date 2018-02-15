/*
POSTED BY:
u/heyitsmikeyv (https://www.reddit.com/user/heyitsmikeyv)

POSTED ON:
December 19th, 2017

COMMENT CONTEXT:
"I'm pretty new to bitburner, just started yesterday. But web dev is a big part of what I do for a living and I love being able to write code as a gameplay mechanic. Seriously the coolest thing ever.

Anyway, I did some looking around on the wiki and this subreddit and haven't been able to find a reliable prebuilt method to recursively scan machines until I've found everything. I needed to build a spidering utility.

This is a standalone function you can include in any of your scripts to reliably generate an array of networked servers, useful for automating script deployments and mass-rooting of systems.

Total overhead to include the function clocks in at 0.7GB.

Hope this helps!

EDIT: In case this needs an example for a use-case. Here's an example of a script that will upload a file to every possible server:

allServers = spider();

for (i = 0; i < allServers.length; i++) {
    scp('botnet.script', allServers[i]);
}"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7jgxpv/tip_work_while_monitoring_a_script/https://www.reddit.com/r/Bitburner/comments/7kqy07/useful_netscript_function_spider_returns_an_array/
*/


function spider() {
    // Return an array of all identifiable servers

    // Create a serversSeen array, containing only 'home' for now
    serversSeen = ['home'];

    // For every server we've seen so far, do a scan
    for (i = 0; i < serversSeen.length; i++) {
        thisScan = scan(serversSeen[i]);
        // Loop through results of the scan, and add any new servers
        for (j = 0; j < thisScan.length; j++) {
            // If this server isn't in serversSeen, add it
            if (serversSeen.indexOf(thisScan[j]) === -1) {
                serversSeen.push(thisScan[j]);
            }
        }
    }
    return serversSeen;
}