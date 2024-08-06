import { Router } from "express";
import { courierController } from "../controllers/CourierController";

export const courierRoutes = (): Router => {
  const router = Router();

  router.post("/couriers", courierController.addCouriers);
  router.post("/courier", courierController.addCourier);
  router.get("/couriers", courierController.getAllCouriers);
  router.get("/courierlocation/:id", courierController.getCourierLocation);
  router.delete("/courier/:id", courierController.deleteCourier);
  router.patch("/courier/:id", courierController.updateCourier);
  

  return router;
};
