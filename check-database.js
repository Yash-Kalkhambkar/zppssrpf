import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n🔍 Checking Supabase Database...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  const tables = ['notices', 'highlights', 'timeline_events', 'app_settings', 'contact_inquiries', 'admissions'];
  
  console.log('\n📊 Database Status:\n');
  console.log('=' .repeat(80));

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: false });
      
      if (error) {
        console.log(`❌ ${table.padEnd(25)} | ERROR: ${error.message}`);
      } else {
        const recordCount = data?.length || 0;
        const status = recordCount > 0 ? '✅' : '⚠️';
        console.log(`${status} ${table.padEnd(25)} | ${recordCount} records`);
        
        // Show first record as sample if exists
        if (data && data.length > 0) {
          console.log(`   Sample: ${JSON.stringify(data[0]).substring(0, 100)}...`);
        }
      }
    } catch (err) {
      console.log(`❌ ${table.padEnd(25)} | EXCEPTION: ${err.message}`);
    }
  }

  console.log('=' .repeat(80));

  // Check RLS status
  console.log('\n🔒 Checking Row Level Security (RLS):\n');
  try {
    const { data: rlsData, error: rlsError } = await supabase.rpc('pg_catalog.has_table_privilege', {
      table: 'notices',
      privilege: 'SELECT'
    });
    
    console.log('RLS policies:', rlsError ? 'Cannot check' : 'Accessible');
  } catch (err) {
    console.log('RLS check skipped (requires custom function)');
  }

  // Test authentication
  console.log('\n🔑 Checking Authentication:\n');
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Current session:', session ? `✅ Logged in as ${session.user.email}` : '⚠️ Not logged in');

  // List users (if possible)
  console.log('\n👥 Checking Users (Admin only):\n');
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) {
    console.log('⚠️ Cannot list users (requires service role key, not anon key)');
  } else {
    console.log(`✅ Found ${users?.users?.length || 0} users`);
  }

  console.log('\n✅ Database check complete!\n');
}

checkDatabase().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
