const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require("./../../models/tourModel")
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

// * Read JSON File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

// * Import Data Into Database
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("Data successfully imported");
    } catch (error) {
        console.log(error)
    }
    process.exit();
}

// * Delete Data From Database
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log("Data successfully deleted");
    } catch (error) {
        console.log(error)
    }
    process.exit();
}

if (process.argv[2] === "--import") {
    importData();
}
else if (process.argv[2] === "--delete") {
    {
        deleteData();
    }
}
