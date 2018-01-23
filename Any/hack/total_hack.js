/*
POSTED BY:
u/minno (https://www.reddit.com/user/minno)

POSTED ON:
July 4th, 2017

COMMENT CONTEXT:
"Designed to have a complicated script running single-threaded to control things, and simple scripts spawned off from it to run multithreaded, to efficiently use RAM."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6gzpxg/any_useful_scripts_to_share/
*/



print("Set up constants.");
target = args[0];
hack_weaken_thread_ratio = 50 / 3.3;
initial_weaken_threads = 1200;
focus_money_threads = 1200;
focus_weaken_threads = 200;

print("Gain full access, if we don't already have it.");
run("pwn_server.script", 1, target);
while(isRunning("pwn_server.script", "home", target)) {
    sleep(10000);
};

print("Bring server to minimum security.");
run("initial_weaken.script", initial_weaken_threads, target);
while(isRunning("initial_weaken.script", "home", target)) {
    sleep(10000);
};

print("Start background process to keep it there.");
run("focus_weaken.script", focus_weaken_threads, target);

print("Grow its money to max.");
run("initial_grow.script", focus_money_threads, target);
while(isRunning("initial_grow.script", "home", target)) {
    sleep(10000);
};

max_money = getServerMoneyAvailable(target);

print("Hack it a few times and grow it once to measure growth rate.");
run("single_hack.script", 10, target);
while(isRunning("single_hack.script", "home", target)) {
    sleep(10000);
};

growth_rate = (grow(target) - 1) * focus_money_threads;

money_threshold = max_money / (1 + growth_rate);

run("focus_money.script", focus_money_threads, target, money_threshold);