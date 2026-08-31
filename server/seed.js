// Seed script — populates PostgreSQL with Hyderabad signature kitchen data
import pg from 'pg';
import schema from './schema.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/foodtailor',
});

const brands = [
  { name: 'Paradise', tagline: 'The Original Biryani Kingdom', cuisine: 'Hyderabadi', description: 'Since 1953, Paradise has been the crown jewel of Hyderabadi biryani culture.', why_we_picked: 'No Hyderabad event is complete without Paradise.', established: 1953 },
  { name: 'Bawarchi', tagline: 'Where Bold Flavors Gather', cuisine: 'Hyderabadi', description: 'Generous portions and robust flavors that satisfy purists and adventurers.', why_we_picked: 'Crowd-pleasing flavors in volume — perfect for events.', established: 1994 },
  { name: 'Cafe Bahar', tagline: 'Heritage in Every Bite', cuisine: 'Hyderabadi', description: 'A beloved institution blending soul food with warmth and consistency.', why_we_picked: 'Their Afghani Chicken and samosas elevate any event.', established: 1973 },
  { name: 'Hotel Shadab', tagline: 'Old City Royalty', cuisine: 'Hyderabadi', description: 'Centuries of Mughlai and Hyderabadi culinary tradition near Charminar.', why_we_picked: 'Authentic Old City soul no modern kitchen can replicate.', established: 1953 },
  { name: 'Shah Ghouse', tagline: 'The Late-Night Legend', cuisine: 'Hyderabadi', description: 'Famous for seasonal Haleem and smoky chicken fry.', why_we_picked: 'Ramadan Haleem is a cultural event — now for your celebrations.', established: 1981 },
  { name: 'Pista House', tagline: 'Haleem Masters', cuisine: 'Hyderabadi', description: 'Turned Haleem into art and Osmania Biscuit into a citywide obsession.', why_we_picked: 'Award-winning Haleem and unique Dry Fruit Biryani.', established: 1998 },
  { name: 'Jewel of Nizam', tagline: 'Regal Nizami Cuisine', cuisine: 'Hyderabadi Nizami', description: 'True Nizami cuisine — Pathar Ka Gosht cooked on heated stone slabs.', why_we_picked: 'Unmatched elegance for grand occasions.', established: 2005 },
  { name: 'Meridian', tagline: 'Dependable Feast Makers', cuisine: 'Hyderabadi', description: 'Consistent, flavorful, and always ready for large events.', why_we_picked: 'Reliable quality at scale for biryani and kebabs.', established: 1990 },
  { name: 'Kritunga', tagline: 'Andhra Heat, Telangana Heart', cuisine: 'Andhra-Telangana', description: 'Fiery Andhra flavors — not for the faint-hearted.', why_we_picked: 'Adds an Andhra dimension to any multi-brand menu.', established: 2001 },
];

const dishes = [
  // Paradise (brand_id 1)
  { brand_idx: 0, name: 'Hyderabadi Dum Biryani', category: 'Biryani', description: 'Slow-cooked basmati with aromatic spices and tender meat.', price_per_head: 250, is_veg: false },
  { brand_idx: 0, name: 'Chicken 65', category: 'Starter', description: 'Fiery deep-fried chicken with curry leaves and chilies.', price_per_head: 180, is_veg: false },
  { brand_idx: 0, name: 'Shahi Tukda', category: 'Dessert', description: 'Royal bread pudding soaked in saffron-cardamom milk.', price_per_head: 120, is_veg: true },
  // Bawarchi (brand_id 2)
  { brand_idx: 1, name: 'Mutton Biryani', category: 'Biryani', description: 'Hearty mutton with fragrant rice and whole spices.', price_per_head: 300, is_veg: false },
  { brand_idx: 1, name: 'Chicken Biryani', category: 'Biryani', description: 'Flavorful chicken biryani with spiced rice.', price_per_head: 220, is_veg: false },
  { brand_idx: 1, name: 'Bawarchi Special Curry', category: 'Main Course', description: 'Rich slow-simmered curry with proprietary spice blend.', price_per_head: 200, is_veg: false },
  // Cafe Bahar (brand_id 3)
  { brand_idx: 2, name: 'Hyderabadi Chicken Biryani', category: 'Biryani', description: 'Aromatic, flavorful, consistently perfect.', price_per_head: 230, is_veg: false },
  { brand_idx: 2, name: 'Afghani Chicken', category: 'Starter', description: 'Creamy grilled chicken with yogurt-cashew marinade.', price_per_head: 220, is_veg: false },
  { brand_idx: 2, name: 'Onion Samosa', category: 'Starter', description: 'Crispy pastry pockets with spiced onion filling.', price_per_head: 80, is_veg: true },
  // Hotel Shadab (brand_id 4)
  { brand_idx: 3, name: 'Mutton Biryani', category: 'Biryani', description: 'Old City-style with robust spicing and fall-off-the-bone meat.', price_per_head: 320, is_veg: false },
  { brand_idx: 3, name: 'Haleem', category: 'Main Course', description: 'Slow-cooked wheat, lentil, and meat stew.', price_per_head: 200, is_veg: false },
  { brand_idx: 3, name: 'Nahari', category: 'Main Course', description: 'Overnight-simmered bone-marrow stew.', price_per_head: 250, is_veg: false },
  // Shah Ghouse (brand_id 5)
  { brand_idx: 4, name: 'Haleem', category: 'Main Course', description: 'Legendary Ramadan-special Haleem.', price_per_head: 220, is_veg: false },
  { brand_idx: 4, name: 'Chicken Fry', category: 'Starter', description: 'Golden-fried chicken with smoky, crispy exterior.', price_per_head: 180, is_veg: false },
  { brand_idx: 4, name: 'Irani Chai', category: 'Beverage', description: 'Thick, creamy Irani chai in traditional glasses.', price_per_head: 60, is_veg: true },
  // Pista House (brand_id 6)
  { brand_idx: 5, name: 'Haleem', category: 'Main Course', description: 'Award-winning Haleem on the national map.', price_per_head: 210, is_veg: false },
  { brand_idx: 5, name: 'Osmania Biscuit', category: 'Dessert', description: 'Iconic crumbly, buttery Hyderabadi biscuit.', price_per_head: 50, is_veg: true },
  { brand_idx: 5, name: 'Dry Fruit Biryani', category: 'Biryani', description: 'Aromatic biryani studded with premium dry fruits.', price_per_head: 350, is_veg: true },
  // Jewel of Nizam (brand_id 7)
  { brand_idx: 6, name: 'Pathar Ka Gosht', category: 'Main Course', description: 'Marinated meat on heated stone slab — Nizami masterpiece.', price_per_head: 400, is_veg: false },
  { brand_idx: 6, name: 'Haleem', category: 'Main Course', description: 'Royal-recipe Haleem with silky finish.', price_per_head: 240, is_veg: false },
  { brand_idx: 6, name: 'Murgh Dum Biryani', category: 'Biryani', description: 'Nizami-style chicken dum biryani with saffron.', price_per_head: 280, is_veg: false },
  // Meridian (brand_id 8)
  { brand_idx: 7, name: 'Chicken Biryani', category: 'Biryani', description: 'Reliable, flavorful crowd-pleaser at scale.', price_per_head: 200, is_veg: false },
  { brand_idx: 7, name: 'Mutton Biryani', category: 'Biryani', description: 'Rich mutton biryani with generous portions.', price_per_head: 280, is_veg: false },
  { brand_idx: 7, name: 'Malai Kebab', category: 'Starter', description: 'Cream-marinated kebabs grilled to perfection.', price_per_head: 200, is_veg: false },
  // Kritunga (brand_id 9)
  { brand_idx: 8, name: 'Natukodi Curry', category: 'Main Course', description: 'Andhra-style country chicken with bold heat.', price_per_head: 260, is_veg: false },
  { brand_idx: 8, name: 'Guntur Chicken', category: 'Main Course', description: 'Fiery Guntur-style with red chilies.', price_per_head: 240, is_veg: false },
  { brand_idx: 8, name: 'Boti Curry', category: 'Main Course', description: 'Tender boneless meat in spice-forward gravy.', price_per_head: 230, is_veg: false },
];

const occasionsData = [
  { name: 'Birthday', icon: '🎂', description: 'Make it a feast worth remembering' },
  { name: 'House Party', icon: '🏠', description: 'Elevate your home gathering' },
  { name: 'Family Function', icon: '👨‍👩‍👧‍👦', description: 'Bring the family together over food' },
  { name: 'Corporate Event', icon: '💼', description: 'Impress clients and colleagues' },
  { name: 'Wedding', icon: '💒', description: 'A feast as grand as the occasion' },
  { name: 'Festive Celebration', icon: '✨', description: 'Celebrate the season with signature flavors' },
];

async function seed() {
  const client = await pool.connect();
  try {
    // Create tables
    await client.query(schema);
    console.log('✓ Tables created');

    // Clear existing data
    await client.query('TRUNCATE order_items, orders, dishes, occasions, brands RESTART IDENTITY CASCADE');

    // Insert brands
    const brandIds = [];
    for (const b of brands) {
      const res = await client.query(
        'INSERT INTO brands (name, tagline, cuisine, description, why_we_picked, established) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
        [b.name, b.tagline, b.cuisine, b.description, b.why_we_picked, b.established]
      );
      brandIds.push(res.rows[0].id);
    }
    console.log(`✓ ${brandIds.length} brands seeded`);

    // Insert dishes
    for (const d of dishes) {
      await client.query(
        'INSERT INTO dishes (brand_id, name, category, description, price_per_head, is_veg) VALUES ($1,$2,$3,$4,$5,$6)',
        [brandIds[d.brand_idx], d.name, d.category, d.description, d.price_per_head, d.is_veg]
      );
    }
    console.log(`✓ ${dishes.length} dishes seeded`);

    // Insert occasions
    for (const o of occasionsData) {
      await client.query(
        'INSERT INTO occasions (name, icon, description) VALUES ($1,$2,$3)',
        [o.name, o.icon, o.description]
      );
    }
    console.log(`✓ ${occasionsData.length} occasions seeded`);

    console.log('\n🎉 Database seeded successfully!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
