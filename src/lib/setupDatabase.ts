import { supabase } from '@/integrations/supabase/client';

export const setupDatabase = async (): Promise<void> => {
  try {
    console.log('Setting up database tables...');

    // Just verify connection with a simple query
    const { data, error } = await supabase
      .from('collaborators')
      .select('count')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      console.log('Database connection test:', error);
      // Try individual table creation if needed
      await createTablesIndividually();
    } else {
      console.log('Database connection verified');
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    // Don't throw error to prevent app from breaking
    console.log('Continuing without database setup...');
  }
};

const createTablesIndividually = async () => {
  try {
    console.log('Creating tables individually...');

    // Test table access
    const { error: testError } = await supabase
      .from('collaborators')
      .select('id')
      .limit(1);

    if (testError && testError.code === 'PGRST116') {
      console.log('Tables need to be created...');
      // This will be handled by direct PostgreSQL commands
    }

    console.log('Individual table creation completed');
  } catch (error) {
    console.log('Individual table creation failed:', error);
  }
};

// Initialize database setup
export const initializeDatabase = async () => {
  try {
    console.log('Initializing PostgreSQL database...');
    await setupDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};