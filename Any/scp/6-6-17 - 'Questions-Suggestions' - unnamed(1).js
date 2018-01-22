/* 
POSTED BY:
u/LittleMissTimeLord (https://www.reddit.com/user/LittleMissTimeLord)

POSTED ON:
June 6th, 2017

COMMENT CONTEXT:
"I just handle it like so.
Copy and paste for every node you need to target. Naturally this requires buying RAM upgrades for the home computer, but they aren't that expensive. And I haven't had any issue targeting deep servers with it."

REDDIT POST: 
https://www.reddit.com/r/Bitburner/comments/6fmyzo/questionssuggestions/
*/



while(hasRootAccess('harakiri-sushi') == false){
    if(getHackingLevel() >= 40){
        nuke('harakiri-sushi');
        scp('GenericHack.script','harakiri-sushi');
        scp('GenericGrow.script', 'harakiri-sushi');
        exec('GenericHack.script', 'harakiri-sushi');
        exec('GenericGrow.script', 'harakiri-sushi');
    } else {
        sleep(10000);
    };
};