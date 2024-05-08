import { StatusCodes } from "http-status-codes";
// import { Types } from "mongoose";
import {
    Body,
    Controller,
    // Delete,
    // Get,
    OperationId,
    // Patch,
    Post,
    // Request,
    Response,
    Route,
    Security,
} from "tsoa";

import { BookService } from "../services/book-service";
import { 
    AvailableBooks, 
    BookProduct, 
 } from "../services/models/book-model";

// this request allows us to specify the data type of the request object itself
// import * as ExpressRequest from "express";

@Route("/api/v1/books")
export class BookController extends Controller {
    
    @Post("/add")
    @OperationId("addBook")
    @Response(StatusCodes.CREATED)
    @Response(StatusCodes.UNAUTHORIZED)
    @Security("jwt")
    public async addBook(
        @Body() body: AvailableBooks
    ): Promise<BookProduct> {
        const result = await new BookService().addBooks(body);
        return result;
    }
}