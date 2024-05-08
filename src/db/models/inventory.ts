import { Document, Schema, Types, model } from "mongoose";

const InventorySchema = new Schema (
    {
        book: {
            type: Types.ObjectId,
            ref: "Books",
            required: true, 
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
});

InventorySchema.methods.toJSON = function(): any {
    return {
        book: this.book,
        quantity: this.quantity, 
    };
};

interface InventoryDocument extends Document {
    book: Types.ObjectId;
    quantity: number; 
    toJSON: () => any;      
}

export default model<InventoryDocument>("Inventories", InventorySchema);
