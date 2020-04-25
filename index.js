require('dotenv').config();
const axios = require('axios')
const cron = require('node-cron');
const { getLatestTweets, postReply } = require('./twitterLib');

function pause(ms){
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function getText(){
  const resp = await axios.get('https://automotron-v2.lipsumar.io/api/generators/0Shh5ZhGe/run')
  return resp.data.text
}

async function replyToRobert () {

  await pause(60*1000 + Math.random()*20*60*1000)
  try{
    const [lastTweet] = await getLatestTweets('robertessayer', 1);
    const selfLatestTweets = await getLatestTweets('bonpublic', 5);
    const tweetReplyFromSelf = selfLatestTweets.find(tweet => tweet.in_reply_to_status_id_str === lastTweet.id_str)
    if(tweetReplyFromSelf){
      console.log('already replied...')
    }else{
      console.log('not yet replied!')
      const text = await getText()
      postReply(text, lastTweet)
      console.log('Tweeted: ' + text)
    }
    
  }catch(err){
    console.log('Error!', err)
  }

}
replyToRobert()
cron.schedule('* 12,17 * * *', replyToRobert);
