import { Schema, Types, model } from "mongoose";
// import Cart from "./cart";

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
            type: String,
            minlength: 30,
            maxlength: 100,
            required: true
        },
        booksOrdered: {
            type: Array
        },
}, {timestamps: true});

// OrderSchema.methods.toJSON = function(): any {
//     return {
//         customerId: this.customerId, 
//         orderDate: this.orderDate,
//         subtotal: this.subtotal,
//         shippingAddress: this.shippingAddress,
//         booksOrdered: this.booksOrdered,
//     };
// };

// interface OrderDocument extends Document {
//     customerId: Types.ObjectId;
//     orderDate: string; 
//     subTotal: number;
//     shippingAddress: string;
//     booksOrdered: CartDocument;
//     toJSON: () => any;      
// }

export default model<any>("Orders", OrderSchema);
