const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error, count } = await supabase.from('products').select('*', { count: 'exact' });
  if (error) console.error(error);
  console.log(`Total products: ${count}`);
  if (data && data.length > 0) {
    const featured = data.filter(p => p.is_featured).length;
    const inStock = data.filter(p => p.in_stock).length;
    console.log(`Featured: ${featured}, In Stock: ${inStock}`);
    console.log('Sample product:', data[0]);
  }
}
check();
