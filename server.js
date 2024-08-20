const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB)
    .then(con => {
        // console.log(con.connections);
        console.log('DB connection successful');
    });


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on por ${port}...`);
});


process.on("unhandledRejection", err => {
    console.log(err.name, err.message);
    console.log("Unhandled rejection? 🧨 Shutting down...");
    server.close(() => {
        process.exit(1);
    })
})




