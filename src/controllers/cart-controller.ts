// importing status code that will be used alongside responses
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
/* importing typescript open API decorators to allow me 
 define the required meta-information in the controller code
 and also generate API documentation.*/
import {
    Body,
    Controller,
    Delete,
    Get,
    OperationId,
    Patch,
    Path,
    Post,
    Response,
    Route,
    Security,
} from "tsoa";

// defining the request parameters
 interface CartRequest {
    customerId: Types.ObjectId;
    item: CartItem;
 }
import { Cart, CartItem, CartService } from "../services/cart-service";

// tsoa decorator that specifies the base path of the controller 
@Route("/api/v1/cart")
/*cart controller class inherits the tsoa controller class and its basic
functionality */
export class CartController extends Controller {
    /*creating an instance of the cart service class in order to perform
     cart operations*/
    private cartService: CartService;
    constructor() {
        super();
        this.cartService = new CartService;
    }
    // tsoa decorator that specifies that this is a POST HTTP method 
    // it also specifies the path which will be appended to the base path
    @Post("/add")
    // this provides a name for this particular controller method
    @OperationId("addToCart")
    // specifies the status code for successful requests
    @Response(StatusCodes.OK)
    // specifies the error status code
    @Response(StatusCodes.UNAUTHORIZED)
    // specifies the authentication method
    @Security("jwt")
    public async addToCart(
        // specifies the request body
        @Body() requestBody: CartRequest
    ): Promise<Cart> { 
        /*call the instance of the cart service 
        class in order to perform the add to cart operation*/
        return await this.cartService.addCart(requestBody.customerId, requestBody.item);
    }

    // specifies that this is a HTTP PATCH request
    @Patch("/removeItem")
    @OperationId("removeFromCart")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.NOT_FOUND)
    @Security("jwt")
    public async removeFromCart(
        @Body() requestBody: CartRequest
    ): Promise<Cart> {
        return await this.cartService.removeCart(requestBody.customerId, requestBody.item);
    }
    // specifies that this is a HTTP DELETE request
    // {customerId} is passed to the path as a variable
    @Delete("/{customerId}")
    @OperationId("clearCart")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.NOT_FOUND)
    @Security("jwt")
    public async clearCart(
        // specifies the type of variable that is appended to the route path
        @Path() customerId: Types.ObjectId
    ): Promise<Cart> {
        return await this.cartService.deleteCart(customerId);
    }

    // specifies that this is a HTTP GET request
    // {customerId} is passed to the path as a variable
    @Get("/{customerId}/view")
    @OperationId("viewCart")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.NOT_FOUND)
    @Security("jwt")
    public async getCart(
        // specifies the type of variable that is appended to the route path
        @Path() customerId: Types.ObjectId
    ): Promise<Cart> {
        // calls the get cart method from the cart service instance
        return await this.cartService.viewCart(customerId);
    }
}