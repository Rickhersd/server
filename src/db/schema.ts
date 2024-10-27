import { relations } from 'drizzle-orm';
import {
	boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  code: text().notNull(),
});

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  login: text().notNull(),
  password: text().notNull(),
  created_at: timestamp().defaultNow(),
  role_id: integer().notNull().references(() => roles.id),
  updated_at: timestamp().defaultNow(),
	onboarded: boolean().default(false)
});

export const usersRoleRelations = relations(users, ({ one }) => ({
  role: one(roles),
}));

export const courses = pgTable(
  'courses',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    slug: varchar({ length: 191 }).notNull(),
		code: text().notNull(),
    summary: text('summary'),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
    authorId: varchar('authorId', { length: 191 }).notNull()
  },
  (post) => ({
    slugIndex: uniqueIndex('posts__slug__idx').on(post.slug),
  }),
);

export const tests = pgTable(
  'tests',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    module_id: varchar({ length: 191 }).notNull(),
  },
);

// export const students = pgTable(
//   'students',
//   {
//     id: integer().primaryKey().generatedAlwaysAsIdentity(),
	
//     module_id: varchar({ length: 191 }).notNull(),
//   },
// );


// Table tests {
//   id integer [primary key]
//   name text
//   module_id int
// }

// Table test_questions {
//   id integer [primary key]
//   setence text
//   correct_answer int
//   test_id int
// }

// Table modules {
//   id integer [primary key]
//   name text
//   description text
//   course_id int
// }

// Table section_content {
//   id integer [primary key]
//   name text
// }

// Table comments {
//   id integer [primary key]
// }


// export const users = pgTable('users', {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   name: text().notNull(),
//   password: text().notNull(),
// });

// export const users = pgTable('users', {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   name: text().notNull(),
//   password: text().notNull(),
// });

// export const users = pgTable('users', {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   name: text().notNull(),
//   password: text().notNull(),
// });

// export const users = pgTable('users', {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   name: text().notNull(),
//   password: text().notNull(),
// });
