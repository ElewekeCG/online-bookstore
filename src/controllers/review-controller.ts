import { StatusCodes } from "http-status-codes";
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

import { 
    ReviewService,
    ReviewParams,
    ReviewResult
} from "../services/review-service";

@Route("/api/v1/reviews")
export class ReviewController extends Controller {
    
    @Post("/add")
    @OperationId("addReview")
    @Response(StatusCodes.CREATED)
    @Response(StatusCodes.UNAUTHORIZED)
    @Security("jwt")
    public async addBook(
        @Body() body: ReviewParams
    ): Promise<ReviewResult> {
        try {
            const result = await new ReviewService().addReview(body);
            return result;
        } catch(error) {
            throw error;
        }
         
    }

    @Get("/{book}/get")
    @OperationId("getReviews")
    @Response(StatusCodes.OK)
    @Response(StatusCodes.UNAUTHORIZED)
    @Security("jwt")
    public async getReviews (
        @Path() book: string
    ): Promise<ReviewResult> {
        return await new ReviewService().getReviews(book);
    }
}