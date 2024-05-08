import { StatusCodes } from "http-status-codes";

import {
    Body,
    Controller,
    OperationId,
    Post,
    Response,
    Route,
    Security,
} from "tsoa";

import { OrderService, OrderFactory} from "../services/order-service";
import { InventoryFacade } from "../services/inventory-service";
import { CartService } from "../services/cart-service";

interface OrderRequest {
    customerId: string;
    shippingAddress: string;
}

@Route("/api/v1/order")
export class OrderController extends Controller {
    private readonly orderService: OrderService;
    constructor() {
        super();
        const cartService = new CartService();
        const inventoryService = new InventoryFacade();
        const orderFactory = new OrderFactory(cartService, inventoryService);
        this.orderService = new OrderService(orderFactory);
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
}