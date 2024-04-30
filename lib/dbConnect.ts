import mongoose from 'mongoose';

//NextJS is edge timed fraemwork which means the database connection is not always
//there and when the request is made, then the connection is established , but
//sometimes the connection can still be there if regular requests are made and
//hence we will just in case check whether connection is there or not

//here we are defining the type of connection
type ConnectionObject = {
  isConnected?: number;
};

//we used the type ConnectionObject here
const connection: ConnectionObject = {};

//main asychronous function where the connection will be established
async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    // Attempt to connect to the database
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {});

    connection.isConnected = db.connections[0].readyState;

    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);

    // Graceful exit in case of a connection error
    process.exit(1);
  }
}

//export the function reference
export default dbConnect;