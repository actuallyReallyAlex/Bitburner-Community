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
target = "foodnstuff";
initial_weaken_threads = 1200;
focus_experience_threads = 1200;
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

print("Grind");
run("focus_experience.script", focus_experience_threads, target);