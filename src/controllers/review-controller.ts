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
} from "tsoa";

// importing review service class and the interfaces that specify the rquest and response format
import { 
    ReviewService,
    ReviewParams,
    ReviewResult
} from "../services/review-service";

// tsoa decorator that specifies the base path of the controller
@Route("/api/v1/reviews")
/*review controller class inherits the tsoa controller class and its basic
functionality */
export class ReviewController extends Controller {
    
    // specifies that this is a HTTP POST request
    @Post("/add")
    @OperationId("addReview")
    // specifies the status code for successful requests
    @Response(StatusCodes.CREATED)
    // specifies the status code for failed requests
    @Response(StatusCodes.UNAUTHORIZED)
    // specifies the authentication method
    @Security("jwt")
    public async addBook(
        // specifies th request body type
        @Body() body: ReviewParams
    ): Promise<ReviewResult> {
        try {
            // calls an instance of the review service class to perform operation
            const result = await new ReviewService().addReview(body);
            return result;
        } catch(error) {
            throw error;
        }
         
    }

    // specifies that this is a HTTP GET request
    // {book} is passed to the path as a variable
    @Get("/{book}/get")
    @OperationId("getReviews")
    // specifies the status code for successful requests
    @Response(StatusCodes.OK)
    // specifies the status code for failed requests
    @Response(StatusCodes.UNAUTHORIZED)
    // specifying that jwt is the authentication method
    @Security("jwt")
    public async getReviews (
        // specifies the type of variable that is appended to the route path
        @Path() book: string
        // return promise of type review result
    ): Promise<ReviewResult> {
        // calls an instance of th review service class to handle operation
        return await new ReviewService().getReviews(book);
    }
}