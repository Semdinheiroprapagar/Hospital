// Create admin user in Supabase
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import path from 'path';

// Load .env.local
config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function createAdminUser() {
    console.log('👤 Creating admin user in Supabase...\n');

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials!');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Check if admin user already exists
        const { data: existingUser } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', 'admin')
            .single();

        if (existingUser) {
            console.log('⚠️  Admin user already exists!');
            console.log('   Username: admin');
            console.log('\n💡 Use the password you configured in .env.local');
            return;
        }

        // Create new admin user
        const password = 'admin123'; // Default password for testing
        const passwordHash = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('admin_users')
            .insert({
                username: 'admin',
                password_hash: passwordHash,
            })
            .select()
            .single();

        if (error) {
            console.error('❌ Error creating admin user:', error.message);
            process.exit(1);
        }

        console.log('✅ Admin user created successfully!');
        console.log('\n📋 Login credentials:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('\n🔐 IMPORTANTE: Mude a senha após o primeiro login!');
        console.log('\n🌐 Acesse: http://localhost:3000/admin/login');

    } catch (error: any) {
        console.error('❌ Unexpected error:', error.message);
        process.exit(1);
    }
}

createAdminUser();
