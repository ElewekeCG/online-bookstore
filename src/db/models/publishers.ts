import { Document, Schema, Types, connection } from "mongoose";

const db = connection.useDb('onlineBookStore');

const PublisherSchema = new Schema (
    {
        name: {
            type: String,
            required: [true, "enter name"],
            maxlength: [30, "name cannot exceed 30 characters"]
        },
        address: {
            type: Types.ObjectId,
            ref: "Address",
            required: [true, "Enter country"],
        },
        contactInfo: {
            type: String,
            maxlength: [11, "contact info cannot exceed 11 characters"],
            minlength: [11, "country cannot be less than 11 characters"],
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

export default db.model<PublisherDocument>("Publishers", PublisherSchema);
