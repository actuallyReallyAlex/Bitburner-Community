/*
POSTED BY:
u/Me66 (https://www.reddit.com/user/Me66)

POSTED ON:
June 26th, 2017

COMMENT CONTEXT:
"I wrote a script that calculates the max amount of threads a server can run for before running out of RAM.

It's very slow and a job better suited for an excel spreadsheet or a simple equation, but it does the job in-game.

Script: max_threads.script
...
If you don't want it spamming how much each thread will cost simply delete the print line in the while loop.

To use it simply add the base cost of the script as the first argument, and the amount of RAM (in GB) you want to use as the second.

Example: run max_threads.script 2.44 64
Will check how many scripts that cost 2.44GB RAM that can run on a 64GB server.

To see the result you need to view the script log.

I made two aliases:
alias max_threads="run max_threads.script"
alias rmax_threads="tail max_threads.script"

I run the first then Up arrow, home, add the r and view the log with the result."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6jk2sp/max_threads_script/
*/



base_cost = args[0];
ram = args[1];

thread_multiplier = 1.005;

max_threads = 0;
max_ram = 0;
next_cost = base_cost;

print("CALCULATING MAX THREADS");
print("Script RAM Cost: " + base_cost + "GB RAM");
print("Server Free RAM: " + ram + "GB RAM");

while(max_ram <= ram) {
    print(max_threads + " THREAD cost: " + max_ram + "/" + ram + "GB RAM");

    max_ram = max_ram + next_cost;


    next_cost = next_cost * thread_multiplier;

    max_threads = max_threads + 1;

};

print("CALCULATIONS DONE");
print("Max Threads: " + max_threads);