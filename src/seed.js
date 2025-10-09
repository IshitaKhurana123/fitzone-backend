const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Make sure to use the .env variables

// Import all the models
const Admin = require('./models/Admin');
const Member = require('./models/Member');
const Trainer = require('./models/Trainer');

// Get the MongoDB connection string from your .env file
const dbURI = process.env.MONGODB_URI;

// This is the main function that will run
const seedDatabase = async () => {
    try {
        // Connect to the database
        await mongoose.connect(dbURI);
        console.log('Database connected for seeding...');

        // --- Clear existing data ---
        // This prevents creating duplicate users if you run the script multiple times
        await Admin.deleteMany({});
        await Member.deleteMany({});
        await Trainer.deleteMany({});
        console.log('Cleared existing data.');

        // --- Create a secure password ---
        // We'll use the same simple password for all default users for easy testing
        const defaultPassword = 'password123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);
        console.log('Hashed default password.');

        // --- Create a default Admin ---
        await Admin.create({
            username: 'admin',
            password: hashedPassword
        });
        console.log('✅ Default Admin created (username: admin)');

        // --- Create a sample Trainer ---
        const trainer = await Trainer.create({
            name: 'John Doe',
            username: 'trainer_john',
            password: hashedPassword,
            specialization: 'Weightlifting',
            experience: 5,
            phone: '9876543210'
        });
        console.log('✅ Sample Trainer created (username: trainer_john)');

        // --- Create a sample Member ---
        await Member.create({
            name: 'Jane Smith',
            username: 'member_jane',
            password: hashedPassword,
            email: 'jane.smith@example.com',
            phone: '1234567890',
            plan: 'premium',
            assignedTrainer: trainer._id // Assign the trainer we just created
        });
        console.log('✅ Sample Member created (username: member_jane)');
        
        console.log('\nDatabase seeding completed successfully!');
        console.log(`All users have the default password: "${defaultPassword}"`);

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Disconnect from the database whether it succeeded or failed
        await mongoose.disconnect();
        console.log('Disconnected from database.');
    }
};

// Run the seeding function
seedDatabase();

