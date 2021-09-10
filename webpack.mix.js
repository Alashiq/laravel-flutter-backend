const mix = require("laravel-mix");

mix.js("resources/js/home/home.js", "public/js")
    .vue()
    .js("resources/js/admin/main.js", "public/js")
    .vue()
    .postCss("resources/css/app.css", "public/css", [require("tailwindcss")])
    .postCss("resources/css/dash.css", "public/css")
    .postCss("resources/css/home.css", "public/css");
