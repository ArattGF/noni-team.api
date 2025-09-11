const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Facebook webhook verification
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'EAALOs3uD324BPaylTnZCFHzmEUAza78lKKOSzJNiZAORqO7FLfdSj4H7XYZB5NFSNSkzZCKcBRjWD0oNTjzGkGCEVn3zjXPyLkNec02Qf8Mb3ZAWlgZCYlW18NCHQQv46jBvtn4wydfkkVjWRo6me9smW7nZAhZB5zI1BJ4xCVgudNiD5PwsFT19Pxa8M4I1kZBRWpA79RAZDZD';

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Received webhook verification request:', req);

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Facebook webhook event handler
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);
      // Handle the event here (e.g., message, postback)
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
