require('dotenv').config();

import request from 'request';

const VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;

let messaging = (req, res) => {
  return res.send("hello");
}

let getWebhook = (req, res) => {



  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }

}

let postWebhook = (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {


      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);
     
      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }

    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

}

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;

  // Check if the message contains text
  if (received_message.text) {
    // Create response for text message
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "¡Hola! ¿En qué puedo ayudarte?",
            "subtitle": "Selecciona una opción:",
            "buttons": [
              {
                "type": "postback",
                "title": "Quiero ver tus productos",
                "payload": "see_products",
              },
              {
                "type": "postback",
                "title": "Quiero saber más de ustedes",
                "payload": "about_us",
              }
            ],
          }]
        }
      }
    };
  } else if (received_message.attachments) {
    // Handle image attachment
    let attachmentUrl = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "¿Es esta la imagen correcta?",
            "subtitle": "Selecciona una opción:",
            "image_url": attachmentUrl,
            "buttons": [
              {
                "type": "postback",
                "title": "Sí",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No",
                "payload": "no",
              }
            ],
          }]
        }
      }
    };
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events (NECESARIO AÑADIR)
function handlePostback(sender_psid, received_postback) {
  let response;
  const payload = received_postback.payload;

  switch(payload) {
    case 'see_products':
      response = {"text": "Aquí tienes nuestro catálogo: https://ejemplo.com/productos"};
      break;
    case 'about_us':
      response = {"text": "Somos una empresa dedicada a... Visita: https://ejemplo.com/nosotros"};
      break;
    case 'yes':
      response = {"text": "¡Genial! ¿En qué más puedo ayudarte?"};
      break;
    case 'no':
      response = {"text": "Lamento eso. ¿Podrías enviar otra imagen?"};
      break;
    default:
      response = {"text": "Lo siento, no reconozco esa acción"};
  }

  callSendAPI(sender_psid, response);
}
// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { 'text': 'Thanks!' };
  } else if (payload === 'no') {
    response = { 'text': 'Oops, try sending another image.' };
  }

  if (payload === 'see_products') {
    response = { 'text': 'You can see our products here: https://example.com/products' };
  }
  if (payload === 'about_us') {
    response = { 'text': 'We are a company that values quality and customer satisfaction. Learn more about us at https://example.com/about' };
  }

  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {

  // The page access token we have generated in your app settings
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

  // Construct the message body
  let requestBody = {
    'recipient': {
      'id': sender_psid
    },
    'message': response
  };

  // Send the HTTP request to the Messenger Platform
  request({
    'uri': 'https://graph.facebook.com/v23.0/me/messages',
    'qs': { 'access_token': PAGE_ACCESS_TOKEN },
    'method': 'POST',
    'json': requestBody
  }, (err, _res, _body) => {
    if (!err) {
      console.log('Message sent!');
    } else {
      console.error('Unable to send message:' + err);
    }
  });
}


module.exports = {
  messaging: messaging,
  getWebhook: getWebhook,
  postWebhook: postWebhook
}


