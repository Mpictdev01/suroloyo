const { createClient } = require('@supabase/supabase-js');

// Hardcoded for testing purposes (from .env.local)
const supabaseUrl = "https://yimfpcjouzemvvynwlgl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbWZwY2pvdXplbXZ2eW53bGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NjgwNzcsImV4cCI6MjA4NjQ0NDA3N30.WYF0qWrk5CmNNaROqn-c-NGeY0ejCJZkqMBTgsM_52s";

console.log("URL:", supabaseUrl);
console.log("Key Length:", supabaseAnonKey.length);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log("\n--- Testing Gallery ---");
    const galleryRes = await supabase.from("gallery").select("*").limit(1);
    if (galleryRes.error) {
        console.error("Gallery Error:", JSON.stringify(galleryRes.error, null, 2));
    } else {
        console.log("Gallery Success. Count:", galleryRes.data.length);
        if (galleryRes.data.length > 0) {
            console.log("Sample Data:", JSON.stringify(galleryRes.data[0], null, 2));
        }
    }

    console.log("\n--- Testing News ---");
    const newsRes = await supabase.from("news_articles").select("*").limit(1);
    if (newsRes.error) {
        console.error("News Error:", JSON.stringify(newsRes.error, null, 2));
    } else {
        console.log("News Success. Count:", newsRes.data.length);
    }
    
    console.log("\n--- Testing Users (Anon) ---");
    const usersRes = await supabase.from("users").select("count").limit(1);
    if (usersRes.error) {
        console.error("Users Error:", JSON.stringify(usersRes.error, null, 2));
    } else {
        console.log("Users Success (Anon). Data:", usersRes.data);
    }
}

test();
