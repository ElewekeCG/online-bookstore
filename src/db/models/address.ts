import {Document, Schema, model} from "mongoose";

const AddressSchema = new Schema({
    street: {
        type: String,
        maxlength: [30, "province cannot exceed 30 characters"],
        required: true,
    },
    city: {
        type: String,
        required: true,
        minlength: [3, "city cannot be less than 3 characters"],
        maxlength: [20, "city cannot exceed 20 characters"],
    },
    postCode: {
        type: String,
        maxlength: [6, "postcode cannot exceed 6 characters"],
        required: [true, "please enter postcode"],
    },
    province: {
        type: String,
        maxlength: [30, "province cannot exceed 30 characters"],
        required: true,
    },
    country: {
        type: String,
        maxlength: 30,
        required: true,
    },
});

AddressSchema.methods.toJSON = function(): any {
    return {
        street: this.street,
        city: this.city,
        postCode: this.postCode,
        province: this.province,
        country: this.country,
    };
};

interface AddressDocument extends Document {
    street: string;
    city: string;
    postCode: string;
    province: string;
    country: string; 
    toJSON: () => any;      
}

export default model<AddressDocument>("Addresses", AddressSchema);
