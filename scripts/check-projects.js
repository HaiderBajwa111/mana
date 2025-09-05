const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProjects() {
  try {
    const submittedProjects = await prisma.project.findMany({
      where: {
        status: 'SUBMITTED',
        manufacturerId: null
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        fileUrl: true,
        creator: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    console.log('\n📋 SUBMITTED Projects (Available for Makers):');
    console.log('================================================');
    
    if (submittedProjects.length === 0) {
      console.log('No submitted projects found');
    } else {
      submittedProjects.forEach((project, idx) => {
        console.log(`\n${idx + 1}. ${project.title}`);
        console.log(`   ID: ${project.id}`);
        console.log(`   Creator: ${project.creator.firstName} ${project.creator.lastName}`);
        console.log(`   Status: ${project.status}`);
        console.log(`   Created: ${project.createdAt.toLocaleString()}`);
        console.log(`   File URL: ${project.fileUrl ? '✅ Has file' : '❌ No file'}`);
      });
    }

    console.log(`\n✨ Total submitted projects: ${submittedProjects.length}`);
    
    // Also check all projects
    const allProjects = await prisma.project.count();
    const draftProjects = await prisma.project.count({ where: { status: 'DRAFT' } });
    
    console.log(`\n📊 Project Statistics:`);
    console.log(`   Total projects: ${allProjects}`);
    console.log(`   Draft projects: ${draftProjects}`);
    console.log(`   Submitted projects: ${submittedProjects.length}`);
    
  } catch (error) {
    console.error('Error checking projects:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProjects();