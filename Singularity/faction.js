/*
POSTED BY:
u/Ninichat1 (https://www.reddit.com/user/Ninichat1)

POSTED ON:
January 1st, 2017

COMMENT CONTEXT:
"Here's what I got so far:
...
faction is the faction you wanna give reputation to.
target is the company you wish to infiltrate.
Example: keep_infiltrating_faction("BitRunners", "sector12-joesguns");

When you want to stop the code from running, enter:
keep_going = false;
in the console.

Caution: this is a bit too strong imo, but it makes grinding reputation less grindy."

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7n8ezq/help_with_automating_infiltrations/
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