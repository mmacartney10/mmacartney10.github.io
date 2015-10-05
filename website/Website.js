var express = require('express');
var website = express();
var http = require('http').Server(website);
var path = require('path');
var favicon = require('serve-favicon');
var exphbs  = require('express3-handlebars');

website.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'index.hbs',
    partialsDir: ['_src/views']
}));

website.set('port', process.env.PORT || 4000);
website.use(favicon(__dirname + '/favicon.ico'));
website.use(express.static(path.join(__dirname, '_build')));

require('./routes')(website);

http.listen(website.get('port'), function(){
    console.log('website is listening on port: ' + website.get('port'));
});

module.exports = website;