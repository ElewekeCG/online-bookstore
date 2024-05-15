// importing pre existing classes for schema creation from mongoose
import {Document, Schema, connection} from "mongoose";

const db = connection.useDb('onlineBookStore');

// creating an address schema as an instance of the pre defined schema class in mongoose
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

// converting the schema fields to JSON so thet the application can return JSON to the client
AddressSchema.methods.toJSON = function(): any {
    return {
        street: this.street,
        city: this.city,
        postCode: this.postCode,
        province: this.province,
        country: this.country,
    };
};

/*this is an optional step but it involves 
creating an object interface that tell typescript the
data types of each schema item
*/ 
interface AddressDocument extends Document {
    street: string;
    city: string;
    postCode: string;
    province: string;
    country: string; 
    toJSON: () => any;      
}

// exporting the database model for use in various parts of the program
export default db.model<AddressDocument>("Addresses", AddressSchema);
