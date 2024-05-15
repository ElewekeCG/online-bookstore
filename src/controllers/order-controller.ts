// importing status code that will be used alongside responses
import { StatusCodes } from "http-status-codes";

// importing types from mongoose in order to use the object id data type
import { Types } from "mongoose";

/* importing typescript open API decorators to allow me 
 define the required meta-information in the controller code
 and also generate API documentation.*/
import {
    Body,
    Controller,
    Get,
    OperationId,
    Path,
    Post,
    Response,
    Route,
    Security,
} from "tsoa";

// importing order service and order interface
import { OrderService, Order} from "../services/order-service";
// importing cart service
import { CartService } from "../services/cart-service";

// specifying the request params
interface OrderRequest {
    customerId: Types.ObjectId;
    shippingAddress: Types.ObjectId;
}

// tsoa decorator to specify the base path for this controller
@Route("/api/v1/order")
/*order controller class inherits the tsoa controller class and its basic
functionality */
export class OrderController extends Controller {
    // creating instances of order and cart service
    private readonly orderService: OrderService;
    constructor() {
        super();
        const cartService = new CartService();
        this.orderService = new OrderService(cartService);
    }

    // specifies that this is a HTTP POST request
    @Post("/checkout")
    @OperationId("checkout")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.UNAUTHORIZED)
    @Security("jwt")
    public async checkout(
        // specifying the requesy bosy params
        @Body() body: OrderRequest
    ): Promise<Order> {
        // calling the order service instance to create an order
        return await this.orderService.createOrder(body.customerId, body.shippingAddress);
    }

    // specifies that this is a HTTP GET request
    // {customerId} is passed to the path as a variable
    @Get("/{customerId}/view")
    @OperationId("viewOrder")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.UNAUTHORIZED)
    @Security("jwt")
    public async getOrders(
        // specifies the type of variable that is appended to the route path
        @Path() customerId: Types.ObjectId
    ): Promise<any> {
       return await this.orderService.view(customerId);
    }
}