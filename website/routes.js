module.exports = function(app) {

	var fs = require('fs');
	var loacation = '/_build/';
	var fileName;

	function init(){
		readViews();
	}

	function readViews(){
		fs.readdirSync(__dirname + loacation).forEach(function(file){
			fileName = file.replace('.html', '');
			getViews(file, fileName);
		});
	}

	function getViews (file, fileName) {
		var urlName = fileName === 'index' ? '' : fileName;

		app.get('/' + urlName, function(req, res){
			res.sendFile(__dirname + loacation + file);
		});
	}

	init();
};