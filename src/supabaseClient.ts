import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://bqceygseuljeiuurlmhs.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxY2V5Z3NldWxqZWl1dXJsbWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMTM4OTIsImV4cCI6MjA5MjU4OTg5Mn0.MMoFB_vMZ3xANX5aNiNRa6COnn57H-t2rhGLZbxJpQ8";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
    
  );
  