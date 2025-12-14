// Test script to verify database functionality
import { db } from './lib/database/factory';

async function testDatabase() {
    console.log('🧪 Testing Database Abstraction Layer...\n');

    try {
        // Test 1: Get all posts
        console.log('1️⃣ Testing getPosts()...');
        const posts = await db.getPosts();
        console.log(`✅ Found ${posts.length} posts`);

        // Test 2: Get all banners
        console.log('\n2️⃣ Testing getBanners()...');
        const banners = await db.getBanners();
        console.log(`✅ Found ${banners.length} banners`);

        // Test 3: Get all testimonials
        console.log('\n3️⃣ Testing getTestimonials()...');
        const testimonials = await db.getTestimonials();
        console.log(`✅ Found ${testimonials.length} testimonials`);

        // Test 4: Get all history items
        console.log('\n4️⃣ Testing getHistoryItems()...');
        const historyItems = await db.getHistoryItems();
        console.log(`✅ Found ${historyItems.length} history items`);

        // Test 5: Get all contact cards
        console.log('\n5️⃣ Testing getContactCards()...');
        const contactCards = await db.getContactCards();
        console.log(`✅ Found ${contactCards.length} contact cards`);

        console.log('\n✨ All database operations completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Posts: ${posts.length}`);
        console.log(`   Banners: ${banners.length}`);
        console.log(`   Testimonials: ${testimonials.length}`);
        console.log(`   History Items: ${historyItems.length}`);
        console.log(`   Contact Cards: ${contactCards.length}`);

    } catch (error) {
        console.error('\n❌ Error during testing:', error);
        process.exit(1);
    }
}

testDatabase();
