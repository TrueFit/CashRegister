const bodyParser = require('body-parser'),
			express    = require('express'),
			path       = require('path'),
			fs         = require('fs'),
			app        = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(3000, () => console.log('Cash register running on 3000'));