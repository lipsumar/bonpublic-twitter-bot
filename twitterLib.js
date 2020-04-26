const Twitter = require('twitter');
const client = new Twitter(require('./credentials'));

async function getLatestTweets(screenName, max){
  var params = {screen_name: screenName, count:max};
  return new Promise((resolve, reject) => {
    client.get('statuses/user_timeline', params, (error, tweets) => {
      if(error) return reject(error);
      resolve(tweets);
    })
  })   
}

async function postTweet(text, opts){
  console.log('statuses/update', text, opts)
  return new Promise((resolve, reject) => {
    client.post(
      'statuses/update', 
      { status: text, ...opts },
      (error, tweet) => {
        if(error) return reject(error);
        resolve(tweet)
      }
    );
  })
}

async function postReply(text, toTweet) {
  return postTweet(`@${toTweet.user.screen_name} ${text}`, {
    in_reply_to_status_id: toTweet.id_str,
  })
}

module.exports = {
  getLatestTweets,
  postTweet,
  postReply
}