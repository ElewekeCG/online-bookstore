import { Document, Schema, Types, model } from "mongoose";

const BookSchema = new Schema (
    {
        author: {
            type: Types.ObjectId,
            ref: "Authors",
            required: true, 
        },
        publisher: {
            type: Types.ObjectId,
            ref: "Publishers",
            required: true, 
        },
        title: { 
            type: String,
            minlength: [3, "length cannot be less than 3 characters"],
            maxlength: [30, "Title cannot exceed 30 characters"],
            required: [true, "Enter title"],
        },
        ISBN: {
            type: String,
            required: [true, "Please enter isbn"],
            minlength: 3,
            maxlength: [20, "characters cannot be more than 20"],
            unique: true,
        },
        genre: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 10,
        },
        publicationYear: {
            type: Number,
            required: true,
            min: 1800
        },
        price: {
            type: Number,
            required: [true, "please enter price"],
            min: 0,
        },
        description: {
            type: String,
            minlength: 4,
            maxlength: 50,
            required: true,
        },
});

BookSchema.methods.toJSON = function(): any {
    return {
        id: this._id,
        author: this.author,
        publisher: this.publisher,
        title: this.title,
        ISBN: this.ISBN,
        genre: this.genre,
        publicationYear: this.publicationYear,
        price: this.price,
        description: this.description,
    };
};

interface BookDocument extends Document {
    author: Types.ObjectId;
    publisher: Types.ObjectId;
    title: string;
    ISBN: string;
    genre: string;
    publicationYear: number;
    price: number;
    description: string;
    toJSON: () => any;      
}

export default model<BookDocument>("Books", BookSchema);
