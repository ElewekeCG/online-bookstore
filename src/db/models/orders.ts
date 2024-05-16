import { Schema, Types, connection } from "mongoose";

const db = connection.useDb('onlineBookStore');

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
        booksOrdered: [{
            bookId: { type: Types.ObjectId, ref: 'Book', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        }],
        orderStatus: {
            type: String,
            enum: ["pending", "shipped", "delivered"],
            default: "pending",
        }
}, {timestamps: true});

export default db.model<any>("Orders", OrderSchema);
