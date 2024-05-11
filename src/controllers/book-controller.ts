import { StatusCodes } from "http-status-codes";
import {
    // Body,
    Controller,
    Get,
    OperationId,
    // Path,
    // Post,
    Response,
    Route,
    Security,
} from "tsoa";

import { BookService } from "../services/book-service";
import { 
    BookProduct, 
} from "../services/models/book-model";

@Route("/api/v1/books")
export class BookController extends Controller {
    @Get("/get")
    @OperationId("getBooks")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.UNAUTHORIZED)
    @Security("jwt")
    public async getBooks (): Promise<BookProduct> {
        return await new BookService().viewBooks();
    }
}