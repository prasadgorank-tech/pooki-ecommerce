const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sd8d5e4a.us-east.insforge.app';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNjQwOTF9.pKCifHkkmUeNti_QppY8MD4D2X3TavO8_3XqEtZyFcY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test_otp@example.com',
    password: 'password123'
  });
  console.log("DATA:", JSON.stringify(data, null, 2));
  console.log("ERROR:", error);
}
test();
