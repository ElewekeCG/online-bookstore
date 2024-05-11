import reviewModel from "../db/models/reviews";

export interface ReviewParams {
    book: string;
    rating: number;
    reviewText: string;
}

export interface ReviewResult {
    id: string;
    book: string;
    rating: number;
    reviewText: string;
}
export class ReviewService {
    public async addReview(params: ReviewParams): Promise<ReviewResult> {
        try{
            const review = await reviewModel.create({
                book: params.book,
                rating: params.rating,
                reviewText: params.reviewText
            });
            if(!review) {
                throw new Error("failed to create review");
            }
            return review.toJSON() as ReviewResult;
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    public async getReviews(book: string): Promise<ReviewResult> {
        try {
            const result = await reviewModel.find({book});
            if(!result) {
                throw new Error("no review for this book yet");
            }
            return result as unknown as ReviewResult;
        } catch(error) {
            console.error(error);
            throw error;
        }  
    }
}