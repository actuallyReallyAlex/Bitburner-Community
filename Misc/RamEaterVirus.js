/*
POSTED BY:
u/nanodemerzel (https://www.reddit.com/user/nanodemerzel)

POSTED ON:
June 18th, 2017

COMMENT CONTEXT:
"I have a script that can fix that: the RAMEaterVirus.

Simply save as "RamEaterVirus.script" and run it on any computer with...
run RamEaterVirus.script

Then watch as your available RAM disappears (takes some time to fully vanish). Did a great job with my 16PB. Here is the script. You might need to adjust the sleep time if the next script starts too slowly.
...

Edit: Just realized this could be adapted to setup a script that uses roughly half ( or 1/4, 3/4, 1/128) of your RAM. Not as good as having getServerRam() and getScriptRam(script, threads), but maybe useful."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6hyeyp/in_case_you_have_too_much_ram/
*/



print("Started");
this = "RamEaterVirus.script";
if(args.length != 3){
    host = getHostname();
    threads = 1;
    layer = 1;
} else {
    host = args[0];
    threads = args[1];
    layer = args[2];
};

if(host != getHostname() ) scp(this, host);

steps = Array[100, 10, 1, 0];
for(i = 0; i < steps.length; i = i + 1){
    t = threads + steps[i];

    if( i > 0 ){
        j = i - 1;
    } else {
        j = 1;
    };

    stasis = false;
    if(isRunning(this, host, host, threads + steps[j], layer) ){
        print("Successfully ate more RAM.");
        steps.clear();
    } else {
        if ( t == threads ){
            stasis = true;
            amt = "";
            denom = 1;
            for(l = 0; l < layer; l = l + 1) {
                amt = amt + "half of ";
                denom = denom * 2;
            };
            print("I'm eating about " + amt + "your available RAM (1/2^" + layer + " or 1 part in " + denom + ").");
            t = 1;
            layer = layer + 1;
        };

        exec(this, host, t, host, t, layer);
        while(stasis) "whir";
        sleep(1000);
    };
};