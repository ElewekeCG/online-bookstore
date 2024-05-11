import { StatusCodes } from "http-status-codes";

import {
    Body, 
    Controller,
    // Delete,
    Get,
    OperationId, 
    Post,
    Response,
    // Request,
    Route,
    Security,
    Tags, 
} from "tsoa";

import { 
    AvailableBooks, 
    BookProduct, 
} from "../services/models/book-model";

import { InventoryFacade } from "../services/inventory-service";
import { InventoryItem } from "../services/inventory-service";

import AdminService from "../services/admin-service";
import { BookService } from "../services/book-service";

@Route("/api/v1/admin")
@Tags("Admin")
export class AdminController extends Controller {
    private inventory = new InventoryFacade();
    @Post("register")
    @OperationId("registerAdmin")
    public async register(
        @Body() requestBody: {username: string, password: string}
    ): Promise<{id: string, username: string, token: string}> {
        this.setStatus(StatusCodes.CREATED);
        return new AdminService().register(requestBody.username, requestBody.password);
    }

    @Post("/login")
    @OperationId("loginAdmin")
    public async login(
        @Body() requestBody: {username: string, password: string}
    ): Promise<{username: string, token: string}> {
        this.setStatus(StatusCodes.OK);
        return new AdminService().login(requestBody.username, requestBody.password);
    }

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

    @Post("/inventory/update")
    @OperationId("updateInventory")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.UNAUTHORIZED)
    @Security("jwt")
    public async updateInventory(
        @Body() body: InventoryItem[]
    ): Promise<void> {
        await this.inventory.updateInventory(body);
    }

    @Get("/inventory/update")
    @OperationId("getInventory")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.UNAUTHORIZED)
    @Security("jwt")
    public async getInv (): Promise<InventoryItem> {
        return await this.inventory.viewInventory();
    }
}
