#Jade + Stylus + Gulp (with a little PostCSS thrown in for good measure)

As a front-end developer who dabbles in Python, I love whitespace-dependent code. So I made a workflow that's reliant on it. 

There's a base layout template that can be further extended to suit your project's usecase. You can further extend the template to create separate section pages and the like.

The index.pug is your base file -- all other views should be contained in the views folder, which will then be converted into separate html files. 

It's not perfect, so if one of you brilliant individuals can make it suck less... Make a pull request! 

0.0.2 update - I've made it a little more flexible (and less screwy with the views/index). Starting to use Jade templating to make it easier to knock out pages. Also, I've added the AWESOME Axis mixin library -- [check it out](http://axis.netlify.com/).