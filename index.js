require('dotenv').config();
const axios = require('axios')
const cron = require('node-cron');
const { getLatestTweets, postReply } = require('./twitterLib');
const TwitterListener = require('./TwitterListener');
const mentionListener = new TwitterListener(require('./credentials'))


function pause(ms){
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function getText(){
  const resp = await axios.get('https://automotron-v2.lipsumar.io/api/generators/0Shh5ZhGe/run')
  return resp.data.text
}

async function replyToRobert (pauseBefore = true) {

  if(pauseBefore){
    await pause(60*1000 + Math.random()*10*60*1000)
  }
  
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
replyToRobert(false)
cron.schedule('* 14,19 * * *', replyToRobert);


mentionListener.listenTo(['@bonpublic'])
mentionListener.on('tweet', async (tweet) => {
  console.log('Mention!', tweet.text)
  const text = await getText();
  console.log('reply =>', text)
  postReply(text, tweet);
})
mentionListener.startListening();
