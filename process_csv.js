const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const { translate } = require('@vitalets/google-translate-api');

function parseImages(imagesStr) {
  if (!imagesStr) return '{}';
  const urls = imagesStr.split(',').map(u => u.trim());
  return '{' + urls.map(u => `"${u}"`).join(',') + '}';
}

function parseFlavors(row) {
  let flavors = [];
  for (let i = 1; i <= 5; i++) {
    const attrName = row[`Nom de l’attribut ${i}`];
    const attrVal = row[`Valeur(s) de l’attribut ${i} `] || row[`Valeur(s) de l’attribut ${i}`];
    if (attrName && attrName.toUpperCase().includes('PARFUM') && attrVal) {
      flavors = flavors.concat(attrVal.split(',').map(s => s.trim()));
    }
  }
  if (flavors.length === 0) return '{}';
  return '{' + flavors.map(f => `"${f.replace(/"/g, '""')}"`).join(',') + '}';
}

async function doTranslate(text) {
  if (!text) return '';
  try {
    const res = await translate(text, { to: 'en' });
    return res.text;
  } catch (err) {
    return text;
  }
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  const results = [];
  console.log('Reading CSV...');
  
  await new Promise((resolve) => {
    fs.createReadStream('wc_product_nutrifitness.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve());
  });

  console.log(`Found ${results.length} rows.`);

  const mappedData = [];

  for (let i = 0; i < results.length; i++) {
    const row = results[i];
    console.log(`Processing ${i + 1}/${results.length}: ${row.Nom}`);

    let name = row.Nom || '';
    let descShort = row['Description courte'] || '';
    let descLong = row.Description || '';
    let category = row['Catégories'] || '';
    
    name = await doTranslate(name);
    descShort = await doTranslate(descShort);
    descLong = await doTranslate(descLong);
    category = await doTranslate(category);

    const price = row['Tarif promo'] || row['Tarif régulier'] || '0';
    const priceOrig = row['Tarif promo'] ? row['Tarif régulier'] : '';
    
    const stockQuantity = parseInt(row.Stock) || 0;
    const inStock = stockQuantity > 0 || row['En stock ?'] === '1' ? true : false;
    const isFeatured = row['Mis en avant ?'] === '1' ? true : false;

    mappedData.push({
      sku: row.UGS || `SKU-${row.ID}`,
      name: name,
      brand: row.Marques || '',
      slug: generateSlug(name || `product-${row.ID}`),
      description_short: descShort,
      description_long: descLong,
      category: category.split(',')[0]?.trim() || '',
      subcategory: '',
      price: parseFloat(price) || 0,
      price_original: parseFloat(priceOrig) || null,
      currency: 'CHF',
      weight_g: (parseFloat(row['Poids (kg)']) || 0) * 1000,
      flavors: parseFlavors(row),
      images: parseImages(row.Images),
      in_stock: inStock,
      stock_quantity: stockQuantity,
      is_featured: isFeatured,
      is_new: false,
      badge_text: '',
      badge_color: '#c8102e',
      rating: 0,
      review_count: 0,
      tags: '{}'
    });
  }

  console.log('Writing to output CSV...');

  const csvWriter = createObjectCsvWriter({
    path: 'supabase_products.csv',
    header: [
      { id: 'sku', title: 'sku' },
      { id: 'name', title: 'name' },
      { id: 'brand', title: 'brand' },
      { id: 'slug', title: 'slug' },
      { id: 'description_short', title: 'description_short' },
      { id: 'description_long', title: 'description_long' },
      { id: 'category', title: 'category' },
      { id: 'subcategory', title: 'subcategory' },
      { id: 'price', title: 'price' },
      { id: 'price_original', title: 'price_original' },
      { id: 'currency', title: 'currency' },
      { id: 'weight_g', title: 'weight_g' },
      { id: 'flavors', title: 'flavors' },
      { id: 'images', title: 'images' },
      { id: 'in_stock', title: 'in_stock' },
      { id: 'stock_quantity', title: 'stock_quantity' },
      { id: 'is_featured', title: 'is_featured' },
      { id: 'is_new', title: 'is_new' },
      { id: 'badge_text', title: 'badge_text' },
      { id: 'badge_color', title: 'badge_color' },
      { id: 'rating', title: 'rating' },
      { id: 'review_count', title: 'review_count' },
      { id: 'tags', title: 'tags' }
    ]
  });

  await csvWriter.writeRecords(mappedData);
  console.log('Done! Generated supabase_products.csv');
}

main().catch(console.error);
