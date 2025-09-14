require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initWebRoutes from './routes/web';

// Initialize express app
let app = express();

// Configure view engine
viewEngine(app);

// Parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize web routes
initWebRoutes(app);

// Start the server
let port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("Backend Nodejs is running on the port: " + port);
});


