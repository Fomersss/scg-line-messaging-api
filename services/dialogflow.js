const request = require('request');
const config = require('../config.json')

async function postToDialogFlow(req) {
  req.headers.host = config.dialogFlow.host;
  return request.post({
    uri: config.dialogFlow.uri,
    headers: req.headers,
    body: JSON.stringify(req.body)
  });
}


module.exports = { postToDialogFlow }