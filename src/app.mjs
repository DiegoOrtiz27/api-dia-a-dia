import express from "express";
import morgan from "morgan";
// Routes
import routes from "./routes/routes";


const app = express();
const cors = require('cors');

// Settings
const port = process.env.PORT || 3000;
app.set("port", port);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors()); //Dar permisos para usar la api

// Routes
app.use(routes);

export default app;