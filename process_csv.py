import csv
import re
import sys

def parse_images(images_str):
    if not images_str:
        return '{}'
    urls = [u.strip() for u in images_str.split(',') if u.strip()]
    if not urls:
        return '{}'
    return '{' + ','.join([f'"{u}"' for u in urls]) + '}'

def parse_flavors(row):
    flavors = []
    for i in range(1, 6):
        attr_name = row.get(f'Nom de l’attribut {i}', '')
        attr_val = row.get(f'Valeur(s) de l’attribut {i} ', '') or row.get(f'Valeur(s) de l’attribut {i}', '')
        
        if attr_name and 'PARFUM' in attr_name.upper() and attr_val:
            flavors.extend([f.strip() for f in attr_val.split(',') if f.strip()])
            
    if not flavors:
        return '{}'
    return '{' + ','.join([f'"{f}"' for f in flavors]) + '}'

def generate_slug(name):
    # Basic slug generation
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = re.sub(r'(^-|-$)', '', slug)
    return slug

def process_csv(input_file, output_file):
    mapped_data = []
    
    with open(input_file, mode='r', encoding='utf-8-sig') as infile:
        reader = csv.DictReader(infile)
        rows = list(reader)
        print(f"Found {len(rows)} rows.")
        
        for idx, row in enumerate(rows):
            name = row.get('Nom', '')
            # If name is empty and it's a variation, try to use parent or just skip
            if not name and row.get('Type') == 'variation':
                name = f"Variation {row.get('ID')}"
                
            desc_short = row.get('Description courte', '')
            desc_long = row.get('Description', '')
            category = row.get('Catégories', '').split(',')[0].strip() if row.get('Catégories') else ''
            
            # Translate basic categories from French to English
            cat_translations = {
                'APRES SPORT': 'Post Workout',
                'AVANT SPORT': 'Pre Workout',
                'PENDANT SPORT': 'Intra Workout',
                'PERTE DE POIDS': 'Weight Loss',
                'PRISE DE MASSE': 'Mass Gainer',
                'PROTÉINES': 'Proteins',
                'VITAMINES - MINÉRAUX': 'Vitamins & Minerals',
                'ACCESSOIRES': 'Accessories',
                'SHAKERS': 'Shakers',
                'NOS BEST-SELLERS': 'Best Sellers'
            }
            category_en = cat_translations.get(category.upper(), category)

            price = row.get('Tarif promo') or row.get('Tarif régulier') or '0'
            price_orig = row.get('Tarif régulier') if row.get('Tarif promo') else ''
            
            stock_str = row.get('Stock', '0')
            try:
                stock_quantity = int(float(stock_str)) if stock_str else 0
            except ValueError:
                stock_quantity = 0
                
            in_stock = stock_quantity > 0 or row.get('En stock ?') == '1'
            is_featured = row.get('Mis en avant ?') == '1'
            
            weight_str = row.get('Poids (kg)', '0')
            try:
                weight_g = int(float(weight_str) * 1000) if weight_str else 0
            except ValueError:
                weight_g = 0

            mapped_data.append({
                'sku': row.get('UGS') or f"SKU-{row.get('ID')}",
                'name': name,
                'brand': row.get('Marques', ''),
                'slug': generate_slug(name or f"product-{row.get('ID')}"),
                'description_short': desc_short,
                'description_long': desc_long,
                'category': category_en,
                'subcategory': '',
                'price': price,
                'price_original': price_orig,
                'currency': 'CHF',
                'weight_g': weight_g,
                'flavors': parse_flavors(row),
                'images': parse_images(row.get('Images')),
                'in_stock': str(in_stock).lower(),
                'stock_quantity': stock_quantity,
                'is_featured': str(is_featured).lower(),
                'is_new': 'false',
                'badge_text': '',
                'badge_color': '#c8102e',
                'rating': 0,
                'review_count': 0,
                'tags': '{}'
            })
            
    if not mapped_data:
        print("No data parsed.")
        return

    # Write to new CSV
    fieldnames = [
        'sku', 'name', 'brand', 'slug', 'description_short', 'description_long',
        'category', 'subcategory', 'price', 'price_original', 'currency', 'weight_g',
        'flavors', 'images', 'in_stock', 'stock_quantity', 'is_featured', 'is_new',
        'badge_text', 'badge_color', 'rating', 'review_count', 'tags'
    ]
    
    with open(output_file, mode='w', encoding='utf-8', newline='') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        for data in mapped_data:
            writer.writerow(data)
            
    print(f"Successfully generated {output_file} with {len(mapped_data)} products!")

if __name__ == '__main__':
    process_csv('wc_product_nutrifitness.csv', 'supabase_products.csv')
