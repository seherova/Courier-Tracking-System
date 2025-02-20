
import { ObjectId } from "mongodb";
import { CourierOrder } from "../entity/CourierOrder";
import { Order, OrderEntity } from "../entity/Order";
import { Request, Response } from "express";
import { IUpdateOrderStatusParams } from "../entity/OrderStatus";
import { TrendyolAPI } from "./trendyol-api";

class OrderController {
  private _innerOrderAddFn = async (orderData: Partial<OrderEntity>) => {
    const { customerId, restaurantId, status } = orderData;

    if (!customerId || !restaurantId) {
      throw new Error("Missing required order fields");
    }
    const orderInstance: Order = new Order(
      
      customerId,
      restaurantId,
      status
    );
    return orderInstance.save();
  };

  createOrder = async (req: Request, res: Response) => {
    // console.log(req.body);
    // const orders = req.body as Order[];
    try {
      // for(const order of orders){
      //     await this._innerOrderAddFn(order);
      // }
      await this._innerOrderAddFn(req.body);
      res.status(201).send("Order created successfully.");
    } catch (e: any) {
      res.status(400).send(e.message);
    }
  };

  updateOrderStatus = async (req: Request<any, any, IUpdateOrderStatusParams>, res: Response) => {
    const { id, status } = req.body
    if (!id || !status) {
      return res.status(400).send("Order ID and status are required");
    }

    try {
      const order = new Order();
      await order.updateStatus(id, status);
      res.status(200).send("Order status updated successfully.");
    } catch (e: any) {
      res.status(400).send(e.message);
    }
  };

  getOrder = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("Order ID is required");
    }

    try {
      const order = new Order();
      const result = await order.findById(id);

      if (!result) {
        return res.status(404).send("Order not found");
      }

      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).send(e.message);
    }
  };

  getAllOrders = async (req: Request, res: Response) => {
    try {
      const order = new Order();
      const results = await order.findAll();

      res.status(200).json(results);
    } catch (e: any) {
      res.status(400).send(e.message);
    }
  };

  assignOrderToCourier = async (req: Request, res: Response) => {
    try {
    const { courierId, orderId } = req.body as {courierId: string, orderId: string};

   
  
    const courierOrder = new CourierOrder( new ObjectId(courierId),  new ObjectId(orderId));
    const result = await courierOrder.save();
    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
  }

  getTrendyolOrders = async(req: Request, res: Response) => {
    const {storeId } = req.body;
   
    const ty = new TrendyolAPI();
    const result = await ty.getOrders(storeId);
    res.status(200).json(result);

  }
}

export const orderController = new OrderController();
