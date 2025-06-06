var express = require('express');
var cors = require('cors');
require('dotenv').config()

const expressFileupload = require('express-fileupload')

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(expressFileupload())

app.post('/api/fileanalyse', (req, res) => {
  const { upfile } = req.files

  return res.json({
    name: upfile.name,
    size: upfile.size,
    type: upfile.mimetype
  })

})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
