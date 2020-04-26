const  Twitter = require('twitter')
const EventEmitter = require('events')


class TwitterListener extends EventEmitter {

  constructor(accessTokenOptions) {
    super()
    this.track = [];
    this.client = new Twitter(accessTokenOptions)
  }

  listenTo(track) {
    this.track = track
  }

  startListening() {
    this.stream = this.client.stream('statuses/filter', {
      track: this.track.join(','),
    })
    this.stream.on('data', tweet => this.emit('tweet', tweet))
    this.stream.on('error', err => {
      console.log('Stream error', err)
      this.reconnect()
    })
    this.stream.on('close', () => {
      console.log('Stream closed')
      this.reconnect()
    })
    this.stream.on('finish', () => {
      console.log('Stream finished')
      this.reconnect()
    })
  }

  reconnect(err){
    setTimeout(() => {
      try{
        this.stopListening();
      }catch(e){}
      this.startListening();
    }, 50000)
    
  }

  stopListening() {
    if (!this.stream) {
      return
    }
    this.stream.destroy()
    console.log('STOPPED -------')
  }
}

module.exports = TwitterListener;
