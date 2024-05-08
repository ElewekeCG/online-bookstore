import { Document, Schema, Types, model } from "mongoose";

const PublisherSchema = new Schema (
    {
        name: {
            type: String,
            required: [true, "enter name"],
            maxlength: [30, "name cannot exceed 30 characters"]
        },
        country: {
            type: String,
            maxlength: [30, "country cannot exceed 25 characters"],
            minlength: [3, "country cannot be less than 3 characters"],
            required: [true, "Enter country"],
        },
        book: {
            type: Types.ObjectId,
            ref: "Books",
            required: true,
        },
});

PublisherSchema.methods.toJSON = function(): any {
    return {
        id: this._id,
        name: this.name,
        country: this.country, 
        book: this.book,
    };
};

interface PublisherDocument extends Document {
    name: string;
    country: string; 
    book: Types.ObjectId;
    toJSON: () => any;      
}

export default model<PublisherDocument>("Publishers", PublisherSchema);
