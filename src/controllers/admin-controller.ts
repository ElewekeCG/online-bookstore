/*this controller consists of all the operations that only admins/staff can perform
such as inventory management and adding books */

// importing status code that will be used alongside responses
import { StatusCodes } from "http-status-codes";

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
    Tags, 
} from "tsoa";

//importing interface defined in book-model.ts that specifies the request params and response
import { 
    AvailableBooks, 
    BookProduct, 
} from "../services/models/book-model";

// importing the inventory facade and the inventory item interface
import { 
    InventoryFacade, 
    InventoryItem
} from "../services/inventory-service";

// importing the admin service class to handle authentication
import AdminService from "../services/admin-service";

// importing the book service class 
import { BookService } from "../services/book-service";

// tsoa decorator that specifies the base path of the controller
@Route("/api/v1/admin")
// specifies the tag that will be used in generating documentation
@Tags("Admin")
/*admin controller class inherits the tsoa controller class and its basic
functionality */
export class AdminController extends Controller {
    // creating an inatsance of the inventory facade
    private inventory = new InventoryFacade();

    @Post("register")
    @OperationId("registerAdmin")
    // method tohandle admin creation
    public async register(
        @Body() requestBody: {username: string, password: string}
    ): Promise<{id: string, username: string, token: string}> {
        this.setStatus(StatusCodes.CREATED);
        return new AdminService().register(requestBody.username, requestBody.password);
    }

    @Post("/login")
    @OperationId("loginAdmin")
    // method to handle admin login
    public async login(
        @Body() requestBody: {username: string, password: string}
    ): Promise<{username: string, token: string}> {
        this.setStatus(StatusCodes.OK);
        return new AdminService().login(requestBody.username, requestBody.password);
    }

    // method to handle book creation
    @Post("/books/add")
    @OperationId("addBook")
    @Response(StatusCodes.CREATED)
    @Response(StatusCodes.UNAUTHORIZED)
    @Security("jwt")
    public async addBook(
        @Body() body: AvailableBooks
    ): Promise<BookProduct> {
        try {
            const result = await new BookService().addBooks(body);
            return result;
        } catch(error) {
            throw error;
        }  
    }

    // method for updating/adding inventory items
    @Post("/inventory/update")
    @OperationId("updateInventory")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.UNAUTHORIZED)
    @Security("jwt")
    public async updateInventory(
        @Body() body: InventoryItem
    ): Promise<InventoryItem> {
        return await this.inventory.updateInventory(body.book, body.quantity);
    }

    // method to view inventory levels
    // @GET specifies that this is a HTTP GET request
    // {book} is passed to the path as a variable
    @Get("/{book}/inventory")
    @OperationId("getInventory")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.UNAUTHORIZED)
    @Security("jwt")
    public async getInv (
        // specifies the type of variable that is appended to the route path
        @Path() book: string
    ): Promise<InventoryItem> {
        return await this.inventory.viewInventory(book);
    }
}
