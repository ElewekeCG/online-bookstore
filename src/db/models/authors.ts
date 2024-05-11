import { Document, Schema, model } from "mongoose";

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
        biography: {
            type: String,
            minlength: [10, "biography must be at least 1o characters"],
            required: true,
        },
});

AuthorSchema.methods.toJSON = function(): any {
    return {
        id: this._id,
        firstName: this.firstName, 
        lastName: this.lastName,
        biography: this.biography,
    };
};

interface AuthorDocument extends Document {
    firstName: string;
    lastName: string; 
    biography: string;
    toJSON: () => any;      
}

export default model<AuthorDocument>("Authors", AuthorSchema);
