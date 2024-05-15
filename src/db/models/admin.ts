// importing pre existing classes for schema creation from mongoose
import { Document, Schema, connection } from "mongoose";
// bcrypt is used to hash passwords
import bcrypt from "bcrypt";
// jwt is used for authentication
import jwt from "jsonwebtoken";

const db = connection.useDb('onlineBookStore');

// creating an admin schema as an instance of the pre defined schema class in mongoose
const NewAdminSchema = new Schema (
    {
        username: {
            type: String,
            maxlength: 30,
            required: [true, "Enter first name"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: [8, "Your password should be at least 8 characters"],
            maxlength: 30
        },
});

// method to save the password as a hashed value and not a plain text
NewAdminSchema.pre("save", async function (next) {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  });
  
  // generating a jwt to be used for authentication
  NewAdminSchema.methods.createJWT = function (uuid: string): string {
    const token = jwt.sign(
      { userId: this._id, username: this.username},
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
        issuer: process.env.JWT_ISSUER,
        jwtid: uuid,
      }
    );
    return token;
  };

/*converting the schema fields to JSON so that the application
 can return results in JSON format to the client*/
NewAdminSchema.methods.toJSON = function(): any {
    return {
        id: this._id,
        username: this.username, 
        password: this.password,
    };
};

/*methos to ensure that the password that is entered is the same 
with the hashed password*/
NewAdminSchema.methods.comparePassword = function (
    enteredPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
  };

/*this is an optional step but it involves 
creating an object interface that tell typescript the
data types of each schema item
*/   
interface NewAdminDocument extends Document {
    username: string;
    password: string; 
    createJWT: (uuid: string) => string;
    comparePassword: (enteredPassword: string) => Promise<boolean>;
    toJSON: () => any;       
}

// exporting the database model for use in various parts of the program
export default db.model<NewAdminDocument>("NewAdmin", NewAdminSchema);
