import express from "express";

// Routes
import routes from "./routes/routes.mjs";


const app = express();
const cors = require('cors');

// Settings
const port = process.env.PORT || 3000;
app.set("port", port);


app.use(express.json());
app.use(cors()); //Dar permisos para usar la api

// Routes
app.use(routes);

export default app;