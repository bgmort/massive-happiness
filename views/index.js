(function(){dust.register("views/index.dust",body_0);var blocks={'content':body_1,'footer':body_3};function body_0(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.partial("layout",ctx,null);}function body_1(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("Hi, I'm the home page!<p>here's a list: ").reference(ctx._get(false, ["list"]),ctx,"h").write("</p><p>Ok, how about a list of users::<ul id=\"users\">").section(ctx._get(false, ["users"]),ctx,{"block":body_2},null).write("</ul></p><button id=\"addmore\">Add more?</button><p>Now let's try some stuff:<pre>{>insert partial}</pre>This inserts a partial which has been defined elsewhere.  Similar to both '{extends}' and '{include}' in Smarty.<pre>{+block}</pre>This defines a block which may be overwritten.  Like '{block}' in Smarty in a base template.<pre>{&lt;define partial}</pre>This defines the content for a partial or a block.  Kinda like... '{block}' in Smarty subtemplate.  <em>Or<em>, like giving section of template it's own name, by which it can be included.</p>");}function body_2(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("<li>").reference(ctx._get(false, ["$idx"]),ctx,"h").write(": ").partial("partials/user-badge",ctx,null).write("</li>");}function body_3(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("<script src=\"/js/index.js\" type=\"text/javascript\"></script><script src=\"/templates/index.js\" type=\"text/javascript\"></script>");}return body_0;})();