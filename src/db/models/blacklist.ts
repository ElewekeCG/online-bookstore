// importing pre existing classes for schema creation frm mongoose
import { Document, connection, Schema } from "mongoose";

// specifying the allowed types for the "kind" field
enum BlacklistKind {
  jti = "jti",
  refresh = "refresh",
  token = "token",
}

const db = connection.useDb('onlineBookStore');

// creating a blacklist schema as an instance of the pre defined schema class in mongoose
const BlacklistSchema = new Schema(
  {
    object: {
      type: String,
      required: [true, "Please provide an object"],
      unique: true,
    },
    kind: {
      type: String,
      enum: ["jti", "refresh", "token"],
      default: "jti",
      required: [true, "Please provide a kind"],
    },
  },
  { timestamps: true }
);

/*this is an optional step but it involves 
creating an object interface that tells typescript the
data types of each schema item
*/ 
interface BlacklistDocument extends Document {
  object: string;
  kind: BlacklistKind;
}

// exporting the schema model for use in various parts of the program
export default db.model<BlacklistDocument>("Blacklist", BlacklistSchema);
