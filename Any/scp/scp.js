/*
POSTED BY:
u/XxZombGuyxX (https://www.reddit.com/user/XxZombGuyxX)

POSTED ON:
September 26th, 2017

COMMENT CONTEXT:
"i just want to be able to copy more then one thing at a time D:

EDIT: Figured out a script if ya guys want it, here it is

This script is 2.10 GB and can copy a number of programs to another server in quick succession feel free to use it!"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/72l0ip/scpfile1file2file3etc/
*/



toServer = args[0]; //put server to send files to
 x = (toServer + 'has recieved all the 
 y = (ls(toServer) + 'double check they were added');
 files = ['daemon.script','start.script','grow-scheduler.script','grow-target.script','hack-scheduler.script','hack-
 target.script','weakentarget.script'];
 //remember to add or remove files as needed from the files array
 i = 0;
 //change the variable i<file.length where file.length is the number of files in the array above
 while(i < file.length) {
 scp(files[i], toServer);
 i = i + 1;
 }
 tprint(x);
 tprint(y);