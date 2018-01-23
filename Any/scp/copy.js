/*
POSTED BY:
u/Omelet (https://www.reddit.com/user/Omelet)

POSTED ON:
June 18th, 2017

COMMENT CONTEXT:
"It's possible if you already know what all your scripts are called / if you use numerical naming conventions.
...
Assuming your server is named GenericServer, and you wanted to copy files called GenericScript0.script through GenericScript99.script to it, you could use the following command.
...
run copy.script GenericScript 100 GenericServer
...
That only copies the scripts and does not run them, but running them would be very similar."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6i0n6m/scpcopy_all_scripts_function/
*/



name = args[0];
n = args[1];
destination = args[2];
for(i = 0; i < n; i = i + 1) scp(name + i + '.script', destination);