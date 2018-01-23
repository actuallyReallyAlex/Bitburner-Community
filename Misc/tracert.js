/*
POSTED BY:
u/Omelet (https://www.reddit.com/user/Omelet)

POSTED ON:
July 2nd, 2017

COMMENT CONTEXT:
"Figured someone might find this script useful - it determines the server chain you need to follow in order to reach the desired server. Mostly useful for servers which need to be manually hacked.
...
It prints out to the script log in the reverse order you need to connect to servers to reach the desired server. You need to use tail to see the output. Example usage: http://imgur.com/a/XgaCe"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/6ktz43/tracertscript_v023/
*/



s = args[0];
a = scan(s);
while(a[a.length - 1] != 'home'){
    s = a[0];
    a = scan(s);
    print(s);
};