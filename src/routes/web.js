import express from 'express';
import chatController from '../controllers/chatController';

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", chatController.test);

  router.get("/webhook", chatController.getWebhook);
  router.post("/webhook", chatController.postWebhook);
  

  return app.use("/", router); 
};

module.exports = initWebRoutes;