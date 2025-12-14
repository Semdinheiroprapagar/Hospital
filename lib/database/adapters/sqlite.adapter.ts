import Database from 'better-sqlite3';
import path from 'path';
import type {
    IDatabase,
    Banner,
    Post,
    Testimonial,
    HistoryItem,
    ContactCard,
    AdminUser,
    BannerInsert,
    PostInsert,
    TestimonialInsert,
    HistoryItemInsert,
    ContactCardInsert,
    AdminUserInsert,
    BannerUpdate,
    PostUpdate,
    TestimonialUpdate,
    HistoryItemUpdate,
    ContactCardUpdate,
} from '../types';

export class SQLiteAdapter implements IDatabase {
    private db: Database.Database;

    constructor() {
        const dbPath = path.join(process.cwd(), 'hospital.db');
        this.db = new Database(dbPath);
        this.initializeTables();
    }

    private initializeTables() {
        // Create tables if they don't exist
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_url TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        created_at INTEGER NOT NULL,
        published INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        content TEXT NOT NULL,
        role TEXT,
        created_at INTEGER NOT NULL,
        published INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS history_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS contact_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT,
        content TEXT,
        image_url TEXT,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);
    }

    private convertTimestamp(timestamp: number): Date {
        return new Date(timestamp);
    }

    // Banners
    async getBanners(): Promise<Banner[]> {
        const rows = this.db.prepare('SELECT * FROM banners ORDER BY order_index ASC').all() as any[];
        return rows.map(row => ({
            ...row,
            created_at: this.convertTimestamp(row.created_at),
        }));
    }

    async getBanner(id: number): Promise<Banner | null> {
        const row = this.db.prepare('SELECT * FROM banners WHERE id = ?').get(id) as any;
        if (!row) return null;
        return {
            ...row,
            created_at: this.convertTimestamp(row.created_at),
        };
    }

    async createBanner(data: BannerInsert): Promise<Banner> {
        const now = Date.now();
        const result = this.db.prepare(
            'INSERT INTO banners (image_url, order_index, created_at) VALUES (?, ?, ?)'
        ).run(data.image_url, data.order_index, now);

        return this.getBanner(result.lastInsertRowid as number) as Promise<Banner>;
    }

    async updateBanner(id: number, data: BannerUpdate): Promise<Banner> {
        this.db.prepare(
            'UPDATE banners SET image_url = COALESCE(?, image_url), order_index = COALESCE(?, order_index) WHERE id = ?'
        ).run(data.image_url, data.order_index, id);

        return this.getBanner(id) as Promise<Banner>;
    }

    async deleteBanner(id: number): Promise<void> {
        this.db.prepare('DELETE FROM banners WHERE id = ?').run(id);
    }

    // Posts
    async getPosts(): Promise<Post[]> {
        const rows = this.db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all() as any[];
        return rows.map(row => ({
            ...row,
            published: Boolean(row.published),
            created_at: this.convertTimestamp(row.created_at),
        }));
    }

    async getPost(id: number): Promise<Post | null> {
        const row = this.db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as any;
        if (!row) return null;
        return {
            ...row,
            published: Boolean(row.published),
            created_at: this.convertTimestamp(row.created_at),
        };
    }

    async createPost(data: PostInsert): Promise<Post> {
        const now = Date.now();
        const result = this.db.prepare(
            'INSERT INTO posts (title, content, image_url, published, created_at) VALUES (?, ?, ?, ?, ?)'
        ).run(data.title, data.content, data.image_url, data.published ? 1 : 0, now);

        return this.getPost(result.lastInsertRowid as number) as Promise<Post>;
    }

    async updatePost(id: number, data: PostUpdate): Promise<Post> {
        const updates: string[] = [];
        const values: any[] = [];

        if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
        if (data.content !== undefined) { updates.push('content = ?'); values.push(data.content); }
        if (data.image_url !== undefined) { updates.push('image_url = ?'); values.push(data.image_url); }
        if (data.published !== undefined) { updates.push('published = ?'); values.push(data.published ? 1 : 0); }

        if (updates.length > 0) {
            values.push(id);
            this.db.prepare(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`).run(...values);
        }

        return this.getPost(id) as Promise<Post>;
    }

    async deletePost(id: number): Promise<void> {
        this.db.prepare('DELETE FROM posts WHERE id = ?').run(id);
    }

    // Testimonials
    async getTestimonials(): Promise<Testimonial[]> {
        const rows = this.db.prepare('SELECT * FROM testimonials ORDER BY created_at DESC').all() as any[];
        return rows.map(row => ({
            ...row,
            published: Boolean(row.published),
            created_at: this.convertTimestamp(row.created_at),
        }));
    }

    async getTestimonial(id: number): Promise<Testimonial | null> {
        const row = this.db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id) as any;
        if (!row) return null;
        return {
            ...row,
            published: Boolean(row.published),
            created_at: this.convertTimestamp(row.created_at),
        };
    }

    async createTestimonial(data: TestimonialInsert): Promise<Testimonial> {
        const now = Date.now();
        const result = this.db.prepare(
            'INSERT INTO testimonials (name, content, role, published, created_at) VALUES (?, ?, ?, ?, ?)'
        ).run(data.name, data.content, data.role, data.published ? 1 : 0, now);

        return this.getTestimonial(result.lastInsertRowid as number) as Promise<Testimonial>;
    }

    async updateTestimonial(id: number, data: TestimonialUpdate): Promise<Testimonial> {
        const updates: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
        if (data.content !== undefined) { updates.push('content = ?'); values.push(data.content); }
        if (data.role !== undefined) { updates.push('role = ?'); values.push(data.role); }
        if (data.published !== undefined) { updates.push('published = ?'); values.push(data.published ? 1 : 0); }

        if (updates.length > 0) {
            values.push(id);
            this.db.prepare(`UPDATE testimonials SET ${updates.join(', ')} WHERE id = ?`).run(...values);
        }

        return this.getTestimonial(id) as Promise<Testimonial>;
    }

    async deleteTestimonial(id: number): Promise<void> {
        this.db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
    }

    // History Items
    async getHistoryItems(): Promise<HistoryItem[]> {
        const rows = this.db.prepare('SELECT * FROM history_items ORDER BY order_index ASC').all() as any[];
        return rows.map(row => ({
            ...row,
            created_at: this.convertTimestamp(row.created_at),
        }));
    }

    async getHistoryItem(id: number): Promise<HistoryItem | null> {
        const row = this.db.prepare('SELECT * FROM history_items WHERE id = ?').get(id) as any;
        if (!row) return null;
        return {
            ...row,
            created_at: this.convertTimestamp(row.created_at),
        };
    }

    async createHistoryItem(data: HistoryItemInsert): Promise<HistoryItem> {
        const now = Date.now();
        const result = this.db.prepare(
            'INSERT INTO history_items (title, content, image_url, order_index, created_at) VALUES (?, ?, ?, ?, ?)'
        ).run(data.title, data.content, data.image_url, data.order_index, now);

        return this.getHistoryItem(result.lastInsertRowid as number) as Promise<HistoryItem>;
    }

    async updateHistoryItem(id: number, data: HistoryItemUpdate): Promise<HistoryItem> {
        const updates: string[] = [];
        const values: any[] = [];

        if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
        if (data.content !== undefined) { updates.push('content = ?'); values.push(data.content); }
        if (data.image_url !== undefined) { updates.push('image_url = ?'); values.push(data.image_url); }
        if (data.order_index !== undefined) { updates.push('order_index = ?'); values.push(data.order_index); }

        if (updates.length > 0) {
            values.push(id);
            this.db.prepare(`UPDATE history_items SET ${updates.join(', ')} WHERE id = ?`).run(...values);
        }

        return this.getHistoryItem(id) as Promise<HistoryItem>;
    }

    async deleteHistoryItem(id: number): Promise<void> {
        this.db.prepare('DELETE FROM history_items WHERE id = ?').run(id);
    }

    // Contact Cards
    async getContactCards(): Promise<ContactCard[]> {
        const rows = this.db.prepare('SELECT * FROM contact_cards ORDER BY order_index ASC').all() as any[];
        return rows.map(row => ({
            ...row,
            created_at: this.convertTimestamp(row.created_at),
        }));
    }

    async getContactCard(id: number): Promise<ContactCard | null> {
        const row = this.db.prepare('SELECT * FROM contact_cards WHERE id = ?').get(id) as any;
        if (!row) return null;
        return {
            ...row,
            created_at: this.convertTimestamp(row.created_at),
        };
    }

    async createContactCard(data: ContactCardInsert): Promise<ContactCard> {
        const now = Date.now();
        const result = this.db.prepare(
            'INSERT INTO contact_cards (type, title, content, image_url, order_index, created_at) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(data.type, data.title, data.content, data.image_url, data.order_index, now);

        return this.getContactCard(result.lastInsertRowid as number) as Promise<ContactCard>;
    }

    async updateContactCard(id: number, data: ContactCardUpdate): Promise<ContactCard> {
        const updates: string[] = [];
        const values: any[] = [];

        if (data.type !== undefined) { updates.push('type = ?'); values.push(data.type); }
        if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
        if (data.content !== undefined) { updates.push('content = ?'); values.push(data.content); }
        if (data.image_url !== undefined) { updates.push('image_url = ?'); values.push(data.image_url); }
        if (data.order_index !== undefined) { updates.push('order_index = ?'); values.push(data.order_index); }

        if (updates.length > 0) {
            values.push(id);
            this.db.prepare(`UPDATE contact_cards SET ${updates.join(', ')} WHERE id = ?`).run(...values);
        }

        return this.getContactCard(id) as Promise<ContactCard>;
    }

    async deleteContactCard(id: number): Promise<void> {
        this.db.prepare('DELETE FROM contact_cards WHERE id = ?').run(id);
    }

    // Admin Users
    async getAdminUser(username: string): Promise<AdminUser | null> {
        const row = this.db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as any;
        if (!row) return null;
        return {
            ...row,
            created_at: this.convertTimestamp(row.created_at),
        };
    }

    async createAdminUser(data: AdminUserInsert): Promise<AdminUser> {
        const now = Date.now();
        const result = this.db.prepare(
            'INSERT INTO admin_users (username, password_hash, created_at) VALUES (?, ?, ?)'
        ).run(data.username, data.password_hash, now);

        return this.getAdminUser(data.username) as Promise<AdminUser>;
    }
}
