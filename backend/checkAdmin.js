import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/user.model.js';
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(async () => {
    let admin = await User.findOne({ email: 'qa@admin.com' });
    const newPass = 'adminPASS123';
    if (!admin) {
        console.log("No admin found, creating one...");
        const hashedPassword = await bcryptjs.hash(newPass, 10);
        admin = new User({
            username: 'qatestadmin',
            email: 'qa@admin.com',
            password: hashedPassword,
            isAdmin: true
        });
        await admin.save();
    } else {
        admin.password = await bcryptjs.hash(newPass, 10);
        if (!admin.isAdmin) admin.isAdmin = true;
        await admin.save();
    }
    console.log(`ADMIN_EMAIL: qa@admin.com`);
    console.log(`NEW_ADMIN_PASS: ${newPass}`);
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
