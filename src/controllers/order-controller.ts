import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";

import {
    Body,
    Controller,
    OperationId,
    Post,
    Response,
    Route,
    Security,
} from "tsoa";

import { OrderService, Order} from "../services/order-service";
import { InventoryFacade } from "../services/inventory-service";
import { CartService } from "../services/cart-service";

interface OrderRequest {
    customerId: Types.ObjectId;
    shippingAddress: string;
}

@Route("/api/v1/order")
export class OrderController extends Controller {
    private readonly orderService: OrderService;
    constructor() {
        super();
        const cartService = new CartService();
        const inventoryService = new InventoryFacade();
        this.orderService = new OrderService(cartService, inventoryService);
    }
    @Post("/checkout")
    @OperationId("checkout")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.UNAUTHORIZED)
    @Security("jwt")
    public async checkout(
        @Body() body: OrderRequest
    ): Promise<void> {
        await this.orderService.createOrder(body.customerId, body.shippingAddress);
    }

    @Post("/view/order")
    @OperationId("viewOrder")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.UNAUTHORIZED)
    @Security("jwt")
    public async getOrders(
        @Body() customerId: Types.ObjectId
    ): Promise<Order> {
       return await this.orderService.view(customerId);
    }
}