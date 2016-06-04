var express = require('express')
var app = express()
var logger = require('morgan');
var twitterInfo = require('./twitterInfo')
var OAuth = require('Oauth');
var router = express.Router()
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var cheerio = require('cheerio')
var request = require('request');

var UserSchema = new mongoose.Schema({
  name: String,
  title: String,
  //link: String,
  //upvotes: {type: Number, default: 0},
  //comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
})
var User = mongoose.model('User', UserSchema)
mongoose.connect('mongodb://52.40.114.1/stock')

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }))
//returns list of movies
var movieList = []

app.post('/api/twitter/stock', function(req, res, next){
  var query = req.body.query

  var oauth = new OAuth.OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        twitterInfo.consumerKey,
        twitterInfo.consumerSecret,
        '1.0A',
        null,
        'HMAC-SHA1'
      );
  oauth.get(
      //'https://api.twitter.com/1.1/trends/place.json?id=23424977',
      'https://api.twitter.com/1.1/search/tweets.json?q=%24' + query,
      twitterInfo.accessToken,
      //you can get it at dev.twitter.com for your own apps
      twitterInfo.accessTokenSecret,
      //you can get it at dev.twitter.com for your own apps
      function (e, data, result){
        if (e) console.error(e);
        console.log(require('util').inspect(data));
        //done();
        res.send(data)
      });
})

app.post('/api/movies', function(req, res, next) {
  console.log(req.body.page)
  var page = req.body.page || 0
  var movieUrl = 'https://thepiratebay.org/browse/201/' + page + '/7/0'

  request(movieUrl, function(err, response, html){
    if(!err){
      //console.log(html)
      var $ = cheerio.load(html)
      var list = $('.detLink')

      movieList = JSON.stringify(list.toArray(), function (k, v) {
        if (k === "prev" || k === "next" || k === "parent") return undefined;
        return v;
      })
      var objResponse = {page: +page + 1, movieList: JSON.parse(movieList)}
      console.log(objResponse)
      res.send(objResponse)
    }
  })


})

app.post('/api/post', function(req, res, next) {
  console.log(req.body)
  var thisPost = new User( req.body)
  thisPost.save( function(err, data){
    if(err) { return next(err); }
    res.json(data);
  });
});

app.post('/api/delete', function(req, res, next) {
  console.log(req.body)
  var thisPost = new User( req.body)
  thisPost.remove( function(err, data){
    if(err) { return next(err); }
    res.json(data);
  });
});

app.use(logger('dev'));
app.use('/', express.static(__dirname))
app.listen(4000, function() { console.log('listening')})
