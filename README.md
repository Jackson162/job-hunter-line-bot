# job-hunter-line-bot

A web scraper, built with Node.js, Express, Puppeteer and Cheerio.<br> 

## Features

1. scrapes and sends back Node.js or backend jobs information from 104 Job Bank, the biggest job searching platform in Taiwan, upon receiving the specific message via LINE message API.

2. It operates periodically when executed by Heroku scheduler.

## Prerequisites

**global packages**

1. Node.js: v10.15.0 
2. nodemon: v2.0.6
3. npm: v6.4.1

**local packages**

Please check `dependencies` in `package.json`.<br> 

## Installation and Execution

Please check `scripts` in `package.json` for commands.<br> 

1. clone the project:
```
git clone https://github.com/Jackson162/job-hunter-line-bot.git
```
2.  go into root directory and install packages: 
```
npm install
```
3. register LINE developer account

4. add .env file and set the enviroment variables.

5. launch server:
```
npm run dev
```

6. get public URL for LINE Webhook 
```
./ngrok http 3000
```

7. add your LINE bot as your friend and send some messages!