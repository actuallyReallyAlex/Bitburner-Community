/*
POSTED BY:
u/lephosto (https://www.reddit.com/user/lephosto)

POSTED ON:
June 14th, 2017

COMMENT CONTEXT:
"I made this one for my nodes. Allows some customization and levels things equally. My first time ever trying to "code" anything so I assume it could be written a -bit- better/efficient."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6gzpxg/any_useful_scripts_to_share/
*/



ram_upgrade = 31; ram_interval = 30; cpu_core = 61; cpu_interval = 40; level_increment = 5;

node_total = 0; max_level = 0;

while(true) {

node_total = node_total+4;
max_level = max_level+20;

if (node_total = 40) {
    kill(testnode.script);
};

while(hacknetnodes.length < node_total) {
    purchaseHacknetNode();
};


for (node_level = 1; node_level < max_level; node_level = node_level+1) {


    for (node_number = 0; node_number < node_total; node_number = node_number+1) {


        if (hacknetnodes[node_number].level <= max_level) {

            if (hacknetnodes[node_number].level = ram_upgrade) {
                hacknetnodes[node_number].upgradeRam();
                ram_upgrade = ram_upgrade+ram_interval;
            };

            if (hacknetnodes[node_number].level = cpu_core) {
                hacknetnodes[node_number].upgradeCore();
                cpu_core = cpu_core+cpu_interval;
            };

            hacknetnodes[node_number].upgradeLevel(level_increment)
        }
    };

};

print(node_total);