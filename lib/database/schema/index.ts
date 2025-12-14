import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { pgTable, serial, text as pgText, timestamp, integer as pgInteger, boolean } from 'drizzle-orm/pg-core';

// SQLite Schema
export const sqliteBanners = sqliteTable('banners', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    image_url: text('image_url').notNull(),
    order_index: integer('order_index').notNull(),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const sqlitePosts = sqliteTable('posts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    content: text('content').notNull(),
    image_url: text('image_url'),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    published: integer('published', { mode: 'boolean' }).notNull().default(true),
});

export const sqliteTestimonials = sqliteTable('testimonials', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    content: text('content').notNull(),
    role: text('role'),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    published: integer('published', { mode: 'boolean' }).notNull().default(true),
});

export const sqliteHistoryItems = sqliteTable('history_items', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    content: text('content').notNull(),
    image_url: text('image_url'),
    order_index: integer('order_index').notNull().default(0),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const sqliteContactCards = sqliteTable('contact_cards', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    type: text('type').notNull().$type<'image' | 'text'>(),
    title: text('title'),
    content: text('content'),
    image_url: text('image_url'),
    order_index: integer('order_index').notNull().default(0),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const sqliteAdminUsers = sqliteTable('admin_users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().unique(),
    password_hash: text('password_hash').notNull(),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// PostgreSQL (Supabase) Schema
export const pgBanners = pgTable('banners', {
    id: serial('id').primaryKey(),
    image_url: pgText('image_url').notNull(),
    order_index: pgInteger('order_index').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
});

export const pgPosts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: pgText('title').notNull(),
    content: pgText('content').notNull(),
    image_url: pgText('image_url'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    published: boolean('published').notNull().default(true),
});

export const pgTestimonials = pgTable('testimonials', {
    id: serial('id').primaryKey(),
    name: pgText('name').notNull(),
    content: pgText('content').notNull(),
    role: pgText('role'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    published: boolean('published').notNull().default(true),
});

export const pgHistoryItems = pgTable('history_items', {
    id: serial('id').primaryKey(),
    title: pgText('title').notNull(),
    content: pgText('content').notNull(),
    image_url: pgText('image_url'),
    order_index: pgInteger('order_index').notNull().default(0),
    created_at: timestamp('created_at').notNull().defaultNow(),
});

export const pgContactCards = pgTable('contact_cards', {
    id: serial('id').primaryKey(),
    type: pgText('type').notNull().$type<'image' | 'text'>(),
    title: pgText('title'),
    content: pgText('content'),
    image_url: pgText('image_url'),
    order_index: pgInteger('order_index').notNull().default(0),
    created_at: timestamp('created_at').notNull().defaultNow(),
});

export const pgAdminUsers = pgTable('admin_users', {
    id: serial('id').primaryKey(),
    username: pgText('username').notNull().unique(),
    password_hash: pgText('password_hash').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
});
