// prisma/seed.ts
import { prisma } from '../src/lib/db.js';

async function main() {
  const welcomeTemplate = await prisma.notificationTemplate.upsert({
    where: { id: 'welcome-email-id' }, // Just a placeholder for the seed
    update: {},
    create: {
      name: 'Welcome Email',
      category: 'transactional',
      eventType: 'USER_WELCOME',
      emailSubject: 'Welcome to our platform, {{name}}!',
      emailBodyHtml: '<h1>Hi {{name}}!</h1><p>We are glad you joined.</p>',
      variables: ['name'],
      defaultChannel: 'EMAIL',
    },
  });

  console.log('Seeded template:', welcomeTemplate.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });