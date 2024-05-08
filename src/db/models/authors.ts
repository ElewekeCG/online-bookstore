import { Document, Schema, Types, model } from "mongoose";

const AuthorSchema = new Schema (
    {
        firstName: {
            type: String,
            maxlength: 30,
            required: [true, "Enter first name"],
        },
        lastName: {
            type: String,
            maxlength: 30,
            required: [true, "Enter last name"],
        },
        book: {
            type: Types.ObjectId,
            ref: "Books",
            required: true,
        },
});

AuthorSchema.methods.toJSON = function(): any {
    return {
        id: this._id,
        firstName: this.firstName, 
        lastName: this.lastName,
        book: this.book,
    };
};

interface AuthorDocument extends Document {
    firstName: string;
    lastName: string; 
    book: Types.ObjectId;
    toJSON: () => any;      
}

export default model<AuthorDocument>("Authors", AuthorSchema);
