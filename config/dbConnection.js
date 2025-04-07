import mongoose from "mongoose";

const DBConnection = () => {
  mongoose
    .connect(process.env.MY_DATABASE_CONNECTION)
    .then(() => {
      console.log("Connected to database successfully");
    })
    .catch((error) => {
      console.log("Could not connect to the database!", error);
    });
};

export default DBConnection;
