import { Document, Types, connection, Schema } from "mongoose";

const db = connection.useDb('onlineBookStore');

const ReviewsSchema = new Schema({
    book: {
        type: Types.ObjectId,
        ref: "Books",
        required: true
    },
    rating: {
        type: Number,
        min: [1, "the minimum rating is 1"],
        max: [5, "the maximum rating is 5"],
        required: true
    },
    reviewText: {
        type: String,
        required: true,
        maxlength: [200, "keep your comments within 200 characters"],
        minlength: [4, "please comment at least 4 characters"]
    },
}, {timestamps: true});

ReviewsSchema.methods.toJSON = function(): any {
    return {
        id: this._id,
        book: this.book,
        rating: this.rating,
        reviewText: this.reviewText, 
    };
};

interface ReviewsDocument extends Document {
    book: Types.ObjectId;
    rating: number;
    reviewText: string; 
    toJSON: () => any;      
}

export default db.model<ReviewsDocument>("Reviews", ReviewsSchema);
