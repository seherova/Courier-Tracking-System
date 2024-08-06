import { request, Request, Response } from "express";
import { CourierService } from "../service/CourierService";
import { Courier, CourierEntity } from "../entity/Courier";

class CourierController {
  //private courierService: CourierService;
  /*  constructor(courierService: CourierService){
        this.courierService = courierService;
    }
*/

  private _innerCourierAddFn = (courier: Courier) => {
    const { name, surname, latitude, longitude, isAvailable } = courier;

    const courierInstance: Courier = new Courier(
      name,
      surname,
      latitude,
      longitude,
      isAvailable
    );
    return courierInstance.save();
  };

  addCouriers = async (req: Request, res: Response) => {
    console.log(req.body);
    const couriers = req.body as Courier[];

    try {
      for (const courier of couriers) {
        await this._innerCourierAddFn(courier);
      }
      res.status(201).send("Courier added succesfully!");
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };

  addCourier = async (req: Request, res: Response) => {
    try {
      await this._innerCourierAddFn(req.body);
      res.status(201).send("Courier added succesfully!");
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };

  deleteCourier = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const courier = new Courier();
      await courier.delete(id);
      res.status(200).send("Courier deleted succesfully!");
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };

  updateCourier = async (req: Request, res: Response) => {
    console.log("Patch request received for updating courier");
    const { id } = req.params;
    const updateData = req.body as Partial<CourierEntity>;

    try {
      const courier = new Courier();
      await courier.update(id, updateData);
      res.status(200).send("updated courier succesfully!");
    } catch (e: any) {
      res.status(400).send(e.message);
    }
  };

  getAllCouriers = async (req: Request, res: Response) => {
    try {
      const courier = new Courier();
      const couriers = await courier.findAll();
      res.status(200).json(couriers);
    } catch (e: any) {
      res.status(400).send(e.message);
    }
  };

  getCourierLocation = async (req: Request, res: Response) => {
    const {id} = req.params;

    try{
      const courier = new Courier();
      const courierlocation = await courier.locationById(id);
      res.status(200).json(courierlocation);
    }catch(e: any){
      res.status(400).send(e.message);
    }
  };
}

export const courierController = new CourierController();
