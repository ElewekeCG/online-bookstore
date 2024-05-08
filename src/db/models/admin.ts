import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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


NewAdminSchema.pre("save", async function (next) {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  });
  
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


NewAdminSchema.methods.toJSON = function(): any {
    return {
        id: this._id,
        username: this.username, 
        password: this.password,
    };
};

NewAdminSchema.methods.comparePassword = function (
    enteredPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
  };

interface NewAdminDocument extends Document {
    username: string;
    password: string; 
    createJWT: (uuid: string) => string;
    comparePassword: (enteredPassword: string) => Promise<boolean>;
    toJSON: () => any;       
}

export default model<NewAdminDocument>("NewAdmin", NewAdminSchema);
