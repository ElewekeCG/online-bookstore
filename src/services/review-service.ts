// importing the review schema model
import reviewModel from "../db/models/reviews";

// defining an interface to specify the request body parameters
export interface ReviewParams {
    book: string;
    rating: number;
    reviewText: string;
}

// defining an interface for the expected review response
export interface ReviewResult {
    id: string;
    book: string;
    rating: number;
    reviewText: string;
}

// creating a review service class
export class ReviewService {
    /* method to review  a book, takes in the review params and returns 
    a promise of type review result*/
    public async addReview(params: ReviewParams): Promise<ReviewResult> {
        try{
            // creating an instance of the review schema with the request parameters
            const review = await reviewModel.create({
                book: params.book,
                rating: params.rating,
                reviewText: params.reviewText
            });
            // checking if the creation was successful
            if(!review) {
                throw new Error("failed to create review");
            }
            // if the creation was successful, the review response is returned in JSON format
            return review.toJSON() as ReviewResult;
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    /* method to view the reviews of a particular book,
    takes in the book id and returns a promise of type review result*/
    public async getReviews(book: string): Promise<ReviewResult> {
        try {
            // querying the database for reviews with the given bookId
            const result = await reviewModel.find({book});
            // checking if query was successful
            if(!result) {
                throw new Error("no review for this book yet");
            }
            // return query response
            return result as unknown as ReviewResult;
        } catch(error) {
            console.error(error);
            throw error;
        }  
    }
}