// Update admin user credentials in Supabase
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import path from 'path';

// Load .env.local
config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function updateAdminUser() {
    console.log('🔐 Updating admin user credentials...\n');

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials!');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const newUsername = 'MGS';
        const newPassword = '@Tecnologiaembiomodelos180299';

        // Hash the new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Check if admin user exists
        const { data: existingUser } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', 'admin')
            .single();

        if (existingUser) {
            // Update existing admin user
            const { error: updateError } = await supabase
                .from('admin_users')
                .update({
                    username: newUsername,
                    password_hash: passwordHash,
                })
                .eq('username', 'admin');

            if (updateError) {
                console.error('❌ Error updating admin user:', updateError.message);
                process.exit(1);
            }

            console.log('✅ Admin user updated successfully!');
        } else {
            // Create new admin user
            const { error: insertError } = await supabase
                .from('admin_users')
                .insert({
                    username: newUsername,
                    password_hash: passwordHash,
                });

            if (insertError) {
                console.error('❌ Error creating admin user:', insertError.message);
                process.exit(1);
            }

            console.log('✅ Admin user created successfully!');
        }

        console.log('\n📋 New login credentials:');
        console.log('   Username: MGS');
        console.log('   Password: @Tecnologiaembiomodelos180299');
        console.log('\n🌐 Acesse: http://localhost:3000/admin/login');
        console.log('\n✨ Pronto para usar!');

    } catch (error: any) {
        console.error('❌ Unexpected error:', error.message);
        process.exit(1);
    }
}

updateAdminUser();
