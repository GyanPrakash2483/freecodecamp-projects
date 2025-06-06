require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('node:dns')
const bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({extended: false}))

const urlList = []

app.post('/api/shorturl', (req, res) => {
  const url = new URL(req.body.url)

  dns.lookup(url.hostname, (err, address, family) => {
    if(err) {
      return res.json({
        error: 'invalid url'
      })
    }
    const urlEntry = {
      original_url: url.href,
      short_url: urlList.length
    }
    urlList.push(urlEntry)
    console.log(urlList)
    return res.json(urlEntry)
  })
})

app.get('/api/shorturl/:urlid', (req, res) => {
  
  const urlId = Number(req.params.urlid)
  const url = urlList.find((urlEntry) => {
    return urlEntry.short_url === urlId
  }).original_url

  res.redirect(url)

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
