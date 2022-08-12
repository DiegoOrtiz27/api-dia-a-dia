import express from "express";
import cors from "cors";
// Routes
import routes from "./routes/routes.mjs";


const app = express();


// Settings
const port = process.env.PORT || 3000;
app.set("port", port);


app.use(express.json());
app.use(cors()); //Dar permisos para usar la api

// Routes
app.use(routes);

export default app;