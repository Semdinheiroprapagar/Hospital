// Database entity types
export interface Banner {
    id: number;
    image_url: string;
    order_index: number;
    created_at: Date;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    image_url: string | null;
    created_at: Date;
    published: boolean;
}

export interface Testimonial {
    id: number;
    name: string;
    content: string;
    role: string | null;
    created_at: Date;
    published: boolean;
}

export interface HistoryItem {
    id: number;
    title: string;
    content: string;
    image_url: string | null;
    order_index: number;
    created_at: Date;
}

export interface ContactCard {
    id: number;
    type: 'image' | 'text';
    title: string | null;
    content: string | null;
    image_url: string | null;
    order_index: number;
    created_at: Date;
}

export interface AdminUser {
    id: number;
    username: string;
    password_hash: string;
    created_at: Date;
}

// Insert types (without id and created_at)
export type BannerInsert = Omit<Banner, 'id' | 'created_at'>;
export type PostInsert = Omit<Post, 'id' | 'created_at'>;
export type TestimonialInsert = Omit<Testimonial, 'id' | 'created_at'>;
export type HistoryItemInsert = Omit<HistoryItem, 'id' | 'created_at'>;
export type ContactCardInsert = Omit<ContactCard, 'id' | 'created_at'>;
export type AdminUserInsert = Omit<AdminUser, 'id' | 'created_at'>;

// Update types (partial without id and created_at)
export type BannerUpdate = Partial<Omit<Banner, 'id' | 'created_at'>>;
export type PostUpdate = Partial<Omit<Post, 'id' | 'created_at'>>;
export type TestimonialUpdate = Partial<Omit<Testimonial, 'id' | 'created_at'>>;
export type HistoryItemUpdate = Partial<Omit<HistoryItem, 'id' | 'created_at'>>;
export type ContactCardUpdate = Partial<Omit<ContactCard, 'id' | 'created_at'>>;

// Database interface - all adapters must implement this
export interface IDatabase {
    // Banners
    getBanners(): Promise<Banner[]>;
    getBanner(id: number): Promise<Banner | null>;
    createBanner(data: BannerInsert): Promise<Banner>;
    updateBanner(id: number, data: BannerUpdate): Promise<Banner>;
    deleteBanner(id: number): Promise<void>;

    // Posts
    getPosts(): Promise<Post[]>;
    getPost(id: number): Promise<Post | null>;
    createPost(data: PostInsert): Promise<Post>;
    updatePost(id: number, data: PostUpdate): Promise<Post>;
    deletePost(id: number): Promise<void>;

    // Testimonials
    getTestimonials(): Promise<Testimonial[]>;
    getTestimonial(id: number): Promise<Testimonial | null>;
    createTestimonial(data: TestimonialInsert): Promise<Testimonial>;
    updateTestimonial(id: number, data: TestimonialUpdate): Promise<Testimonial>;
    deleteTestimonial(id: number): Promise<void>;

    // History Items
    getHistoryItems(): Promise<HistoryItem[]>;
    getHistoryItem(id: number): Promise<HistoryItem | null>;
    createHistoryItem(data: HistoryItemInsert): Promise<HistoryItem>;
    updateHistoryItem(id: number, data: HistoryItemUpdate): Promise<HistoryItem>;
    deleteHistoryItem(id: number): Promise<void>;

    // Contact Cards
    getContactCards(): Promise<ContactCard[]>;
    getContactCard(id: number): Promise<ContactCard | null>;
    createContactCard(data: ContactCardInsert): Promise<ContactCard>;
    updateContactCard(id: number, data: ContactCardUpdate): Promise<ContactCard>;
    deleteContactCard(id: number): Promise<void>;

    // Admin Users
    getAdminUser(username: string): Promise<AdminUser | null>;
    createAdminUser(data: AdminUserInsert): Promise<AdminUser>;
}
