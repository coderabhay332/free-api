const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/API');
        const db = mongoose.connection.db;
        
        // Drop the problematic index
        await db.collection('users').dropIndex('subscribedApis.apiKey_1');
        console.log('Successfully dropped the problematic index');
        
        // Create new indexes
        await db.collection('users').createIndex({ apiKey: 1 }, { unique: true, sparse: true });
        console.log('Successfully created new apiKey index');
        
        await db.collection('users').createIndex({ 'subscribedApis.apiKey': 1 }, { unique: false, sparse: true });
        console.log('Successfully created new subscribedApis.apiKey index');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

fixIndexes(); 