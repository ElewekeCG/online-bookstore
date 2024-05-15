// importing status code that will be used alongside responses
import { StatusCodes } from "http-status-codes";

/* importing typescript open API decorators to allow me 
 define the required meta-information in the controller code
 and also generate API documentation.*/
import {
    Controller,
    Get,
    OperationId,
    Response,
    Route,
    Security,
} from "tsoa";

// importing the book service calss
import { BookService } from "../services/book-service";

//importing interface defined in book-model.ts that specifies the response format
import { 
    BookProduct, 
} from "../services/models/book-model";

// tsoa decorator that specifies the base path of the controller
@Route("/api/v1/books")

/*book controller class inherits the tsoa controller class and its basic
functionality */
export class BookController extends Controller {
    @Get("/get")
    @OperationId("getBooks")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.UNAUTHORIZED)
    // specifying the authentication method
    @Security("jwt")
    // this method has no request body
    public async getBooks (): Promise<BookProduct> {
        // calling an instance of the book service class to return available books
        return await new BookService().viewBooks();
    }
}