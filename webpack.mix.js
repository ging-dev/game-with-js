let mix = require('laravel-mix');

mix.setPublicPath('dist').js('src/app.js', 'dist/js').js('src/demo.js', 'dist/js');
