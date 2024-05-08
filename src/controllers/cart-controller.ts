import { StatusCodes } from "http-status-codes";
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

 interface CartRequest {
    customerId: string;
    item: CartItem;
 }
import { Cart, CartItem, CartService } from "../services/cart-service";
// import AuthenticatedUser from "../middleware/models/authenticated-user";

@Route("/api/v1/cart")
export class CartController extends Controller {
    private cartService: CartService;
    constructor() {
        super();
        this.cartService = new CartService;
    }
    @Post("/add")
    @OperationId("addToCart")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.UNAUTHORIZED)
    @Security("jwt")
    public async addToCart(
        @Body() requestBody: CartRequest
    ): Promise<Cart> { 
        return await this.cartService.addCart(requestBody.customerId, requestBody.item);
    }

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

    @Delete("/clear/{customerId}")
    @OperationId("clearCart")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.NOT_FOUND)
    @Security("jwt")
    public async clearCart(
        @Path() customerId: string
    ): Promise<Cart> {
        return await this.cartService.deleteCart(customerId);
    }

    @Get("/view/cart/{customerId}")
    @OperationId("viewCart")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.NOT_FOUND)
    @Security("jwt")
    public async getCart(
        @Path() customerId: string
        // @Request() request: ExpressRequest.Request
    ): Promise<Cart> {
        // const user = request.user as AuthenticatedUser;
        // const customerId = user.id;
        return await this.cartService.viewCart(customerId);
    }
}