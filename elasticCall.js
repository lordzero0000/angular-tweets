const
  // imports
  elasticSearch = require('elasticsearch'),
  Twitter = require('twitter'),
  // auth
  esclient = new elasticSearch.Client({
    host: process.env.ELASTIC_SEARCH_API,
    httpAuth: process.env.ELASTIC_SEARCH_AUTH
  }),
  twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_COSTUMER_KEY,
    consumer_secret: process.env.TWITTER_COSTUMER_SECRET,
    access_token_key: process.env.TWITTER_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_TOKEN_SECRET
  }),
  // utils
  newTweetObj = (tweet, id) => {
    return {
      index: 'timeline',
      type: 'tweet',
      id: id,
      body: tweet
    }
  }

exports.Save = id => {
  return new Promise((resolve, reject) => {
    twitterClient.get(`statuses/show/${id}`, (error, tweet, response) => {
      if(error) return reject(error)
      let tweetObj = newTweetObj(tweet, id)
      esclient.create(tweetObj, (error, response) =>{
        if (error) return reject(error)
        resolve(response)
      })
    })
  })
}

exports.Search = q => {
  return esclient.search({
    index: 'timeline',
    body: {
      query: {
        match: q
      }
    }
  })
}