import mongoose, { connect } from "mongoose";

export const connectToDatabase = (url: string): Promise<typeof mongoose> => {
  mongoose.set("strictQuery", false);
  return connect(url);
};
