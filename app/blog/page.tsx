import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — NutriFitness.ch',
  description: 'Expert articles on nutrition, supplements, training and fitness from the NutriFitness team.',
}

const CATEGORIES = [
  { name: 'Protein & Recovery',   slug: 'protein-recovery',  icon: '💪' },
  { name: 'Pre-Workout',          slug: 'pre-workout',        icon: '⚡' },
  { name: 'Weight Loss',          slug: 'weight-loss',        icon: '⚖️' },
  { name: 'Vitamins & Health',    slug: 'vitamins-health',    icon: '🌿' },
  { name: 'Muscle Building',      slug: 'muscle-building',    icon: '🏋️' },
  { name: 'Sports Nutrition',     slug: 'sports-nutrition',   icon: '🏃' },
  { name: 'Creatine',             slug: 'creatine',           icon: '🔥' },
  { name: 'Diet & Lifestyle',     slug: 'diet-lifestyle',     icon: '🥗' },
  { name: 'Mental Performance',   slug: 'mental-performance', icon: '🧠' },
  { name: 'Beginner\'s Guide',    slug: 'beginners-guide',    icon: '📚' },
]

export const BLOG_POSTS = [
  {
    slug: 'how-much-protein-do-you-need',
    title: 'How Much Protein Do You Really Need Per Day?',
    category: 'protein-recovery',
    categoryName: 'Protein & Recovery',
    date: '2025-05-10',
    readTime: '5 min',
    excerpt: 'Protein is the cornerstone of muscle growth and recovery. But how much is actually enough? We break down the science for athletes and everyday people.',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80',
    content: `
      <p>Protein is essential for building and repairing muscles, producing enzymes, and supporting immune function. But the "right" amount varies significantly depending on your goals.</p>
      <h2>General Recommendations</h2>
      <p>The WHO recommends <strong>0.83g per kg of bodyweight</strong> for the average sedentary adult. However, for athletes and active individuals, research consistently shows that higher intakes are needed:</p>
      <ul>
        <li><strong>Endurance athletes:</strong> 1.2–1.4g per kg</li>
        <li><strong>Strength/power athletes:</strong> 1.6–2.2g per kg</li>
        <li><strong>Those trying to lose fat while preserving muscle:</strong> up to 2.4g per kg</li>
      </ul>
      <h2>Best Protein Sources</h2>
      <p>Whey protein is the gold standard — it contains all essential amino acids and is rapidly absorbed post-workout. Our <a href="/products?category=Proteins">Protein collection</a> includes options for every goal and dietary preference, including vegan pea and rice protein blends.</p>
      <h2>When to Take Protein</h2>
      <p>Distribute protein evenly across 3–5 meals for optimal muscle protein synthesis. A post-workout shake within 2 hours of training is particularly effective for recovery.</p>
      <p><strong>Bottom line:</strong> Aim for 1.6–2.0g per kg of bodyweight if you train regularly. Supplement with a quality whey or plant protein to hit your targets consistently.</p>
    `,
    relatedProduct: { name: 'Ultimate Whey Bigman 2KG', slug: 'ultimate-whey-bigman-2kg' },
  },
  {
    slug: 'best-pre-workout-ingredients',
    title: 'The Best Pre-Workout Ingredients — What Actually Works?',
    category: 'pre-workout',
    categoryName: 'Pre-Workout',
    date: '2025-05-05',
    readTime: '6 min',
    excerpt: 'Not all pre-workouts are equal. We break down the scientifically proven ingredients that genuinely improve performance, energy and focus.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    content: `
      <p>The pre-workout supplement market is flooded with flashy labels and proprietary blends. Here's what the science actually supports:</p>
      <h2>Caffeine (200–400mg)</h2>
      <p>The most well-researched ergogenic aid. Caffeine increases alertness, reduces perceived exertion, and can improve both strength and endurance performance by 5–10%.</p>
      <h2>Beta-Alanine (3.2–6.4g)</h2>
      <p>Reduces muscle acidity during high-intensity exercise. The tingling sensation (paresthesia) is harmless and indicates it's working.</p>
      <h2>Citrulline Malate (6–8g)</h2>
      <p>Boosts nitric oxide, increasing blood flow to muscles. Improves reps to failure and reduces post-workout soreness.</p>
      <h2>Creatine Monohydrate (3–5g)</h2>
      <p>One of the most proven supplements for strength and power output. Highly recommended to stack with your pre-workout.</p>
      <h2>What to Avoid</h2>
      <p>Proprietary blends that hide doses, excessive stimulants, and unproven ingredients like "muscle matrix complexes." Always check the label.</p>
    `,
    relatedProduct: { name: 'Ghost Pre-Workout 645G', slug: 'ghost-pre-workout-645g-blue-raspberry' },
  },
  {
    slug: 'creatine-complete-guide',
    title: 'Creatine: The Complete Guide for 2025',
    category: 'creatine',
    categoryName: 'Creatine',
    date: '2025-04-28',
    readTime: '7 min',
    excerpt: 'Creatine is the most researched supplement in existence. Here is everything you need to know about dosing, timing, and which form to choose.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    content: `
      <p>Creatine monohydrate is one of the most studied, safest, and most effective supplements available. Here's your complete guide.</p>
      <h2>What Is Creatine?</h2>
      <p>Creatine is a naturally occurring compound found in muscle cells. It helps produce ATP (energy) during high-intensity, short-duration exercise like weightlifting and sprinting.</p>
      <h2>The Benefits</h2>
      <ul>
        <li>Increases strength and power output by ~10–15%</li>
        <li>Improves high-intensity exercise capacity</li>
        <li>Speeds up recovery between sets</li>
        <li>May improve brain function and reduce mental fatigue</li>
      </ul>
      <h2>How to Take It</h2>
      <p><strong>Loading phase (optional):</strong> 20g/day split into 4 doses for 5–7 days to saturate muscles faster.<br/>
      <strong>Maintenance:</strong> 3–5g per day indefinitely. Timing doesn't matter much — just take it daily.</p>
      <h2>Which Form?</h2>
      <p>Creatine monohydrate is the most researched and cheapest. Creapure® (the German-certified form) is the purest available. Skip HCL, ethyl ester, and other expensive variants — they offer no proven advantage.</p>
    `,
    relatedProduct: { name: 'PW Creapure Premium 250G', slug: 'pw-creapure-premium-250g' },
  },
  {
    slug: 'fat-loss-supplements-that-work',
    title: '5 Fat Loss Supplements That Are Actually Worth It',
    category: 'weight-loss',
    categoryName: 'Weight Loss',
    date: '2025-04-20',
    readTime: '6 min',
    excerpt: 'Weight loss supplements are full of hype. These five have real clinical evidence behind them. Here is what they do and how to use them properly.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    content: `
      <p>No supplement replaces a calorie deficit, but certain compounds can meaningfully support fat loss when used alongside proper diet and training.</p>
      <h2>1. Caffeine</h2>
      <p>Increases metabolic rate by 3–11% and improves fat oxidation during exercise. The thermogenic effect is well-documented.</p>
      <h2>2. Green Tea Extract (EGCG)</h2>
      <p>Synergizes with caffeine to increase fat burning. Most effective for abdominal fat reduction over 12+ weeks.</p>
      <h2>3. Protein Supplements</h2>
      <p>High protein intake preserves muscle during a deficit and increases satiety. Whey protein is particularly effective at reducing hunger hormones.</p>
      <h2>4. Conjugated Linoleic Acid (CLA)</h2>
      <p>Modest evidence for reducing body fat percentage over 6–12 months, particularly when combined with resistance training.</p>
      <h2>5. Glucomannan</h2>
      <p>A soluble fibre that expands in the stomach, significantly reducing appetite. Take 1g with a glass of water before each meal.</p>
      <p><strong>Important:</strong> These are tools, not shortcuts. A consistent calorie deficit through diet is still the primary driver of fat loss.</p>
    `,
    relatedProduct: { name: 'ZMA 90 Caps – Marvelous', slug: 'zma-90-caps' },
  },
  {
    slug: 'muscle-building-beginners',
    title: 'Muscle Building 101: The Beginner\'s Roadmap',
    category: 'muscle-building',
    categoryName: 'Muscle Building',
    date: '2025-04-15',
    readTime: '8 min',
    excerpt: 'Just starting your muscle-building journey? This beginner-friendly guide covers training, nutrition, sleep, and supplements in one clear roadmap.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80',
    content: `
      <p>Building muscle efficiently comes down to three pillars: progressive training, adequate nutrition, and sufficient recovery.</p>
      <h2>Training Fundamentals</h2>
      <p>Focus on compound movements: squat, deadlift, bench press, overhead press, and rows. Aim for <strong>3–4 sessions per week</strong>, progressively adding weight or reps each session.</p>
      <h2>Nutrition for Growth</h2>
      <p>Eat in a slight calorie surplus (200–400 calories above maintenance). Prioritize protein (1.6–2.2g/kg). Don't fear carbohydrates — they fuel your training.</p>
      <h2>The Role of Supplements</h2>
      <p>Beginners gain muscle rapidly without supplements. However, protein powder is convenient for hitting protein targets, and creatine provides a meaningful strength boost from day one.</p>
      <h2>Recovery</h2>
      <p>Muscle is built during rest, not during training. Aim for 7–9 hours of sleep. Avoid training the same muscle group two days in a row.</p>
      <h2>Realistic Expectations</h2>
      <p>Natural beginners can expect 0.5–1kg of lean muscle per month in the first year. Focus on consistency over 12+ months, not quick fixes.</p>
    `,
    relatedProduct: { name: 'Ultimate Whey Bigman 2KG', slug: 'ultimate-whey-bigman-2kg' },
  },
  {
    slug: 'vitamins-every-athlete-needs',
    title: '6 Vitamins & Minerals Every Athlete Needs',
    category: 'vitamins-health',
    categoryName: 'Vitamins & Health',
    date: '2025-04-10',
    readTime: '5 min',
    excerpt: 'Athletes place higher demands on their bodies and often have micronutrient deficiencies they are unaware of. Here are the key ones to prioritize.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    content: `
      <p>Intense training increases the demand for certain micronutrients. Deficiencies can impair performance, recovery, and immune function.</p>
      <h2>1. Vitamin D3</h2>
      <p>Crucial for bone health, testosterone production, and immune function. Most Europeans are deficient, especially in winter. Supplement 2000–4000 IU daily.</p>
      <h2>2. Magnesium</h2>
      <p>Involved in over 300 enzymatic reactions. Athletes lose magnesium through sweat. Supports sleep quality, muscle function, and stress recovery.</p>
      <h2>3. Zinc</h2>
      <p>Essential for testosterone production, immune health, and protein synthesis. Often depleted in endurance athletes.</p>
      <h2>4. Vitamin C</h2>
      <p>Reduces exercise-induced oxidative stress and supports immune function during heavy training periods.</p>
      <h2>5. Omega-3 (EPA/DHA)</h2>
      <p>Reduces inflammation, supports joint health, and may improve muscle protein synthesis. Aim for 2–4g of EPA+DHA daily.</p>
      <h2>6. Iron</h2>
      <p>Critical for oxygen transport. Female athletes and endurance athletes are particularly at risk for deficiency. Get blood levels tested annually.</p>
    `,
    relatedProduct: { name: 'Calcium 120 Tabs', slug: 'calcium-120-tabs' },
  },
  {
    slug: 'post-workout-nutrition-guide',
    title: 'Post-Workout Nutrition: What to Eat for Maximum Recovery',
    category: 'sports-nutrition',
    categoryName: 'Sports Nutrition',
    date: '2025-04-02',
    readTime: '5 min',
    excerpt: 'What you eat after training is critical for recovery, muscle growth, and performance in your next session. Here is the optimal post-workout strategy.',
    image: 'https://images.unsplash.com/photo-1556040220-4096d522378d?w=600&q=80',
    content: `
      <p>The post-workout window is when your muscles are most receptive to nutrients. Getting this right accelerates recovery and adaptation.</p>
      <h2>Protein First</h2>
      <p>Consume 25–40g of fast-digesting protein within 2 hours of training. Whey protein is ideal — it's rapidly absorbed and rich in leucine, the key trigger for muscle protein synthesis.</p>
      <h2>Carbohydrates for Glycogen</h2>
      <p>Replenish muscle glycogen with 0.5–1g of carbohydrate per kg of bodyweight. Good options: rice, oats, fruit, or a carbohydrate supplement.</p>
      <h2>Don't Fear Fats</h2>
      <p>While fats slow absorption slightly, they don't negate the benefits of post-workout nutrition. Eat a balanced meal within 1–2 hours.</p>
      <h2>Hydration</h2>
      <p>Rehydrate with 500ml–1L of water post-training. Electrolytes (sodium, potassium, magnesium) are important after long or intense sessions.</p>
      <h2>Sample Post-Workout Meal</h2>
      <ul>
        <li>Whey protein shake (30g protein)</li>
        <li>Banana or 2 rice cakes</li>
        <li>Followed by a balanced meal 1–2 hours later</li>
      </ul>
    `,
    relatedProduct: { name: 'ABE Drink Blue Lagoon', slug: 'abe-drink-blue-lagoon' },
  },
  {
    slug: 'intermittent-fasting-for-athletes',
    title: 'Intermittent Fasting for Athletes: Benefits and Drawbacks',
    category: 'diet-lifestyle',
    categoryName: 'Diet & Lifestyle',
    date: '2025-03-25',
    readTime: '6 min',
    excerpt: 'Intermittent fasting is popular for weight management, but is it compatible with athletic performance? We examine the evidence for active individuals.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    content: `
      <p>Intermittent fasting (IF) has gained significant attention for weight management. But for athletes, the picture is more nuanced.</p>
      <h2>Common IF Protocols</h2>
      <ul>
        <li><strong>16:8</strong> — 16 hours fasting, 8 hours eating window</li>
        <li><strong>5:2</strong> — 5 normal days, 2 days of very low calories</li>
        <li><strong>OMAD</strong> — One meal a day (not recommended for athletes)</li>
      </ul>
      <h2>Potential Benefits</h2>
      <p>IF can simplify calorie control, improve insulin sensitivity, and support fat loss without muscle loss when protein intake is adequate.</p>
      <h2>Drawbacks for Athletes</h2>
      <p>Training fasted can reduce performance in high-intensity exercise. It's harder to consume sufficient protein and carbohydrates in a compressed eating window. Recovery may be compromised.</p>
      <h2>The Verdict</h2>
      <p>IF can work for recreational athletes focused on fat loss. For those prioritizing performance and muscle gain, a conventional 3–5 meal approach is generally superior. Always ensure you hit your protein targets regardless of the eating pattern you choose.</p>
    `,
    relatedProduct: { name: 'Protéine Vegan RIZ BRUN BIO 500G', slug: 'proteine-vegan-riz-brun-bio-500g' },
  },
  {
    slug: 'ashwagandha-benefits-athletes',
    title: 'Ashwagandha: The Adaptogen That Boosts Performance',
    category: 'mental-performance',
    categoryName: 'Mental Performance',
    date: '2025-03-18',
    readTime: '5 min',
    excerpt: 'Ashwagandha is one of the few herbal supplements with solid clinical evidence. It reduces cortisol, improves strength, and enhances recovery. Here\'s what you need to know.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    content: `
      <p>Ashwagandha (Withania somnifera) is an ancient Ayurvedic herb that has gained significant scientific support for its performance-enhancing properties.</p>
      <h2>Proven Benefits</h2>
      <ul>
        <li><strong>Reduces cortisol</strong> by up to 30% in clinical trials</li>
        <li><strong>Improves strength</strong> — studies show 10–15% greater gains vs placebo in resistance training</li>
        <li><strong>Better VO2 max</strong> — meaningful improvements in endurance capacity</li>
        <li><strong>Enhanced sleep quality</strong> — critical for recovery</li>
        <li><strong>Reduced anxiety</strong> — well-documented anxiolytic effect</li>
      </ul>
      <h2>Dosage</h2>
      <p>300–600mg of KSM-66® or Sensoril® extract daily. Take with food, ideally in the evening for sleep benefits. Effects build over 4–8 weeks of consistent use.</p>
      <h2>Is It Safe?</h2>
      <p>Well-tolerated at standard doses. Avoid during pregnancy. Very rare cases of liver issues at very high doses have been reported.</p>
    `,
    relatedProduct: { name: 'Ashwagandha 60 Caps', slug: 'ashwagandha-60-caps' },
  },
  {
    slug: 'supplement-guide-for-beginners',
    title: 'The Only Supplement Guide a Beginner Will Ever Need',
    category: 'beginners-guide',
    categoryName: "Beginner's Guide",
    date: '2025-03-10',
    readTime: '9 min',
    excerpt: 'Starting with supplements can be overwhelming. This beginner guide cuts through the noise and tells you exactly what to take, in what order, and why.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    content: `
      <p>The supplement industry generates billions in revenue — much of it from products that don't work. Here's a no-nonsense beginner's guide to what actually matters.</p>
      <h2>The Foundation (Start Here)</h2>
      <p>Before any supplements, your diet, training, and sleep must be in order. Supplements supplement a good lifestyle — they don't replace it.</p>
      <h2>Tier 1: Evidence-Based Essentials</h2>
      <ul>
        <li><strong>Creatine monohydrate (3–5g/day)</strong> — Most studied supplement. Safe, effective, affordable.</li>
        <li><strong>Protein powder (as needed)</strong> — Convenient way to hit protein targets. Not magic, just food.</li>
        <li><strong>Vitamin D3 + K2 (2000–4000 IU/day)</strong> — Most people are deficient. Critical for bones, hormones, immunity.</li>
      </ul>
      <h2>Tier 2: Useful But Not Essential</h2>
      <ul>
        <li>Omega-3 (fish oil) — Anti-inflammatory, joint health</li>
        <li>Magnesium — Sleep quality, muscle recovery</li>
        <li>Caffeine — Performance booster</li>
      </ul>
      <h2>Skip These</h2>
      <p>BCAAs (redundant if protein is adequate), testosterone boosters, fat burners, "muscle matrix" blends, and anything claiming extreme results.</p>
      <h2>Order of Priority</h2>
      <p>1. Dial in your diet → 2. Train consistently → 3. Sleep 7–9h → 4. Add creatine → 5. Use protein powder if needed → 6. Add vitamins</p>
    `,
    relatedProduct: { name: 'PW Creapure Premium 250G', slug: 'pw-creapure-premium-250g' },
  },
]

export default function BlogPage() {
  const featured = BLOG_POSTS[0]
  const rest = BLOG_POSTS.slice(1)

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#111] text-white py-12 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-xs font-bold tracking-[4px] text-gray-400 uppercase mb-3">Knowledge Hub</div>
          <h1 className="font-display text-5xl sm:text-6xl font-black tracking-wide">THE NUTRIFIT <span className="text-[#c8102e]">BLOG</span></h1>
          <p className="text-gray-400 mt-3 text-sm max-w-xl">Expert articles on supplements, training, and nutrition — backed by science, written for athletes.</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-10">
        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link href="/blog" className="px-4 py-2 bg-[#c8102e] text-white text-xs font-black tracking-widest uppercase rounded-sm">All</Link>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/blog?category=${cat.slug}`}
              className="px-4 py-2 border-2 border-gray-200 hover:border-[#c8102e] hover:text-[#c8102e] text-xs font-black tracking-widest uppercase rounded-sm transition-all"
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`} className="group block mb-12 rounded-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div
              className="h-64 md:h-auto bg-cover bg-center"
              style={{ backgroundImage: `url(${featured.image})` }}
            />
            <div className="p-8 bg-gray-50 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#c8102e] text-white text-[10px] font-black px-2 py-1 tracking-widest uppercase">FEATURED</span>
                <span className="text-xs text-gray-400">{featured.categoryName}</span>
              </div>
              <h2 className="font-display text-3xl text-dark group-hover:text-[#c8102e] transition-colors mb-3 leading-tight">{featured.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>📅 {featured.date}</span>
                <span>⏱ {featured.readTime} read</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Grid of posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group border border-gray-100 rounded-sm overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${post.image})` }}
              />
              <div className="p-5 flex flex-col flex-1">
                <div className="text-[10px] font-black tracking-widest text-[#c8102e] uppercase mb-2">{post.categoryName}</div>
                <h3 className="font-display text-xl text-dark group-hover:text-[#c8102e] transition-colors mb-2 leading-tight flex-1">{post.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-100 pt-3">
                  <span>📅 {post.date}</span>
                  <span>⏱ {post.readTime} read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
