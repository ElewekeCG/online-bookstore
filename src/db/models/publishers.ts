import { Document, Schema, model } from "mongoose";

const PublisherSchema = new Schema (
    {
        name: {
            type: String,
            required: [true, "enter name"],
            maxlength: [30, "name cannot exceed 30 characters"]
        },
        country: {
            type: String,
            maxlength: [30, "country cannot exceed 30 characters"],
            minlength: [3, "country cannot be less than 3 characters"],
            required: [true, "Enter country"],
        },
        contactInfo: {
            type: String,
            maxlength: [30, "contact info cannot exceed 30 characters"],
            minlength: [10, "country cannot be less than 10 characters"],
            required: true,
        },
});

PublisherSchema.methods.toJSON = function(): any {
    return {
        id: this._id,
        name: this.name,
        country: this.country, 
        contactInfo: this.contactInfo,
    };
};

interface PublisherDocument extends Document {
    name: string;
    country: string; 
    contactInfo: string;
    toJSON: () => any;      
}

export default model<PublisherDocument>("Publishers", PublisherSchema);
