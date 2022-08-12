import { Router } from "express";
import {methods as controller} from "../controllers/controller.mjs";
const router = Router();


router.get("/", controller.getDefault);

//User
router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/user/:userid", controller.getUser);
router.put("/updateUser", controller.updateUser);
router.delete("/deleteUser/:userId", controller.deleteUser);

//Movement
router.get("/active/:userId", controller.getActive);
router.post("/active", controller.insertMovement);
router.delete("/active/:idActivo", controller.deleteMovement)

//Objetives
router.post("/event", controller.insertObjetive);
router.get("/objetive/:userId/:currentDay", controller.getObjetive);
router.get("/objetive/:userId", controller.getAllDetails);
router.put("/update", controller.updateAllDetails);
router.put("/updateEvent/", controller.updateObjetive);
router.delete("/event/:idEvento", controller.deleteObjetvie)

//Totals
router.post("/total", controller.insertTotal)
router.get("/total/:userid", controller.getLastTotal);
router.get("/total/:userId/:currentDay", controller.getCurrentMonthTotal);
export default router;