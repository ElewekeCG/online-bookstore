import { Schema, Types, connection } from "mongoose";

const db = connection.useDb('onlineBookStore');

const BookOrderedSchema = new Schema({
    bookId: { type: Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  });

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
            type: [BookOrderedSchema],
        },
        orderStatus: {
            type: String,
            enum: ["pending", "shipped", "delivered"],
            default: "pending",
        }
}, {timestamps: true});

export default db.model<any>("Orders", OrderSchema);
