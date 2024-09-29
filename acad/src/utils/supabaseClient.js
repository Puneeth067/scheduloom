import {
    createClient
} from '@supabase/supabase-js';

const supabaseUrl = 'https://thjieceptultylypwasb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoamllY2VwdHVsdHlseXB3YXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3NjUxMzksImV4cCI6MjA0MjM0MTEzOX0.U2abnanUOLaZKrE9jWDxYH4M_9qg1lqxZ32vchoI7KQ'; // Replace with your Supabase API Key
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
