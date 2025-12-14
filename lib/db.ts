// Legacy db.ts - now exports the database factory
// This maintains backward compatibility with existing imports
export { db as default } from './database/factory';
export * from './database/types';

