import { config } from "dotenv";

config();

export default {
    host: process.env.HOST || "bhhbr3puxk4lmuar74uz-mysql.services.clever-cloud.com",
    database: process.env.DATABASE || "bhhbr3puxk4lmuar74uz",
    user: process.env.USER || "utp7ci84qcda5je2",
    password: process.env.PASSWORD || "kC6POPYbIaqXwUGsGnqc"
};