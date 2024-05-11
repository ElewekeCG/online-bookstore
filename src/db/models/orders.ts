import { Schema, Types, model } from "mongoose";

const OrderSchema = new Schema (
    {
        customerId: {
            type: Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        orderDate: {
            type: Date,
            default: Date.now
        },
        subTotal: {
            type: Number,
            required: true,
        },
        shippingAddress: {
            type: Types.ObjectId,
            ref: "Addresses",
            required: true
        },
        booksOrdered: {
            type: Array
        },
        orderStatus: {
            type: String,
            enum: ["pending", "shipped", "delivered"],
            default: "pending",
        }
}, {timestamps: true});

export default model<any>("Orders", OrderSchema);
