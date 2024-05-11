import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document, Types, Schema, model } from "mongoose";

const CustomerSchema = new Schema (
    {
        firstName: {
            type: String,
            maxlength: [30, "Name cannot exceed 30 characters"],
            required: [true, "Enter firstname"],
        },
        lastName: {
            type: String,
            maxlength: [30, "Name cannot exceed 30 characters"],
            required: [true, "Enter lastname"],
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            trim: true,
            unique: true,
            match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
        },
        phoneNumber: {
            type: String,
            required: true,
            maxlength: 11,
            unique: true,
        },
        address: {
            type: Types.ObjectId,
            ref: "address",
            required: [true, "please enter address"],
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: [8, "Your password should be at least 8 characters"],
            maxlength: 30
        }
});


CustomerSchema.pre("save", async function (next) {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  });
  
  CustomerSchema.methods.createJWT = function (uuid: string): string {
    const token = jwt.sign(
      { userId: this._id, email: this.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
        issuer: process.env.JWT_ISSUER,
        jwtid: uuid,
      }
    );
    return token;
  };

CustomerSchema.methods.toJSON = function(): any {
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phoneNumber: this.phoneNumber,
        address: this.address,
        province: this.province,
        postCode: this.postCode,
        country: this.country,
    };
};

CustomerSchema.methods.comparePassword = function (
    enteredPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
  };

interface CustomerDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    province: string;
    postCode: string;
    country: string;
    createJWT: (uuid: string) => string;
    comparePassword: (enteredPassword: string) => Promise<boolean>;
    toJSON: () => any;      
}

export default model<CustomerDocument>("Customer", CustomerSchema);
