import mongoose, { connect } from "mongoose";

// mongoose.set("strictQuery", false);

export const connectToDatabase = (url: string): Promise<typeof mongoose> => {
  mongoose.set("strictQuery", false);
  return connect(url);
};
