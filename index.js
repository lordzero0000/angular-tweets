const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      call = require('./elasticCall');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/complete', function (req, res) {
  console.log(req.query);
  res.setHeader('Content-Type', 'application/json');
  res.send(200, JSON.stringify({ status: 'get' }));
});

app.post('/complete', function (req, res) {
  console.log(req.body);
  res.setHeader('Content-Type', 'application/json');
  res.send(200, JSON.stringify(req.body));
});

app.post('/tweet', function (req, res) {
  call.Save(req.body.tweet.split('status/')[1])
  .then(complete => {
    console.log(complete)
    res.status(200).send({ status: 'complete' })
  }).catch(err => {
    console.log('ERROR:', err)
    res.status(400).send({ status: 'error', error: err })
  })
})

app.get('/tweet', function (req, res) {
  console.log(req.query.q)
  let query = new Object()
  query[req.query.q] = req.query.v
  call.Search(query)
  .then(response => {
    let hits = response.hits.hits.map(t => `${t._source.user.screen_name} said: ${t._source.text}`)
    console.log(hits.join('\n'))
    res.status(200).send(response)
  }).catch(err => {
    console.error(err)
    res.status(400).send({status: 'error', error: err})
  })
})

app.use(express.static('app'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
