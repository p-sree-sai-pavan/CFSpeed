const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting migration of SolvedProblems to User.solvedProblemIds...');

    try {
        // efficient SQL update
        // Note: Implicitly relies on "User" and "SolvedProblem" table names being quoted correctly for Postgres if case sensitive
        // Prisma usually matches case but quotes them.
        const count = await prisma.$executeRaw`
      UPDATE "User" u
      SET "solvedProblemIds" = sub.ids
      FROM (
        SELECT "userId", array_agg("problemId") as ids
        FROM "SolvedProblem"
        GROUP BY "userId"
      ) sub
      WHERE u.id = sub."userId";
    `;

        console.log(`Migration Executed. Rows affected: ${count}`);
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
