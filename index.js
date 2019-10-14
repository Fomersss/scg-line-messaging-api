'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
// const path = require('path');


// create LINE SDK config from env variables
const config = {
  channelAccessToken: '41xVYHPUA4RAnSlm46Q1sXUCzL2h/laISBgNuL1cdY2fFhAYX0z3anpFYqSb1vzDilmANUbrSzge3q1Qt47Pck3sJVUJ9XQPixycEtWjZpcTDAigkuYeZTCaJA69Ru4yJsTUBOKUeXW0p/JKZou3PwdB04t89/1O/w1cDnyilFU=',
  channelSecret: '2c573d3d3f983c9261e5e1fcc9729b70',
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();


// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map((event) => {
        if(event.source.userId === 'Udeadbeefdeadbeefdeadbeefdeadbeef'){
            return;
        }
    return handleEvent(event)
    }))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
    console.log('event ==> ', event);
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});