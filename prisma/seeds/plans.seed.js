const prisma = require("../../src/config/db");

async function seedPlans() {
  await prisma.plan.createMany({
    data: [
      {
        name: "Free",
        price: 0,
        maxProjects: 1,
      },
      {
        name: "Starter",
        price: 29900, // ฿299.00 in satang
        maxProjects: 5,
      },
      {
        name: "Pro",
        price: 79900, // ฿799.00 in satang
        maxProjects: 20,
      },
      {
        name: "Business",
        price: 199900, // ฿1,999.00 in satang
        maxProjects: null, // unlimited
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Plans seeded");
}

module.exports = { seedPlans };
