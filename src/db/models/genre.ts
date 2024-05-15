import { Document, Schema, connection } from "mongoose";

const db = connection.useDb('onlineBookStore');

const GenreSchema = new Schema (
    {
        name: {
            type: String,
            required: true, 
        }
});

GenreSchema.methods.toJSON = function(): any {
    return {
        id: this._id,
        name: this.name, 
    };
};

interface GenreDocument extends Document {
    name: string; 
    toJSON: () => any;      
}

export default db.model<GenreDocument>("Genres", GenreSchema);
