import { Document, Schema, Types, connection } from "mongoose";

const db = connection.useDb('onlineBookStore');

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

export default db.model<InventoryDocument>("Inventories", InventorySchema);
