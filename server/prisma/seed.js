// Comprehensive seed script for Food Tailor
// Creates admin, test customers, partners (brands), categories, dishes, occasions
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Food Tailor database...\n');

  // Clear existing data in correct dependency order
  await prisma.aIRecommendationItem.deleteMany();
  await prisma.aIRecommendation.deleteMany();
  await prisma.savedMenuItem.deleteMany();
  await prisma.savedMenu.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.category.deleteMany();
  await prisma.cuisine.deleteMany();
  await prisma.occasion.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.address.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 12);

  // ─── Admin User ──────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      email: 'admin@foodtailor.in',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      preferences: { create: {} },
    },
  });
  console.log('✓ Admin: admin@foodtailor.in / password123');

  // ─── Test Customers ──────────────────────────────
  const customer1 = await prisma.user.create({
    data: {
      email: 'test@foodtailor.in',
      passwordHash,
      firstName: 'Priya',
      lastName: 'Sharma',
      phone: '+91-9876543210',
      role: 'CUSTOMER',
      preferences: { create: { dietaryType: 'ALL', spiceLevel: 'MEDIUM', cuisinePreferences: ['Hyderabadi', 'Mughlai'] } },
      addresses: {
        create: { label: 'Home', line1: 'Plot 42, Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033', isDefault: true },
      },
    },
  });
  console.log('✓ Customer: test@foodtailor.in / password123');

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@foodtailor.in',
      passwordHash,
      firstName: 'Arjun',
      lastName: 'Reddy',
      role: 'CUSTOMER',
      preferences: { create: { dietaryType: 'NON_VEG', spiceLevel: 'SPICY' } },
    },
  });

  // ─── Categories ──────────────────────────────────
  const categories = {};
  const categoryData = [
    { name: 'Biryani', sortOrder: 1 },
    { name: 'Starter', sortOrder: 2 },
    { name: 'Main Course', sortOrder: 3 },
    { name: 'Dessert', sortOrder: 4 },
    { name: 'Beverage', sortOrder: 5 },
  ];
  for (const cat of categoryData) {
    categories[cat.name] = await prisma.category.create({ data: cat });
  }
  console.log(`✓ ${categoryData.length} categories`);

  // ─── Cuisines ────────────────────────────────────
  const cuisineData = [
    { name: 'Hyderabadi', description: 'Traditional Hyderabadi Dum and Mughlai cuisine' },
    { name: 'Hyderabadi Nizami', description: 'Royal Nizami culinary heritage' },
    { name: 'Irani & Bakery', description: 'Classic Irani cafe culture and artisan bakes' },
    { name: 'Street Food & Chaat', description: 'Vibrant Indian street food and chaat' },
    { name: 'Appetizers & Snacks', description: 'Crispy appetizers and party snacks' },
    { name: 'Desserts & Ice Creams', description: 'Artisanal desserts and frozen treats' },
    { name: 'Beverages & Shakes', description: 'Premium shakes and beverages' },
    { name: 'Royal Indian Sweets', description: 'Traditional mithai and confectionery' },
    { name: 'Artisanal Confectionery', description: 'Craft chocolate and gourmet treats' },
    { name: 'Andhra-Telangana', description: 'Fiery Andhra and Telangana specialties' },
  ];
  for (const c of cuisineData) {
    await prisma.cuisine.create({ data: c });
  }
  console.log(`✓ ${cuisineData.length} cuisines`);

  // ─── Occasions ───────────────────────────────────
  const occasionData = [
    { name: 'Birthday Celebration', icon: '🎂', description: 'Your favorite food brands delivered for a memorable birthday feast' },
    { name: 'Family Gathering', icon: '👨‍👩‍👧‍👦', description: 'Bring the family together over beloved signature dishes' },
    { name: 'Weddings & Receptions', icon: '💒', description: 'Curated multi-brand banquet feasts tailored for your guests' },
    { name: 'Corporate Events & Galas', icon: '💼', description: 'Impress clients and teams with iconic food brands' },
    { name: 'House Parties & Socials', icon: '🏠', description: 'Skip the multi-app chaos — one curated spread' },
    { name: 'Festive Celebrations', icon: '✨', description: 'Celebrate festive traditions with authentic regional food legends' },
  ];
  const occasions = {};
  for (const o of occasionData) {
    occasions[o.name] = await prisma.occasion.create({ data: o });
  }
  console.log(`✓ ${occasionData.length} occasions`);

  // ─── Partners (Brands) ───────────────────────────
  const partnerData = [
    { businessName: 'Cafe Niloufer', tagline: 'The Gold Standard of Irani Chai & Maska Bun', cuisine: 'Irani & Bakery', description: "Since 1978, Cafe Niloufer has defined Hyderabad's tea and bakery culture with world-famous Irani Chai, Osmania biscuits, and fresh malai maska buns.", whyWePicked: "An iconic Hyderabadi gathering is never complete without Niloufer's rich, velvety Irani Chai.", established: 1978 },
    { businessName: 'Hotel Shadab', tagline: 'Old City Royalty & Legendary Flavors', cuisine: 'Hyderabadi & Mughlai', description: 'Nestled near the historic Charminar, Hotel Shadab carries forward generations of authentic Mughlai heritage.', whyWePicked: 'Authentic Old City soul — their mutton biryani brings unmatched depth to any feast.', established: 1953 },
    { businessName: 'Maharaja Chat', tagline: 'The Ultimate Street Food Master', cuisine: 'Street Food & Chaat', description: "Hyderabad's premier destination for artisanal chaat and vibrant street snacks.", whyWePicked: 'Brings high-energy chaat counters guests flock to during cocktail hours.', established: 1996 },
    { businessName: 'Samosa King', tagline: 'Crispy, Flavour-Packed Starters', cuisine: 'Appetizers & Snacks', description: 'Famous across the city for handcrafted specialty samosas and party appetizers.', whyWePicked: 'Crisp, hot starters that get every celebration started right.', established: 2008 },
    { businessName: 'Ice Berg Ice Creams', tagline: 'Artisanal Natural Scoops', cuisine: 'Desserts & Ice Creams', description: 'Pioneers of organic, handcrafted ice creams made with fresh seasonal fruits.', whyWePicked: 'The ultimate refreshing dessert station for celebrations.', established: 2012 },
    { businessName: 'The Thick Shake Factory', tagline: 'Rich, Decadent Shakes & Coolers', cuisine: 'Beverages & Shakes', description: "India's premium thick shake brand crafting velvety Belgian chocolate shakes.", whyWePicked: 'A hit with guests of all ages.', established: 2013 },
    { businessName: 'Almond House', tagline: 'Purity, Heritage & Royal Mithai', cuisine: 'Royal Indian Sweets', description: 'Master confectioners renowned for pure ghee Bisticks and Kaju Katli.', whyWePicked: 'Celebrated across generations for luxurious festive sweet platters.', established: 1989 },
    { businessName: 'Manam Chocolate', tagline: 'Award-Winning Craft Indian Cacao', cuisine: 'Artisanal Confectionery', description: 'Internationally celebrated single-origin Indian craft chocolate makers.', whyWePicked: 'Adds bespoke luxury gourmet confectionery to celebrations.', established: 2022 },
    { businessName: 'Karachi Bakery', tagline: 'Generations of Iconic Baking', cuisine: 'Bakes & Pastries', description: 'Globally renowned for Tutti-Frutti Fruit Biscuits and celebratory bakes.', whyWePicked: 'A beloved household name guests instantly recognize.', established: 1953 },
    { businessName: 'Dimmy Pan Palace', tagline: 'The Signature Royal Paan Experience', cuisine: 'Paan & After-Mints', description: "Hyderabad's most famous paan institution for artisanal Meetha Paan.", whyWePicked: 'The timeless royal finish to every Hyderabadi banquet.', established: 1995 },
    { businessName: 'Paradise', tagline: 'The Crown Jewel of Hyderabadi Dum Biryani', cuisine: 'Hyderabadi', description: 'Since 1953, Paradise has set the gold standard for celebratory Hyderabadi Dum Biryani.', whyWePicked: 'No grand celebration is complete without Paradise Dum Biryani.', established: 1953 },
    { businessName: 'Kritunga', tagline: 'Andhra Heat, Telangana Heart', cuisine: 'Andhra-Telangana', description: 'Fiery Andhra flavors — not for the faint-hearted.', whyWePicked: 'Adds an Andhra dimension to any multi-brand menu.', established: 2001 },
  ];

  const partners = {};
  for (let i = 0; i < partnerData.length; i++) {
    const pd = partnerData[i];
    const partnerUser = await prisma.user.create({
      data: {
        email: `partner${i + 1}@foodtailor.in`,
        passwordHash,
        firstName: pd.businessName.split(' ')[0],
        lastName: 'Partner',
        role: 'PARTNER',
        preferences: { create: {} },
      },
    });
    partners[pd.businessName] = await prisma.partner.create({
      data: {
        userId: partnerUser.id,
        businessName: pd.businessName,
        tagline: pd.tagline,
        description: pd.description,
        cuisine: pd.cuisine,
        whyWePicked: pd.whyWePicked,
        established: pd.established,
        isApproved: true,
        isActive: true,
        serviceAreas: ['Hyderabad', 'Secunderabad'],
        minOrderAmount: 5000,
        maxEventCapacity: 500,
      },
    });
  }
  console.log(`✓ ${partnerData.length} partners (each with login: partner[N]@foodtailor.in / password123)`);

  // ─── Dishes ──────────────────────────────────────
  const dishData = [
    // Cafe Niloufer
    { partner: 'Cafe Niloufer', name: 'Special Niloufer Irani Chai', category: 'Beverage', description: 'Thick, creamy, scalded milk tea brewed with signature Niloufer spice blend.', pricePerHead: 60, isVeg: true, isSignature: true },
    { partner: 'Cafe Niloufer', name: 'Fresh Bun Maska & Malai', category: 'Starter', description: 'Soft oven-baked buns slathered with rich homemade butter and clotted cream.', pricePerHead: 90, isVeg: true, isSignature: true },
    { partner: 'Cafe Niloufer', name: 'Artisanal Osmania Biscuits', category: 'Dessert', description: 'Buttery, crumbly, lightly salted traditional tea biscuits.', pricePerHead: 50, isVeg: true, isSignature: true },
    // Hotel Shadab
    { partner: 'Hotel Shadab', name: 'Shadab Royal Mutton Dum Biryani', category: 'Biryani', description: 'Old City-style slow-cooked mutton biryani with whole spices.', pricePerHead: 320, isVeg: false, isSignature: true, spiceLevel: 'SPICY' },
    { partner: 'Hotel Shadab', name: 'Slow-Simmered Mutton Haleem', category: 'Main Course', description: 'Overnight cooked broken wheat, lentils, and meat stew.', pricePerHead: 240, isVeg: false, isSignature: true },
    { partner: 'Hotel Shadab', name: 'Traditional Handi Nahari', category: 'Main Course', description: 'Spiced bone-marrow shank stew simmered on slow embers.', pricePerHead: 260, isVeg: false, isSignature: true },
    // Maharaja Chat
    { partner: 'Maharaja Chat', name: 'Special Dahi Puri Platter', category: 'Starter', description: 'Crisp puris stuffed with spiced potatoes, sweet yogurt, and chutney.', pricePerHead: 110, isVeg: true, isSignature: true },
    { partner: 'Maharaja Chat', name: 'Maharaja Sev Batata Puri', category: 'Starter', description: 'Flat puris topped with seasoned potatoes and trio of chutneys.', pricePerHead: 100, isVeg: true, isSignature: true },
    { partner: 'Maharaja Chat', name: 'Butter Pav Bhaji Counter', category: 'Main Course', description: 'Mashed vegetable gravy with butter and special spices.', pricePerHead: 140, isVeg: true, isSignature: true },
    // Samosa King
    { partner: 'Samosa King', name: 'Crispy Corn Cheese Samosa', category: 'Starter', description: 'Golden pastry parcels filled with sweet corn and molten cheese.', pricePerHead: 90, isVeg: true, isSignature: true },
    { partner: 'Samosa King', name: 'Hyderabadi Spiced Kheema Samosa', category: 'Starter', description: 'Crisp pastries stuffed with minced spiced mutton.', pricePerHead: 120, isVeg: false, isSignature: true },
    { partner: 'Samosa King', name: 'Paneer Tikka Cocktail Samosa', category: 'Starter', description: 'Bite-sized samosas filled with tandoori spiced paneer.', pricePerHead: 95, isVeg: true, isSignature: true },
    // Ice Berg Ice Creams
    { partner: 'Ice Berg Ice Creams', name: 'Organic Fresh Sitaphal Scoop', category: 'Dessert', description: 'Handcrafted ice cream with real custard apple pulp.', pricePerHead: 120, isVeg: true, isSignature: true },
    { partner: 'Ice Berg Ice Creams', name: 'Tender Coconut & Honey Cream', category: 'Dessert', description: 'Fresh tender coconut malai blended with wild honey.', pricePerHead: 130, isVeg: true, isSignature: true },
    { partner: 'Ice Berg Ice Creams', name: 'Belgian Dark Chocolate Roll', category: 'Dessert', description: 'Rich 70% dark chocolate rolled live on chilled stone.', pricePerHead: 140, isVeg: true, isSignature: true },
    // Thick Shake Factory
    { partner: 'The Thick Shake Factory', name: 'Belgian Chocolate Thick Shake', category: 'Beverage', description: 'Ultra-thick gourmet chocolate shake with dark fudge.', pricePerHead: 150, isVeg: true, isSignature: true },
    { partner: 'The Thick Shake Factory', name: 'Alphonso Mango Cream Shake', category: 'Beverage', description: 'Real Alphonso mango pulp blended with vanilla cream.', pricePerHead: 140, isVeg: true, isSignature: true },
    // Almond House
    { partner: 'Almond House', name: 'Signature Almond Bisticks', category: 'Dessert', description: 'Legendary crunchy almond confectionery exclusive to Almond House.', pricePerHead: 180, isVeg: true, isSignature: true },
    { partner: 'Almond House', name: 'Pure Ghee Badam Halwa', category: 'Dessert', description: 'Rich almond halwa cooked with pure cow ghee and saffron.', pricePerHead: 190, isVeg: true, isSignature: true },
    { partner: 'Almond House', name: 'Shahi Kaju Katli Platter', category: 'Dessert', description: 'Melt-in-mouth cashew fudge made with Goan cashews.', pricePerHead: 160, isVeg: true, isSignature: true },
    // Manam Chocolate
    { partner: 'Manam Chocolate', name: 'Single Origin Cacao Truffles', category: 'Dessert', description: 'Hand-rolled truffles with South Indian spices and raw cacao.', pricePerHead: 220, isVeg: true, isSignature: true },
    { partner: 'Manam Chocolate', name: 'Craft Chocolate Tasting Board', category: 'Dessert', description: 'Selection of 65%-75% dark chocolate bars with roasted nuts.', pricePerHead: 200, isVeg: true, isSignature: true },
    // Karachi Bakery
    { partner: 'Karachi Bakery', name: 'Original Karachi Fruit Biscuits', category: 'Dessert', description: 'World-famous crumbly biscuits with candied papaya.', pricePerHead: 60, isVeg: true, isSignature: true },
    { partner: 'Karachi Bakery', name: 'Cashew Pista Cookies Platter', category: 'Dessert', description: 'Rich roasted dry fruit shortbread cookies.', pricePerHead: 75, isVeg: true, isSignature: true },
    // Dimmy Pan Palace
    { partner: 'Dimmy Pan Palace', name: 'Special Meetha Pan Counter', category: 'Dessert', description: 'Fresh betel leaf wrapped with gulkand and silver vark.', pricePerHead: 50, isVeg: true, isSignature: true },
    { partner: 'Dimmy Pan Palace', name: 'Belgian Chocolate Paan', category: 'Dessert', description: 'Sweet paan coated in gourmet dark chocolate.', pricePerHead: 70, isVeg: true, isSignature: true },
    // Paradise
    { partner: 'Paradise', name: 'Royal Chicken Dum Biryani', category: 'Biryani', description: 'World-famous aromatic saffron dum biryani with tender chicken.', pricePerHead: 260, isVeg: false, isSignature: true },
    { partner: 'Paradise', name: 'Paradise Chicken 65', category: 'Starter', description: 'Crisp, fiery deep-fried chicken with curry leaves and spices.', pricePerHead: 190, isVeg: false, isSignature: true, spiceLevel: 'SPICY' },
    { partner: 'Paradise', name: 'Vegetable Dum Biryani', category: 'Biryani', description: 'Aromatic vegetable biryani with seasonal vegetables and saffron.', pricePerHead: 200, isVeg: true, isSignature: true },
    // Kritunga
    { partner: 'Kritunga', name: 'Natukodi Curry', category: 'Main Course', description: 'Andhra-style country chicken with bold heat.', pricePerHead: 260, isVeg: false, isSignature: true, spiceLevel: 'EXTRA_SPICY' },
    { partner: 'Kritunga', name: 'Guntur Chicken', category: 'Main Course', description: 'Fiery Guntur-style with red chilies.', pricePerHead: 240, isVeg: false, isSignature: true, spiceLevel: 'EXTRA_SPICY' },
    { partner: 'Kritunga', name: 'Boti Curry', category: 'Main Course', description: 'Tender boneless meat in spice-forward gravy.', pricePerHead: 230, isVeg: false, isSignature: true, spiceLevel: 'SPICY' },
  ];

  let dishCount = 0;
  for (const d of dishData) {
    const partner = partners[d.partner];
    if (!partner) { console.warn(`Partner not found: ${d.partner}`); continue; }
    const category = categories[d.category];
    if (!category) { console.warn(`Category not found: ${d.category}`); continue; }

    await prisma.dish.create({
      data: {
        partnerId: partner.id,
        categoryId: category.id,
        name: d.name,
        description: d.description,
        pricePerHead: d.pricePerHead,
        isVeg: d.isVeg,
        isSignature: d.isSignature || false,
        isAvailable: true,
        servesMin: 10,
        spiceLevel: d.spiceLevel || 'MEDIUM',
        allergens: d.allergens || [],
        tags: d.tags || [],
      },
    });
    dishCount++;
  }
  console.log(`✓ ${dishCount} dishes`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin:    admin@foodtailor.in / password123');
  console.log('   Customer: test@foodtailor.in / password123');
  console.log('   Partner:  partner1@foodtailor.in / password123 (Cafe Niloufer)');
  console.log('   Partner:  partner11@foodtailor.in / password123 (Paradise)\n');
}

main()
  .catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
