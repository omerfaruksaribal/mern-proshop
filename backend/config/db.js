import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} If connection fails
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.REACT_APP_MONGO_URI);
    console.log(`mongodb connected host: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
