import { db } from "./database";
import { users, categories, applications, statusLogs, targets } from "./schema";

export async function seedDatabase() {
  try {
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) return;

    await db.insert(users).values([
      {
        email: "cailum@gmail.com",
        password: "password123",
        createdAt: new Date().toISOString(),
      },
    ]);

    await db.insert(categories).values([
      { name: "Technology", colour: "#4caf7f", icon: "T", userId: 1 },
      { name: "Finance", colour: "#2196F3", icon: "F", userId: 1 },
      { name: "Consulting", colour: "#FF9800", icon: "C", userId: 1 },
      { name: "Graduate", colour: "#9C27B0", icon: "G", userId: 1 },
    ]);

    await db.insert(applications).values([
      {
        companyName: "Clearstream",
        roleName: "Junior Data Analyst",
        date: "2026-03-01",
        metric: 1,
        categoryId: 1,
        notes: "Applied via LinkedIn",
        userId: 1,
      },
      {
        companyName: "AIB",
        roleName: "Graduate Business Analyst",
        date: "2026-03-05",
        metric: 1,
        categoryId: 2,
        notes: "",
        userId: 1,
      },
      {
        companyName: "KPMG",
        roleName: "Business Consulting Graduate",
        date: "2026-03-10",
        metric: 1,
        categoryId: 3,
        notes: "Applied via college careers portal",
        userId: 1,
      },
      {
        companyName: "Deloitte",
        roleName: "Business Analyst Graduate",
        date: "2026-03-15",
        metric: 1,
        categoryId: 3,
        notes: "",
        userId: 1,
      },
    ]);

    await db.insert(statusLogs).values([
      { applicationId: 1, status: "Applied", changedAt: "2026-03-01" },
      { applicationId: 1, status: "Interviewing", changedAt: "2026-03-10" },
      { applicationId: 2, status: "Applied", changedAt: "2026-03-05" },
      { applicationId: 2, status: "Rejected", changedAt: "2026-03-15" },
      { applicationId: 3, status: "Applied", changedAt: "2026-03-10" },
      { applicationId: 4, status: "Applied", changedAt: "2026-03-15" },
      { applicationId: 4, status: "Interviewing", changedAt: "2026-03-20" },
    ]);

    await db.insert(targets).values([
      { type: "weekly", goal: 3, categoryId: null, userId: 1 },
      { type: "monthly", goal: 10, categoryId: null, userId: 1 },
    ]);

    console.log("seeded");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}