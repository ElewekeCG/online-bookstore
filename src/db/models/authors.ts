// importing pre existing classes for schema creation from mongoose
import { Document, Schema, connection } from "mongoose";

const db = connection.useDb('onlineBookStore');

// creating authors schema as an instance of the pre defined schema class in mongoose
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
            maxlength: [200, "biography cannot exceed 200 characters"],
            required: true,
        },
});

// converting the schema fields to JSON so thet the application can return JSON to the client
AuthorSchema.methods.toJSON = function(): any {
    return {
        id: this._id,
        firstName: this.firstName, 
        lastName: this.lastName,
        biography: this.biography,
    };
};

/*this is an optional step but it involves 
creating an object interface that tells typescript the
data types of each schema item
*/ 
interface AuthorDocument extends Document {
    firstName: string;
    lastName: string; 
    biography: string;
    toJSON: () => any;      
}

// exporting the database model for use in various parts of the program
export default db.model<AuthorDocument>("Authors", AuthorSchema);
