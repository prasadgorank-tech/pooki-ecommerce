const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  { name: 'Heavyweight Oversized Tee (Black)', category: 'Tees', price: 1499, image_url: '/images/product1.png', stock: 100 },
  { name: 'Utility Cargo Pants (Charcoal)', category: 'Bottoms', price: 2999, image_url: '/images/product2.png', stock: 50 },
  { name: 'Minimal Slim Denim (Black Wash)', category: 'Bottoms', price: 3499, image_url: '/images/product3.png', stock: 75 },
  { name: 'Nylon Track Jacket (Obsidian)', category: 'Outerwear', price: 4599, image_url: '/images/hero.png', stock: 20 },
  { name: 'Relaxed Fit Hoodie (Ash Grey)', category: 'Fleece', price: 2499, image_url: '/images/product1.png', stock: 120 }
];

async function seed() {
  const { data, error } = await supabase.from('products').insert(products);
  if (error) console.error("Seeding error:", error);
  else console.log("Seeded database with demo products.");
}

seed();
