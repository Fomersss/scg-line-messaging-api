'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const config = require('./config.json')
const dialogflowService = require('./services/dialogflow')
const admin = require("firebase-admin");
const serviceAccount = require("./firebase.json");

// initial firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebase.databaseURL
});


const configLine = {
  channelAccessToken: '41xVYHPUA4RAnSlm46Q1sXUCzL2h/laISBgNuL1cdY2fFhAYX0z3anpFYqSb1vzDilmANUbrSzge3q1Qt47Pck3sJVUJ9XQPixycEtWjZpcTDAigkuYeZTCaJA69Ru4yJsTUBOKUeXW0p/JKZou3PwdB04t89/1O/w1cDnyilFU=',
  channelSecret: '2c573d3d3f983c9261e5e1fcc9729b70',
};


// create LINE SDK client
const client = new line.Client(configLine);

// create Express app
const app = express();


// register a webhook handler with middleware
app.post('/callback', line.middleware(configLine), (req, res) => {
  Promise
    .all(req.body.events.map((event) => {
      // for verify line webhook
      if (event.source.userId === 'Udeadbeefdeadbeefdeadbeefdeadbeef') {
        return;
      }
      // return handleEvent(event,req)
    }))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
async function handleEvent(event,req) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  if (event.message.text === 'location' || event.message.text === 'Location') {
      const db = admin.database();
      const ref = db.ref();  
     
      //get data from firebase db
      ref.once("value", async function (snapshot) {
        const data = await snapshot.val();  
        if(data){
          // use reply API
          return client.replyMessage(event.replyToken,data.location)
        }
    });
  } else {
    // Post request from line bot to firebase webhook
    dialogflowService.postToDialogFlow(req);
  }
}


// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});