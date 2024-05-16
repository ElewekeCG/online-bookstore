import {Schema, connection, Types } from "mongoose";

const db = connection.useDb('onlineBookStore');
const CartSchema = new Schema ({
    customerId: {
        type: Types.ObjectId, 
        ref: "Customer",
        required: true
    },
    items: [{
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
    }]
}, {timestamps: true});

export default db.model<any>("Cart", CartSchema);
