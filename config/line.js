if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

module.exports = config