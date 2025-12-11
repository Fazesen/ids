// createUser.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const localMongo = "mongodb://127.0.0.1:27017/ids";

async function createUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI || localMongo);
        console.log("Connected to MongoDB");

        const name = "Arghadeep"; // put your name
        const email = "arghadeep@example.com"; // YOUR email
        const plainPassword = "arghadeep123"; // YOUR password

        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        await user.save();
        console.log("User created:", email);

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        mongoose.connection.close();
    }
}

createUser();
