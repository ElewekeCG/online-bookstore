import {Schema, model, Types } from "mongoose";
// import CartItem  from "./cart-item"

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
    customerId: {type: Types.ObjectId, ref: "Customer"},
    items: [CartItemsSchema]
}, {timestamps: true});

// CartSchema.methods.toJSON = function(): any {
//     return {
//         customerId: this.customerId, 
//         items: this.items
//     };
// };

// export interface CartDocument extends Document {
//     customerId: Types.ObjectId;
//     items: CartItemsDocument[];
//     toJSON: () => any;      
// }

// interface CartItemsDocument extends Document {
//     bookId: Types.ObjectId;
//     quantity: number;
//     price: number;      
// }

export default model<any>("Cart", CartSchema);
