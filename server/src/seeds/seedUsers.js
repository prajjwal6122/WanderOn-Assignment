import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/usersSchema.js";
import connectToDb from "../config/db.js";

dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to database
    await connectToDb();

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Sample users to seed
    const users = [
      {
        first_name: "John",
        last_name: "Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "Password@123",
        confirm_password: "Password@123",
        role: "user",
        isActive: true,
      },
      {
        first_name: "Jane",
        last_name: "Smith",
        username: "janesmith",
        email: "jane@example.com",
        password: "Password@123",
        confirm_password: "Password@123",
        role: "user",
        isActive: true,
      },
      {
        first_name: "Admin",
        last_name: "User",
        username: "adminuser",
        email: "admin@example.com",
        password: "Admin@123",
        confirm_password: "Admin@123",
        role: "admin",
        isActive: true,
      },
      {
        first_name: "Test",
        last_name: "User",
        username: "testuser",
        email: "test@example.com",
        password: "Test@123",
        confirm_password: "Test@123",
        role: "user",
        isActive: true,
      },
    ];

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Successfully seeded ${createdUsers.length} users`);

    // Display created users (without passwords)
    createdUsers.forEach((user) => {
      console.log(`- ${user.first_name} ${user.last_name} (${user.email})`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

seedUsers();
