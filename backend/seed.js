const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const seedFinal = async () => {
    try {
        console.log("Connecting...");
        await mongoose.connect("mongodb://localhost:27017/ems");
        console.log("Connected.");

        await User.deleteMany({});
        console.log("Cleared users.");

        console.log("Hashing...");
        const adminPass = await bcrypt.hash("admin", 10);
        const empPass = await bcrypt.hash("employee", 10);

        console.log("Creating users...");
        await User.insertMany([
            {
                fullName: "Admin User",
                email: "admin@example.com",
                password: adminPass,
                role: "admin",
                status: "active"
            },
            {
                fullName: "Employee User",
                email: "employee@example.com",
                password: empPass,
                role: "employee",
                status: "active"
            }
        ]);
        console.log("Seeding complete.");
        console.log("Admin: admin@example.com / admin");
        console.log("Employee: employee@example.com / employee");

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedFinal();
