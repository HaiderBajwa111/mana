// delete-users.js - Script to delete all users from database
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteAllUsers() {
  console.log("🗑️ Starting user deletion...");

  try {
    // Get count of users before deletion
    const userCount = await prisma.user.count();
    console.log(`📊 Found ${userCount} users to delete`);

    if (userCount === 0) {
      console.log("✅ No users found in database");
      return;
    }

    // Delete all users
    console.log("🚨 Deleting all users...");
    const deleteResult = await prisma.user.deleteMany({});

    console.log(`✅ Successfully deleted ${deleteResult.count} users from database`);
    console.log("🎉 User deletion completed!");

  } catch (error) {
    console.error("❌ Error during user deletion:", error);
    throw error;
  }
}

deleteAllUsers()
  .catch((e) => {
    console.error("❌ Fatal error during user deletion:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 