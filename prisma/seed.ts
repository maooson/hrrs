import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.reservation.deleteMany();

  console.log('Seeding...');

  const user1 = await prisma.user.create({
    data: {
      email: 'guest@aow.me',
      firstname: 'Ottimo',
      lastname: 'Go',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      role: 'USER',
      reservations: {
        create: {
          tableSize: 'LARGE',
          expectedArrivalTime: new Date(),
          status: 'COMPLETED',
        },
      },
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: 'admin@aow.me',
      firstname: 'Jason',
      lastname: 'Ma',
      role: 'ADMIN',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      reservations: {
        create: [
          {
            tableSize: 'SMALL',
            expectedArrivalTime: new Date(),
            status: 'PENDING',
          },
          {
            tableSize: 'MEDIUM',
            expectedArrivalTime: new Date(),
            status: 'CANCELED',
          },
          {
            tableSize: 'LARGE',
            expectedArrivalTime: new Date(),
            status: 'COMPLETED',
          },
        ],
      },
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
