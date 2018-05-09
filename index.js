const register = require('./src/CashRegister.js');
const program = require('commander');
const fs = require('fs');
const {Transform } = require('stream');
const util = require('util');


program.option('-p, --path <path>', 'Path to Flat File')
.option('-d, --delimiter', 'Input Delimiter - leave blank for comma')
.option('-n, --newline', 'Input New Line Character - leave blank for \\n')
.parse(process.argv);

program.delimiter = program.delimiter || ',';
program.newline = program.newline || '\n';

function cashTransform(options) {
	if (!(this instanceof cashTransform)) 
		return new cashTransform(options);
	Transform.call(this, options);
}

util.inherits(cashTransform, Transform);

cashTransform.prototype._transform = function(chunk, enc, cb){
	var rows = chunk.toString().split(program.newline);
	for(var i=0; i < rows.length; i++){
		if(rows[i] !== ''){
			var input = rows[i].split(program.delimiter);
			register.getChange(input[0], input[1], 'USD', function(d){
				this.push(d);	
			}.bind(this));
		}
	}
	cb();
};

if(program.path === undefined){
	//TODO run in demo mode	
	console.warn("No Input Path Specified: use --help for list of options");

}else{
	var t = (new Date).getTime();
	fs.createReadStream(program.path).pipe(new cashTransform()).pipe(fs.createWriteStream('output/registerOut-'  + t + '.csv'));	
}

