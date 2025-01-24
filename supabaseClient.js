import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://enypvmflkzqthazzwyoi.supabase.co'; // Replace with your Supabase project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVueXB2bWZsa3pxdGhhenp3eW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NDcxMTMsImV4cCI6MjA1MzMyMzExM30.DRb1dmCP2eqs_8X-8rGA4uvjIN3ZCQoqk29PJPoTSGM'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
