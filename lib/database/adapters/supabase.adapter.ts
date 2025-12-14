import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

export class SupabaseAdapter implements IDatabase {
    private supabase: SupabaseClient;

    constructor() {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials not found in environment variables');
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    // Banners
    async getBanners(): Promise<Banner[]> {
        const { data, error } = await this.supabase
            .from('banners')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    async getBanner(id: number): Promise<Banner | null> {
        const { data, error } = await this.supabase
            .from('banners')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
        return data || null;
    }

    async createBanner(insertData: BannerInsert): Promise<Banner> {
        const { data, error } = await this.supabase
            .from('banners')
            .insert(insertData)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updateBanner(id: number, updateData: BannerUpdate): Promise<Banner> {
        const { data, error } = await this.supabase
            .from('banners')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteBanner(id: number): Promise<void> {
        const { error } = await this.supabase
            .from('banners')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    // Posts
    async getPosts(): Promise<Post[]> {
        const { data, error } = await this.supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    async getPost(id: number): Promise<Post | null> {
        const { data, error } = await this.supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    }

    async createPost(insertData: PostInsert): Promise<Post> {
        const { data, error } = await this.supabase
            .from('posts')
            .insert(insertData)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updatePost(id: number, updateData: PostUpdate): Promise<Post> {
        const { data, error } = await this.supabase
            .from('posts')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deletePost(id: number): Promise<void> {
        const { error } = await this.supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    // Testimonials
    async getTestimonials(): Promise<Testimonial[]> {
        const { data, error } = await this.supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    async getTestimonial(id: number): Promise<Testimonial | null> {
        const { data, error } = await this.supabase
            .from('testimonials')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    }

    async createTestimonial(insertData: TestimonialInsert): Promise<Testimonial> {
        const { data, error } = await this.supabase
            .from('testimonials')
            .insert(insertData)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updateTestimonial(id: number, updateData: TestimonialUpdate): Promise<Testimonial> {
        const { data, error } = await this.supabase
            .from('testimonials')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteTestimonial(id: number): Promise<void> {
        const { error } = await this.supabase
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    // History Items
    async getHistoryItems(): Promise<HistoryItem[]> {
        const { data, error } = await this.supabase
            .from('history_items')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) throw error;
        return data || [];
    }

    async getHistoryItem(id: number): Promise<HistoryItem | null> {
        const { data, error } = await this.supabase
            .from('history_items')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    }

    async createHistoryItem(insertData: HistoryItemInsert): Promise<HistoryItem> {
        const { data, error } = await this.supabase
            .from('history_items')
            .insert(insertData)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updateHistoryItem(id: number, updateData: HistoryItemUpdate): Promise<HistoryItem> {
        const { data, error } = await this.supabase
            .from('history_items')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteHistoryItem(id: number): Promise<void> {
        const { error } = await this.supabase
            .from('history_items')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    // Contact Cards
    async getContactCards(): Promise<ContactCard[]> {
        const { data, error } = await this.supabase
            .from('contact_cards')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) throw error;
        return data || [];
    }

    async getContactCard(id: number): Promise<ContactCard | null> {
        const { data, error } = await this.supabase
            .from('contact_cards')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    }

    async createContactCard(insertData: ContactCardInsert): Promise<ContactCard> {
        const { data, error } = await this.supabase
            .from('contact_cards')
            .insert(insertData)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updateContactCard(id: number, updateData: ContactCardUpdate): Promise<ContactCard> {
        const { data, error } = await this.supabase
            .from('contact_cards')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteContactCard(id: number): Promise<void> {
        const { error } = await this.supabase
            .from('contact_cards')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    // Admin Users
    async getAdminUser(username: string): Promise<AdminUser | null> {
        const { data, error } = await this.supabase
            .from('admin_users')
            .select('*')
            .eq('username', username)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    }

    async createAdminUser(insertData: AdminUserInsert): Promise<AdminUser> {
        const { data, error } = await this.supabase
            .from('admin_users')
            .insert(insertData)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}
