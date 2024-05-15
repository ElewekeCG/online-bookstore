import {Schema, connection, Types } from "mongoose";

const db = connection.useDb('onlineBookStore');

const CartItemsSchema = new Schema ({
        bookId: {
            type: Types.ObjectId,
            ref: "Books",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: [1, "quantity cannot be less than 1"],
        },
        price: {
            type: Number,
            required: true
        }
    }, {timestamps: true});

const CartSchema = new Schema ({
    customerId: {
        type: Types.ObjectId, 
        ref: "Customer",
        required: true
    },
    items: [CartItemsSchema]
}, {timestamps: true});

export default db.model<any>("Cart", CartSchema);
