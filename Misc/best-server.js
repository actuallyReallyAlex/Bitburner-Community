/*
POSTED BY:
u/icsbariboa (https://www.reddit.com/user/icsbariboa)

POSTED ON:
January 8th, 2017

COMMENT CONTEXT:
"Well it's pretty straight forward. I just run getServerMaxMoney(target), and choose the server with the highest max money. Ideally I would also take into account the minimum security, but I haven't gotten around to including that.

Here's my script. It relies on data from my text file of servers, but you can do this with an included server scan. Or make a script to create a server list. There's another topic on here which goes into pretty good detail about how to use txt files.
...
edit: Found a bug in my conditional code which pretty much kills the functionality. Have to make sure you're comparing numbers not strings."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7oder7/need_some_advice_for_progressing/
*/


var keep_going = false;

function sleep(ms)
{
   return new Promise(resolve => setTimeout(resolve, ms));
}

function isAvailable(option)
{
   return option.style.display === "block";
}

function infiltrate_faction(faction, target, first)
{
    document.getElementById(target).click();
    document.getElementById("location-infiltrate").click();

    var infiltrate_hack = document.getElementById("infiltration-hacksecurity");
    var infiltrate_stealthko = document.getElementById("infiltration-stealthknockout");
    var infiltrate_escape = document.getElementById("infiltration-escape");

    var progress = document.getElementById("infiltration-level-text");
    var infiltration_box = document.getElementById("infiltration-box-container");

    for (i = 0; (first || !isAvailable(infiltration_box)) && i < 100; i++)
    {
        if (i > 50)
            infiltrate_escape.click();
        else if (isAvailable(infiltrate_hack))
            infiltrate_hack.click();
        else if (isAvailable(infiltrate_stealthko))
            infiltrate_stealthko.click();
    }

    document.getElementById("infiltration-faction-select").value = faction;
    document.getElementById("infiltration-box-faction").click();
    document.getElementById("location-hospital-treatment").click();
}

async function keep_infiltrating_faction(faction, target)
{
    keep_going = true;
    //target = "ishima-omegasoftware";
    infiltrate_faction(faction, "sector12-joesguns", true);
    while (keep_going)
    {
        infiltrate_faction(faction, target, false);
        await sleep(500);
    }
}