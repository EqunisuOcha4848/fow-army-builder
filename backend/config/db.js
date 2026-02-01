const mongose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongose.connect(proccess.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        mongose.connection.on('error', (err) => {
            console.error('MongoDB connection error: ${err}');
        });

        mongose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });

        process.on('SIGINT', async () => {
            await mongose.connection.close();
            console.log('MongoDB connection closed due to application termination');
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;