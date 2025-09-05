// delete-auth-users.js - Script to delete all users from Supabase auth
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Create Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function deleteAllSupabaseUsers() {
  console.log("🗑️ Starting Supabase auth user deletion...");

  try {
    // Get all users from Supabase auth
    console.log("📊 Fetching all users from Supabase auth...");
    const { data, error: listError } = await supabase.auth.admin.listUsers();
    const users = data?.users || [];
    
    console.log("🔍 Debug - API response:", { users, listError });
    
    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    if (!users || users.length === 0) {
      console.log("✅ No users found in Supabase auth");
      return;
    }

    console.log(`📊 Found ${users.length} users in Supabase auth`);

    // Delete users in batches to avoid rate limits
    const batchSize = 10;
    let deletedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      console.log(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(users.length / batchSize)}...`);

      for (const user of batch) {
        try {
          const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
          
          if (deleteError) {
            console.error(`❌ Failed to delete user ${user.id} (${user.email}):`, deleteError.message);
            failedCount++;
          } else {
            console.log(`✅ Deleted user: ${user.email} (${user.id})`);
            deletedCount++;
          }
        } catch (error) {
          console.error(`❌ Error deleting user ${user.id}:`, error.message);
          failedCount++;
        }
      }

      // Add a small delay between batches to avoid rate limits
      if (i + batchSize < users.length) {
        console.log("⏳ Waiting 1 second before next batch...");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log("\n🎉 Supabase auth user deletion completed!");
    console.log(`✅ Successfully deleted: ${deletedCount} users`);
    if (failedCount > 0) {
      console.log(`❌ Failed to delete: ${failedCount} users`);
    }

  } catch (error) {
    console.error("❌ Error during Supabase auth user deletion:", error);
    throw error;
  }
}

// Check if required environment variables are set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL environment variable is required");
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required");
  console.error("💡 Make sure you have the service role key in your .env.local file");
  process.exit(1);
}

deleteAllSupabaseUsers()
  .catch((e) => {
    console.error("❌ Fatal error during Supabase auth user deletion:", e);
    process.exit(1);
  }); 