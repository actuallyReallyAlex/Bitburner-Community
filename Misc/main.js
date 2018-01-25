/*
POSTED BY:
u/GwenPlaysGwent (https://www.reddit.com/user/GwenPlaysGwent)

POSTED ON:
December 12th, 2017

COMMENT CONTEXT:
"Considerations
One process. If I ran main.script, it'd only spawn one process for main.script. Helpers.script would never show up in top.

RAM Usage. I suggest the ram usage should be "RAM of imports + import penalty". So, importing a function would always lead to slightly more RAM usage than simply inlining it (it's a luxury, after all). If it's too difficult to calculate the RAM of an imported function, I suggest just using the RAM of the entire file and not penalizing people for doing multiple imports from a single file. But ideally it should be per-function.

Stateless functions. By only allowing stateless functions, we ensure that scripts only communicate at run-time via ports. If users are allowed to import stateful objects, they can communicate just by passing around singletons, which is kinda cheating (and maybe it's opening up a can of worms on the Netscript interpreter side?) I did a quick Google, and found "purecheck" on npm, which looks promising. Might be exactly what you want for this step. Also because they're stateless functions, it means that, if you need to, you can really bypass a lot of the importing code. You could literally copy and paste the function into the file before the interpreter executes it."

Example
helpers.script"

REDDIT POST:
https://www.reddit.com/r/Bitburner/comments/7jdi39/request_imports_and_exports_modules_for_scripts/
*/



//main.script
import { unlock } from helpers.script
unlock(args[0);
Considerations