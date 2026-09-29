import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndzwqxzpqkekjryoqvrd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kendxeHpwcWtla2pyeW9xdnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NTUyNjYsImV4cCI6MjEwNjEzMTI2Nn0.Fuf1Uzs8EQmzLr9oMEAVYWVGjqbuLdB7ckONXLSbIXY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
