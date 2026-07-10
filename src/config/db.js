const { DATABASE_URL } = require("./env");
const { PrismaClient } = require("../generated/prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const adapter = new PrismaMariaDb(DATABASE_URL);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
