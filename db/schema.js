import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at").notNull(),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  colour: text("colour").notNull(),
  icon: text("icon").notNull(),
  userId: integer("user_id").notNull(),
});

export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  companyName: text("company_name").notNull(),
  roleName: text("role_name").notNull(),
  date: text("date").notNull(),
  metric: integer("metric").notNull().default(1),
  categoryId: integer("category_id").notNull(),
  notes: text("notes"),
  userId: integer("user_id").notNull(),
});

export const statusLogs = sqliteTable("status_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  applicationId: integer("application_id").notNull(),
  status: text("status").notNull(),
  changedAt: text("changed_at").notNull(),
});

export const targets = sqliteTable("targets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),
  goal: integer("goal").notNull(),
  categoryId: integer("category_id"),
  userId: integer("user_id").notNull(),
});