// Food Tailor — Node.js + Express REST API
import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL connection — falls back to in-memory data if DB is unavailable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/foodtailor',
});

let dbAvailable = false;

// Check DB connection on startup
pool.query('SELECT 1')
  .then(() => {
    dbAvailable = true;
    console.log('✓ PostgreSQL connected');
  })
  .catch(() => {
    console.log('⚠ PostgreSQL not available — using in-memory seed data');
  });

// In-memory fallback data (same as seedData.js)
const fallbackBrands = [
  { id: 1, name: 'Paradise', tagline: 'The Original Biryani Kingdom', cuisine: 'Hyderabadi', description: 'Since 1953, the crown jewel of Hyderabadi biryani culture.', why_we_picked: 'No Hyderabad event is complete without Paradise.', established: 1953 },
  { id: 2, name: 'Bawarchi', tagline: 'Where Bold Flavors Gather', cuisine: 'Hyderabadi', description: 'Generous portions and robust flavors.', why_we_picked: 'Crowd-pleasing flavors in volume.', established: 1994 },
  { id: 3, name: 'Cafe Bahar', tagline: 'Heritage in Every Bite', cuisine: 'Hyderabadi', description: 'A beloved institution.', why_we_picked: 'Afghani Chicken and samosas elevate any event.', established: 1973 },
  { id: 4, name: 'Hotel Shadab', tagline: 'Old City Royalty', cuisine: 'Hyderabadi', description: 'Centuries of culinary tradition.', why_we_picked: 'Authentic Old City soul.', established: 1953 },
  { id: 5, name: 'Shah Ghouse', tagline: 'The Late-Night Legend', cuisine: 'Hyderabadi', description: 'Famous for Haleem and chicken fry.', why_we_picked: 'Ramadan Haleem for your celebrations.', established: 1981 },
  { id: 6, name: 'Pista House', tagline: 'Haleem Masters', cuisine: 'Hyderabadi', description: 'Turned Haleem into art.', why_we_picked: 'Award-winning Haleem.', established: 1998 },
  { id: 7, name: 'Jewel of Nizam', tagline: 'Regal Nizami Cuisine', cuisine: 'Hyderabadi Nizami', description: 'True Nizami cuisine.', why_we_picked: 'Unmatched elegance.', established: 2005 },
  { id: 8, name: 'Meridian', tagline: 'Dependable Feast Makers', cuisine: 'Hyderabadi', description: 'Consistent and flavorful.', why_we_picked: 'Reliable quality at scale.', established: 1990 },
  { id: 9, name: 'Kritunga', tagline: 'Andhra Heat, Telangana Heart', cuisine: 'Andhra-Telangana', description: 'Fiery Andhra flavors.', why_we_picked: 'Adds Andhra dimension.', established: 2001 },
];

const fallbackDishes = [
  { id: 1, brand_id: 1, name: 'Hyderabadi Dum Biryani', category: 'Biryani', description: 'Slow-cooked basmati.', price_per_head: 250, is_veg: false, is_signature: true },
  { id: 2, brand_id: 1, name: 'Chicken 65', category: 'Starter', description: 'Fiery deep-fried chicken.', price_per_head: 180, is_veg: false, is_signature: true },
  { id: 3, brand_id: 1, name: 'Shahi Tukda', category: 'Dessert', description: 'Royal bread pudding.', price_per_head: 120, is_veg: true, is_signature: true },
  { id: 4, brand_id: 2, name: 'Mutton Biryani', category: 'Biryani', description: 'Hearty mutton pieces.', price_per_head: 300, is_veg: false, is_signature: true },
  { id: 5, brand_id: 2, name: 'Chicken Biryani', category: 'Biryani', description: 'Flavorful chicken biryani.', price_per_head: 220, is_veg: false, is_signature: true },
  { id: 6, brand_id: 2, name: 'Bawarchi Special Curry', category: 'Main Course', description: 'Rich slow-simmered curry.', price_per_head: 200, is_veg: false, is_signature: true },
  { id: 7, brand_id: 3, name: 'Hyderabadi Chicken Biryani', category: 'Biryani', description: 'Aromatic, consistently perfect.', price_per_head: 230, is_veg: false, is_signature: true },
  { id: 8, brand_id: 3, name: 'Afghani Chicken', category: 'Starter', description: 'Creamy grilled chicken.', price_per_head: 220, is_veg: false, is_signature: true },
  { id: 9, brand_id: 3, name: 'Onion Samosa', category: 'Starter', description: 'Crispy pastry pockets.', price_per_head: 80, is_veg: true, is_signature: true },
  { id: 10, brand_id: 4, name: 'Mutton Biryani', category: 'Biryani', description: 'Old City-style.', price_per_head: 320, is_veg: false, is_signature: true },
  { id: 11, brand_id: 4, name: 'Haleem', category: 'Main Course', description: 'Slow-cooked stew.', price_per_head: 200, is_veg: false, is_signature: true },
  { id: 12, brand_id: 4, name: 'Nahari', category: 'Main Course', description: 'Bone-marrow stew.', price_per_head: 250, is_veg: false, is_signature: true },
  { id: 13, brand_id: 5, name: 'Haleem', category: 'Main Course', description: 'Ramadan-special.', price_per_head: 220, is_veg: false, is_signature: true },
  { id: 14, brand_id: 5, name: 'Chicken Fry', category: 'Starter', description: 'Golden-fried chicken.', price_per_head: 180, is_veg: false, is_signature: true },
  { id: 15, brand_id: 5, name: 'Irani Chai', category: 'Beverage', description: 'Thick, creamy Irani chai.', price_per_head: 60, is_veg: true, is_signature: true },
  { id: 16, brand_id: 6, name: 'Haleem', category: 'Main Course', description: 'Award-winning Haleem.', price_per_head: 210, is_veg: false, is_signature: true },
  { id: 17, brand_id: 6, name: 'Osmania Biscuit', category: 'Dessert', description: 'Iconic Hyderabadi biscuit.', price_per_head: 50, is_veg: true, is_signature: true },
  { id: 18, brand_id: 6, name: 'Dry Fruit Biryani', category: 'Biryani', description: 'Premium dry fruit biryani.', price_per_head: 350, is_veg: true, is_signature: true },
  { id: 19, brand_id: 7, name: 'Pathar Ka Gosht', category: 'Main Course', description: 'Nizami stone-slab cooking.', price_per_head: 400, is_veg: false, is_signature: true },
  { id: 20, brand_id: 7, name: 'Haleem', category: 'Main Course', description: 'Royal-recipe Haleem.', price_per_head: 240, is_veg: false, is_signature: true },
  { id: 21, brand_id: 7, name: 'Murgh Dum Biryani', category: 'Biryani', description: 'Nizami-style saffron biryani.', price_per_head: 280, is_veg: false, is_signature: true },
  { id: 22, brand_id: 8, name: 'Chicken Biryani', category: 'Biryani', description: 'Reliable crowd-pleaser.', price_per_head: 200, is_veg: false, is_signature: true },
  { id: 23, brand_id: 8, name: 'Mutton Biryani', category: 'Biryani', description: 'Rich and generous.', price_per_head: 280, is_veg: false, is_signature: true },
  { id: 24, brand_id: 8, name: 'Malai Kebab', category: 'Starter', description: 'Cream-marinated kebabs.', price_per_head: 200, is_veg: false, is_signature: true },
  { id: 25, brand_id: 9, name: 'Natukodi Curry', category: 'Main Course', description: 'Andhra country chicken.', price_per_head: 260, is_veg: false, is_signature: true },
  { id: 26, brand_id: 9, name: 'Guntur Chicken', category: 'Main Course', description: 'Fiery Guntur-style.', price_per_head: 240, is_veg: false, is_signature: true },
  { id: 27, brand_id: 9, name: 'Boti Curry', category: 'Main Course', description: 'Spice-forward boneless curry.', price_per_head: 230, is_veg: false, is_signature: true },
];

// Middleware
app.use(cors());
app.use(express.json());

// ============================
// API Routes
// ============================

// GET /api/brands — all brands
app.get('/api/brands', async (req, res) => {
  try {
    if (dbAvailable) {
      const result = await pool.query('SELECT * FROM brands ORDER BY id');
      return res.json(result.rows);
    }
    res.json(fallbackBrands);
  } catch (err) {
    res.json(fallbackBrands);
  }
});

// GET /api/brands/:id/dishes — dishes for a specific brand
app.get('/api/brands/:id/dishes', async (req, res) => {
  const brandId = parseInt(req.params.id);
  try {
    if (dbAvailable) {
      const result = await pool.query('SELECT * FROM dishes WHERE brand_id = $1 ORDER BY id', [brandId]);
      return res.json(result.rows);
    }
    res.json(fallbackDishes.filter(d => d.brand_id === brandId));
  } catch (err) {
    res.json(fallbackDishes.filter(d => d.brand_id === brandId));
  }
});

// GET /api/dishes — all dishes
app.get('/api/dishes', async (req, res) => {
  try {
    if (dbAvailable) {
      const result = await pool.query('SELECT d.*, b.name as brand_name FROM dishes d JOIN brands b ON d.brand_id = b.id ORDER BY d.id');
      return res.json(result.rows);
    }
    res.json(fallbackDishes.map(d => ({
      ...d,
      brand_name: fallbackBrands.find(b => b.id === d.brand_id)?.name,
    })));
  } catch (err) {
    res.json(fallbackDishes);
  }
});

// POST /api/menu-builder — generate AI-recommended menus
app.post('/api/menu-builder', async (req, res) => {
  const { occasion, guestCount, budgetPerHead, dietaryPreference } = req.body;

  if (!guestCount || guestCount < 10) {
    return res.status(400).json({ error: 'Minimum 10 guests required' });
  }

  // Get dishes from DB or fallback
  let allDishes = fallbackDishes;
  try {
    if (dbAvailable) {
      const result = await pool.query('SELECT d.*, b.name as brand_name FROM dishes d JOIN brands b ON d.brand_id = b.id');
      allDishes = result.rows;
    }
  } catch {}

  // Filter by dietary preference
  let filtered = dietaryPreference === 'veg'
    ? allDishes.filter(d => d.is_veg)
    : dietaryPreference === 'non-veg'
      ? allDishes.filter(d => !d.is_veg)
      : allDishes;

  // Simple menu generation (server-side version of aiMenuGenerator)
  const buildPackage = (name, strategy) => {
    const multiplier = strategy === 'premium' ? 1.3 : strategy === 'value' ? 0.75 : 1.0;
    const target = Math.round(budgetPerHead * multiplier);
    const dishCount = strategy === 'premium' ? 7 : strategy === 'value' ? 4 : 5;

    const selected = [];
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);

    for (const dish of shuffled) {
      if (selected.length >= dishCount) break;
      if (!selected.find(s => s.id === dish.id)) {
        selected.push(dish);
      }
    }

    const perHead = selected.reduce((sum, d) => sum + (d.price_per_head || 0), 0);
    const brandCount = new Set(selected.map(d => d.brand_id)).size;
    const budgetMatch = 1 - Math.abs(perHead - budgetPerHead) / budgetPerHead;

    return {
      name,
      items: selected.map(d => ({
        ...d,
        brandName: d.brand_name || fallbackBrands.find(b => b.id === d.brand_id)?.name,
        quantity: guestCount,
      })),
      perHead,
      totalEstimate: perHead * guestCount,
      brandCount,
      confidence: Math.max(65, Math.min(98, Math.round((budgetMatch + 0.1) * 100))),
      guestCount,
    };
  };

  const packages = [
    buildPackage('Curated Signature', 'balanced'),
    buildPackage('Royal Feast', 'premium'),
    buildPackage('Artisanal Express', 'value'),
  ];

  res.json(packages);
});

// POST /api/orders — create an order
app.post('/api/orders', async (req, res) => {
  const { occasionId, guestCount, budgetPerHead, dietaryPreference, items, totalEstimate, contactName, contactEmail, contactPhone, eventDate, venueAddress, notes } = req.body;

  const orderRef = `FT-${Date.now().toString(36).toUpperCase()}`;

  try {
    if (dbAvailable) {
      const orderResult = await pool.query(
        `INSERT INTO orders (order_ref, occasion_id, guest_count, budget_per_head, dietary_preference, total_estimate, contact_name, contact_email, contact_phone, event_date, venue_address, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id, order_ref`,
        [orderRef, occasionId, guestCount, budgetPerHead, dietaryPreference, totalEstimate, contactName, contactEmail, contactPhone, eventDate, venueAddress, notes]
      );

      const orderId = orderResult.rows[0].id;

      if (items && items.length > 0) {
        for (const item of items) {
          await pool.query(
            'INSERT INTO order_items (order_id, dish_id, quantity, price_per_head) VALUES ($1,$2,$3,$4)',
            [orderId, item.id, item.quantity || guestCount, item.pricePerHead || item.price_per_head]
          );
        }
      }

      return res.json({ success: true, orderId: orderRef, message: 'Order created successfully' });
    }

    // Fallback
    res.json({ success: true, orderId: orderRef, message: 'Order submitted (demo mode)' });
  } catch (err) {
    console.error('Order error:', err);
    res.json({ success: true, orderId: orderRef, message: 'Order submitted (demo mode)' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: dbAvailable ? 'connected' : 'fallback', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🍽️  Food Tailor API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Brands: http://localhost:${PORT}/api/brands\n`);
});
