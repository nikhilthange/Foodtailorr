// DynamoDB Seed Script for Food Tailor
// Populates admin, customers, partners, categories, dishes, cuisines, and occasions
import bcrypt from 'bcryptjs';
import { startLocalDynamoIfRequested, ensureTableExists, TABLE_NAME } from './dynamoClient.js';
import {
  userRepository,
  partnerRepository,
  dishRepository,
  categoryRepository,
  cuisineRepository,
  occasionRepository,
} from '../repositories/dynamodb/index.js';
import { logger } from '../utils/logger.js';

export async function seedDynamo() {
  logger.info(`🌱 Seeding DynamoDB table ${TABLE_NAME}...`);

  await startLocalDynamoIfRequested();
  await ensureTableExists();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Admin User
  let admin = await userRepository.findByEmail('admin@foodtailor.in');
  if (!admin) {
    admin = await userRepository.create({
      email: 'admin@foodtailor.in',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      phone: '+91-9999999999',
    });
    logger.info('✓ Admin created: admin@foodtailor.in / password123');
  } else {
    logger.info('✓ Admin already exists: admin@foodtailor.in');
  }

  // 2. Test Customer 1
  let customer1 = await userRepository.findByEmail('test@foodtailor.in');
  if (!customer1) {
    customer1 = await userRepository.create({
      email: 'test@foodtailor.in',
      passwordHash,
      firstName: 'Priya',
      lastName: 'Sharma',
      phone: '+91-9876543210',
      role: 'CUSTOMER',
    });
    await userRepository.updatePreferences(customer1.id, {
      dietaryType: 'ALL',
      spiceLevel: 'MEDIUM',
      cuisinePreferences: ['Hyderabadi', 'Mughlai'],
    });
    logger.info('✓ Customer created: test@foodtailor.in / password123');
  }

  // Test Customer 2
  let customer2 = await userRepository.findByEmail('customer2@foodtailor.in');
  if (!customer2) {
    customer2 = await userRepository.create({
      email: 'customer2@foodtailor.in',
      passwordHash,
      firstName: 'Arjun',
      lastName: 'Reddy',
      phone: '+91-9876543211',
      role: 'CUSTOMER',
    });
    await userRepository.updatePreferences(customer2.id, {
      dietaryType: 'NON_VEG',
      spiceLevel: 'SPICY',
    });
  }

  // 3. Categories
  const categoryData = [
    { id: 'cat_biryani', name: 'Biryani', sortOrder: 1 },
    { id: 'cat_starter', name: 'Starter', sortOrder: 2 },
    { id: 'cat_main', name: 'Main Course', sortOrder: 3 },
    { id: 'cat_dessert', name: 'Dessert', sortOrder: 4 },
    { id: 'cat_beverage', name: 'Beverage', sortOrder: 5 },
  ];
  const categories = {};
  for (const cat of categoryData) {
    let existing = await categoryRepository.findById(cat.id);
    if (!existing) {
      existing = await categoryRepository.create(cat);
    }
    categories[cat.name] = existing;
  }
  logger.info(`✓ ${categoryData.length} categories verified`);

  // 4. Cuisines
  const cuisineData = [
    { id: 'csn_hyderabadi', name: 'Hyderabadi', description: 'Traditional Hyderabadi Dum and Mughlai cuisine' },
    { id: 'csn_nizami', name: 'Hyderabadi Nizami', description: 'Royal Nizami culinary heritage' },
    { id: 'csn_irani', name: 'Irani & Bakery', description: 'Classic Irani cafe culture and artisan bakes' },
    { id: 'csn_street', name: 'Street Food & Chaat', description: 'Vibrant Indian street food and chaat' },
    { id: 'csn_appetizers', name: 'Appetizers & Snacks', description: 'Crispy appetizers and party snacks' },
    { id: 'csn_desserts', name: 'Desserts & Ice Creams', description: 'Artisanal desserts and frozen treats' },
    { id: 'csn_beverages', name: 'Beverages & Shakes', description: 'Premium shakes and beverages' },
    { id: 'csn_sweets', name: 'Royal Indian Sweets', description: 'Traditional mithai and confectionery' },
    { id: 'csn_cacao', name: 'Artisanal Confectionery', description: 'Craft chocolate and gourmet treats' },
    { id: 'csn_andhra', name: 'Andhra-Telangana', description: 'Fiery Andhra and Telangana specialties' },
  ];
  for (const c of cuisineData) {
    await cuisineRepository.create(c);
  }
  logger.info(`✓ ${cuisineData.length} cuisines verified`);

  // 5. Occasions
  const occasionData = [
    { id: 'occ_birthday', slug: 'birthday-celebration', name: 'Birthday Celebration', tagline: 'Make every birthday milestone legendary' },
    { id: 'occ_family', slug: 'family-gathering', name: 'Family Gathering', tagline: 'Bring everyone together over iconic food' },
    { id: 'occ_wedding', slug: 'weddings-receptions', name: 'Weddings & Receptions', tagline: 'Curated royal banquets for celebrations' },
    { id: 'occ_corporate', slug: 'corporate-events', name: 'Corporate Events & Galas', tagline: 'Impress clients and teams with culinary icons' },
    { id: 'occ_houseparty', slug: 'house-parties', name: 'House Parties & Socials', tagline: 'Skip the multi-app chaos — one curated spread' },
    { id: 'occ_festive', slug: 'festive-celebrations', name: 'Festive Celebrations', tagline: 'Celebrate traditions with authentic food legends' },
  ];
  for (const o of occasionData) {
    let existing = await occasionRepository.findBySlug(o.slug);
    if (!existing) {
      await occasionRepository.create(o);
    }
  }
  logger.info(`✓ ${occasionData.length} occasions verified`);

  // 6. Partners (ONLY the 11 Officially Approved Hyderabad Partners)
  const partnerData = [
    {
      id: 'ptr_niloufer',
      businessName: 'Cafe Niloufer',
      slug: 'cafe-niloufer',
      logoUrl: '/brands/cafe-niloufer.png',
      tagline: 'Wahi swad, ek naya andaaz — Since 1978',
      cuisine: 'Irani & Bakery',
      location: 'Lakdikapul / Banjara Hills, Hyderabad',
      description: "Since 1978, Cafe Niloufer has defined Hyderabad's quintessential Irani chai and bakery culture, brewing scalded whole-milk tea served with artisanal Osmania biscuits.",
      whyWePicked: 'Iconic tea and traditional bakery that no Hyderabadi gathering is complete without.',
      established: 1978,
      website: 'https://cafeniloufer.com',
      coverImageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'ptr_iceberg',
      businessName: 'Ice Berg',
      slug: 'ice-berg',
      tagline: 'Artisanal Natural Rolled Scoops',
      cuisine: 'Desserts & Ice Creams',
      location: 'Jubilee Hills / Madhapur, Hyderabad',
      description: 'Organic handcrafted ice creams made with real seasonal fruits like Sitaphal and tender coconut malai, spun and rolled live on frozen granite slabs.',
      whyWePicked: 'Pure fruit, preservative-free artisanal ice creams offering the ultimate refreshing dessert station.',
      established: 2012,
      website: 'https://icebergicecreams.com',
      coverImageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'ptr_samosasingh',
      businessName: 'Sammosa Singh',
      slug: 'sammosa-singh',
      tagline: 'Crispy, Golden Handcrafted Gourmet Samosas',
      cuisine: 'Appetizers & Snacks',
      location: 'Hitec City / Gachibowli, Hyderabad',
      description: "Reinventing India's king of snacks with proprietary triangular pastries that stay crisp for 45+ minutes, filled with corn cheese, tandoori paneer, and spiced mutton kheema.",
      whyWePicked: 'High-velocity gourmet starters that ensure immediate guest delight upon arrival.',
      established: 2016,
      website: 'https://samosasingh.com',
      coverImageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'ptr_thickshake',
      businessName: 'Thick Shake Factory',
      slug: 'thick-shake-factory',
      tagline: 'Rich, Decadent Shakes & Coolers',
      cuisine: 'Beverages & Shakes',
      location: 'Banjara Hills / Hitec City, Hyderabad',
      description: "India's premier specialty shake brand crafting ultra-dense, velvety thick shakes from pure Belgian chocolate, fresh Alphonso mangoes, and Ferrero crunches.",
      whyWePicked: 'Crowd-pleasing beverage stations adored by younger guests and corporate banquet attendees alike.',
      established: 2013,
      website: 'https://thethickshakefactory.com',
      coverImageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'ptr_shadab',
      businessName: 'Hotel Shadab',
      slug: 'hotel-shadab',
      tagline: 'Old City Royalty & Legendary Dum Biryani',
      cuisine: 'Hyderabadi & Mughlai',
      location: 'Ghansi Bazaar / Old City, Hyderabad',
      description: 'Standing tall near the historic Charminar since 1953, Hotel Shadab produces legendary slow-cooked Nizami Mutton Dum Biryani, overnight Haleem, and Nahari.',
      whyWePicked: 'Unmatched authentic Old City soul and the gold standard for celebratory Hyderabadi mutton feasts.',
      established: 1953,
      website: 'https://hotelshadab.in',
      coverImageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'ptr_maharaja',
      businessName: 'Maharaja Chaat',
      slug: 'maharaja-chaat',
      tagline: 'The Ultimate Live Street Chaat Master',
      cuisine: 'Street Food & Chaat',
      location: 'Road No. 36, Jubilee Hills / Madhapur, Hyderabad',
      description: "Hyderabad's most celebrated street food destination, renowned for live interactive counters of Dahi Puri, Sev Batata Puri, and buttery Mumbai-style Pav Bhaji.",
      whyWePicked: 'High-energy, interactive chaat counters that spark conversation during pre-dinner cocktail hours.',
      established: 1996,
      website: 'https://maharajachaat.in',
      coverImageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'ptr_dimmy',
      businessName: 'Dimmy Pan Palace',
      slug: 'dimmy-pan-palace',
      tagline: 'The Signature Royal Paan Experience',
      cuisine: 'Paan & After-Mints',
      location: 'Road No. 36, Jubilee Hills, Hyderabad',
      description: "Hyderabad's most celebrated paan institution since 1995 (affectionately known as Dimmy's / Dummies), wrapping artisanal sweet Meetha Paan and Belgian Chocolate Paan in silver leaf.",
      whyWePicked: 'The timeless, aristocratic finale essential to completing every authentic Hyderabadi banquet.',
      established: 1995,
      website: 'https://dimmypanpalace.com',
      coverImageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'ptr_chocolateroom',
      businessName: 'The Chocolate Room',
      slug: 'the-chocolate-room',
      tagline: 'Boutique Chocolaterie & Indulgent Fondues',
      cuisine: 'Artisanal Confectionery',
      location: 'Road No. 10, Banjara Hills / Jubilee Hills, Hyderabad',
      description: 'Bespoke dessert atelier featuring molten Belgian chocolate fondues, Italian sipping chocolates, handcrafted truffles, and warm waffle degustations.',
      whyWePicked: 'Brings theater and modern luxury dessert staging to celebrations and receptions.',
      established: 2007,
      website: 'https://thechocolateroomindia.com',
      coverImageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'ptr_almondhouse',
      businessName: 'Almond House',
      slug: 'almond-house',
      tagline: 'Purity, Heritage & Royal Mithai',
      cuisine: 'Royal Indian Sweets',
      location: 'Himayatnagar / Jubilee Hills, Hyderabad',
      description: 'Master confectioners since 1989, renowned for proprietary pure ghee Bisticks, saffron Badam Halwa, and silver-vark Shahi Kaju Katli.',
      whyWePicked: 'Celebrated for pure ghee craftsmanship and luxurious festive gifting platters.',
      established: 1989,
      website: 'https://almondhouse.com',
      coverImageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'ptr_manam',
      businessName: 'Manam Chocolate',
      slug: 'manam-chocolate',
      tagline: 'Award-Winning Single-Origin Indian Craft Cacao',
      cuisine: 'Artisanal Confectionery',
      location: 'Road No. 12, Banjara Hills, Hyderabad',
      description: 'Internationally lauded craft chocolate atelier operating an experiential Karkhana in Banjara Hills, transforming fermented West Godavari cacao into single-origin bars and truffles.',
      whyWePicked: 'Contemporary culinary prestige and world-class craft confectionery for modern weddings and galas.',
      established: 2022,
      website: 'https://manamchocolate.com',
      coverImageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'ptr_karachi',
      businessName: 'Karachi Bakery',
      slug: 'karachi-bakery',
      tagline: 'Generations of Iconic Baking',
      cuisine: 'Irani & Bakery',
      location: 'Moazzam Jahi Market / Banjara Hills, Hyderabad',
      description: 'Founded in 1953 at Moazzam Jahi Market, Karachi Bakery is a household name worldwide for its crunchy Tutti-Frutti Fruit Biscuits and Cashew Pista cookies.',
      whyWePicked: 'A timeless Hyderabad tradition that guests across generations warmly identify with.',
      established: 1953,
      website: 'https://karachibakery.com',
      coverImageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  // Clean up legacy unapproved partners and dishes from DynamoDB
  const unapprovedPartnerIds = ['ptr_paradise', 'ptr_kritunga', 'ptr_samosaking'];
  for (const upId of unapprovedPartnerIds) {
    try {
      const oldDishes = await dishRepository.findByPartnerId(upId);
      for (const od of oldDishes) {
        await dishRepository.delete(od.id, upId);
      }
      await partnerRepository.delete(upId);
    } catch {
      // Ignore if already absent
    }
  }

  const partners = {};
  for (let i = 0; i < partnerData.length; i++) {
    const pd = partnerData[i];
    const email = `partner${i + 1}@foodtailor.in`;

    let pUser = await userRepository.findByEmail(email);
    if (!pUser) {
      pUser = await userRepository.create({
        email,
        passwordHash,
        firstName: pd.businessName.split(' ')[0],
        lastName: 'Partner',
        role: 'PARTNER',
      });
    }

    let partner = await partnerRepository.findById(pd.id);
    if (!partner) {
      partner = await partnerRepository.create({
        id: pd.id,
        userId: pUser.id,
        businessName: pd.businessName,
        slug: pd.slug,
        tagline: pd.tagline,
        description: pd.description,
        cuisine: pd.cuisine,
        location: pd.location,
        whyWePicked: pd.whyWePicked,
        established: pd.established,
        website: pd.website,
        coverImageUrl: pd.coverImageUrl,
        logoUrl: pd.logoUrl || null,
        isApproved: true,
        isActive: true,
        serviceAreas: ['Hyderabad', 'Secunderabad'],
      });
    } else {
      partner = await partnerRepository.update(partner.id, {
        userId: pUser.id,
        businessName: pd.businessName,
        slug: pd.slug,
        tagline: pd.tagline,
        description: pd.description,
        cuisine: pd.cuisine,
        location: pd.location,
        whyWePicked: pd.whyWePicked,
        established: pd.established,
        website: pd.website,
        coverImageUrl: pd.coverImageUrl,
        logoUrl: pd.logoUrl || null,
        isApproved: true,
        isActive: true,
      });
    }
    partners[pd.businessName] = partner;
  }
  logger.info(`✓ ${partnerData.length} officially approved partners verified in DynamoDB`);

  // 7. Dishes (Verified catalog dishes for the 11 approved partners)
  const dishData = [
    // 1. Cafe Niloufer
    { id: 'dsh_niloufer_chai', partner: 'Cafe Niloufer', name: 'Special Niloufer Irani Chai', category: 'Beverage', description: 'Thick, creamy, scalded milk tea brewed with signature Niloufer spice blend.', pricePerHead: 60, isVeg: true, isSignature: true },
    { id: 'dsh_niloufer_bun', partner: 'Cafe Niloufer', name: 'Fresh Bun Maska & Malai', category: 'Starter', description: 'Soft oven-baked buns slathered with rich homemade butter and clotted cream.', pricePerHead: 90, isVeg: true, isSignature: true },
    { id: 'dsh_niloufer_biscuits', partner: 'Cafe Niloufer', name: 'Artisanal Osmania Biscuits', category: 'Dessert', description: 'Buttery, crumbly, lightly salted traditional tea biscuits.', pricePerHead: 50, isVeg: true, isSignature: true },

    // 2. Ice Berg
    { id: 'dsh_iceberg_sitaphal', partner: 'Ice Berg', name: 'Organic Fresh Sitaphal Scoop', category: 'Dessert', description: 'Handcrafted ice cream with real custard apple pulp.', pricePerHead: 120, isVeg: true, isSignature: true },
    { id: 'dsh_iceberg_coconut', partner: 'Ice Berg', name: 'Tender Coconut & Honey Cream', category: 'Dessert', description: 'Fresh tender coconut malai blended with wild honey.', pricePerHead: 130, isVeg: true, isSignature: true },
    { id: 'dsh_iceberg_belgian', partner: 'Ice Berg', name: 'Belgian Dark Chocolate Roll', category: 'Dessert', description: 'Rich 70% dark chocolate rolled live on chilled stone.', pricePerHead: 140, isVeg: true, isSignature: true },

    // 3. Sammosa Singh (formerly Samosa King)
    { id: 'dsh_samosa_corn_cheese', partner: 'Sammosa Singh', name: 'Crispy Corn Cheese Samosa', category: 'Starter', description: 'Golden triangular pastry parcels filled with sweet corn and molten cheese.', pricePerHead: 90, isVeg: true, isSignature: true },
    { id: 'dsh_samosa_kheema', partner: 'Sammosa Singh', name: 'Hyderabadi Spiced Kheema Samosa', category: 'Starter', description: 'Crisp pastries stuffed with minced spiced mutton and fresh mint.', pricePerHead: 120, isVeg: false, isSignature: true },
    { id: 'dsh_samosa_paneer', partner: 'Sammosa Singh', name: 'Paneer Tikka Cocktail Samosa', category: 'Starter', description: 'Bite-sized cocktail samosas filled with tandoori spiced cottage cheese.', pricePerHead: 95, isVeg: true, isSignature: true },
    { id: 'dsh_samosa_aloo', partner: 'Sammosa Singh', name: 'Crispy Aloo Masala Samosa', category: 'Starter', description: 'Classic spiced potato and green pea samosa with tamarind drizzle.', pricePerHead: 75, isVeg: true, isSignature: true },

    // 4. Thick Shake Factory
    { id: 'dsh_thickshake_chocolate', partner: 'Thick Shake Factory', name: 'Belgian Chocolate Thick Shake', category: 'Beverage', description: 'Ultra-thick gourmet chocolate shake with dark fudge swirls.', pricePerHead: 150, isVeg: true, isSignature: true },
    { id: 'dsh_thickshake_mango', partner: 'Thick Shake Factory', name: 'Alphonso Mango Cream Shake', category: 'Beverage', description: 'Real Alphonso mango pulp blended with velvet vanilla cream.', pricePerHead: 140, isVeg: true, isSignature: true },
    { id: 'dsh_thickshake_ferrero', partner: 'Thick Shake Factory', name: 'Ferrero Hazelnut Crunch Shake', category: 'Beverage', description: 'Decadent chocolate hazelnut shake with roasted wafer bits.', pricePerHead: 160, isVeg: true, isSignature: true },

    // 5. Hotel Shadab
    { id: 'dsh_shadab_mutton_biryani', partner: 'Hotel Shadab', name: 'Shadab Royal Mutton Dum Biryani', category: 'Biryani', description: 'Old City-style slow-cooked Nizami mutton biryani layered with fragrant basmati and saffron.', pricePerHead: 320, isVeg: false, isSignature: true, spiceLevel: 'SPICY' },
    { id: 'dsh_shadab_chicken_biryani', partner: 'Hotel Shadab', name: 'Shadab Nizami Chicken Dum Biryani', category: 'Biryani', description: 'Aromatic chicken dum biryani slow-steamed in a sealed copper degh.', pricePerHead: 260, isVeg: false, isSignature: true, spiceLevel: 'MEDIUM' },
    { id: 'dsh_shadab_veg_biryani', partner: 'Hotel Shadab', name: 'Shahi Subz Dum Biryani', category: 'Biryani', description: 'Slow-cooked royal vegetable biryani with garden vegetables, paneer, and saffron milk.', pricePerHead: 200, isVeg: true, isSignature: true, spiceLevel: 'MEDIUM' },
    { id: 'dsh_shadab_haleem', partner: 'Hotel Shadab', name: 'Slow-Simmered Mutton Haleem', category: 'Main Course', description: 'Overnight cooked broken wheat, lentils, pure ghee, and tender meat stew with fried onions.', pricePerHead: 240, isVeg: false, isSignature: true },
    { id: 'dsh_shadab_nahari', partner: 'Hotel Shadab', name: 'Traditional Handi Nahari', category: 'Main Course', description: 'Spiced bone-marrow shank stew simmered for 8 hours on slow embers.', pricePerHead: 260, isVeg: false, isSignature: true },

    // 6. Maharaja Chaat
    { id: 'dsh_maharaja_dahi_puri', partner: 'Maharaja Chaat', name: 'Special Dahi Puri Platter', category: 'Starter', description: 'Crisp puris stuffed with spiced potatoes, chilled sweet yogurt, and tangy date chutney.', pricePerHead: 110, isVeg: true, isSignature: true },
    { id: 'dsh_maharaja_sev_puri', partner: 'Maharaja Chaat', name: 'Maharaja Sev Batata Puri', category: 'Starter', description: 'Flat puris topped with seasoned potatoes, raw mango, and a trio of artisanal chutneys.', pricePerHead: 100, isVeg: true, isSignature: true },
    { id: 'dsh_maharaja_pav_bhaji', partner: 'Maharaja Chaat', name: 'Butter Pav Bhaji Counter', category: 'Main Course', description: 'Mashed spiced vegetable gravy with pure Amul butter and toasted pav.', pricePerHead: 140, isVeg: true, isSignature: true },

    // 7. Dimmy Pan Palace
    { id: 'dsh_dimmy_meetha_pan', partner: 'Dimmy Pan Palace', name: 'Special Meetha Pan Counter', category: 'Dessert', description: 'Fresh tender betel leaf wrapped with gulkand, fennel, cherries, and silver vark.', pricePerHead: 50, isVeg: true, isSignature: true },
    { id: 'dsh_dimmy_chocolate_pan', partner: 'Dimmy Pan Palace', name: 'Belgian Chocolate Paan', category: 'Dessert', description: 'Sweet gulkand paan coated in gourmet dark chocolate shell.', pricePerHead: 70, isVeg: true, isSignature: true },
    { id: 'dsh_dimmy_maghai_pan', partner: 'Dimmy Pan Palace', name: 'Royal Maghai Gulkand Paan', category: 'Dessert', description: 'Delicate Maghai leaf infused with natural saffron extracts and dry fruits.', pricePerHead: 65, isVeg: true, isSignature: true },

    // 8. The Chocolate Room
    { id: 'dsh_tcr_fondue', partner: 'The Chocolate Room', name: 'Belgian Chocolate Fondue Platter', category: 'Dessert', description: 'Warm molten Belgian chocolate served with fresh fruit skewers, brownies, and marshmallows.', pricePerHead: 210, isVeg: true, isSignature: true },
    { id: 'dsh_tcr_hot_chocolate', partner: 'The Chocolate Room', name: 'Italian Sipping Hot Chocolate', category: 'Beverage', description: 'Thick, velvety Italian dark drinking chocolate served in porcelain demi-cups.', pricePerHead: 160, isVeg: true, isSignature: true },
    { id: 'dsh_tcr_truffle_pastry', partner: 'The Chocolate Room', name: 'Dark Chocolate Truffle Pastry', category: 'Dessert', description: 'Multi-layer dark chocolate ganache cake with cacao dust.', pricePerHead: 180, isVeg: true, isSignature: true },

    // 9. Almond House
    { id: 'dsh_almond_bisticks', partner: 'Almond House', name: 'Signature Almond Bisticks', category: 'Dessert', description: 'Legendary crunchy almond confectionery exclusive to Almond House.', pricePerHead: 180, isVeg: true, isSignature: true },
    { id: 'dsh_almond_halwa', partner: 'Almond House', name: 'Pure Ghee Badam Halwa', category: 'Dessert', description: 'Rich almond halwa cooked with pure cow ghee and Kashmiri saffron.', pricePerHead: 190, isVeg: true, isSignature: true },
    { id: 'dsh_almond_kaju', partner: 'Almond House', name: 'Shahi Kaju Katli Platter', category: 'Dessert', description: 'Melt-in-mouth cashew fudge made with premium Goan cashews.', pricePerHead: 160, isVeg: true, isSignature: true },

    // 10. Manam Chocolate
    { id: 'dsh_manam_truffles', partner: 'Manam Chocolate', name: 'Single Origin Cacao Truffles', category: 'Dessert', description: 'Hand-rolled truffles with South Indian spices and raw West Godavari cacao.', pricePerHead: 220, isVeg: true, isSignature: true },
    { id: 'dsh_manam_tasting', partner: 'Manam Chocolate', name: 'Craft Chocolate Tasting Board', category: 'Dessert', description: 'Selection of 65%-75% dark single-origin chocolate bars with roasted almonds.', pricePerHead: 200, isVeg: true, isSignature: true },

    // 11. Karachi Bakery
    { id: 'dsh_karachi_fruit_biscuits', partner: 'Karachi Bakery', name: 'Original Karachi Fruit Biscuits', category: 'Dessert', description: 'World-famous crumbly biscuits with candied papaya and cardamom essence.', pricePerHead: 60, isVeg: true, isSignature: true },
    { id: 'dsh_karachi_cashew_cookies', partner: 'Karachi Bakery', name: 'Cashew Pista Cookies Platter', category: 'Dessert', description: 'Rich roasted dry fruit shortbread cookies baked to golden perfection.', pricePerHead: 75, isVeg: true, isSignature: true },
  ];

  let dishCount = 0;
  for (const d of dishData) {
    const partner = partners[d.partner];
    const cat = categories[d.category];
    if (!partner || !cat) continue;

    let existing = await dishRepository.findById(d.id);
    if (!existing) {
      await dishRepository.create({
        id: d.id,
        partnerId: partner.id,
        categoryId: cat.id,
        name: d.name,
        description: d.description,
        pricePerHead: d.pricePerHead,
        isVeg: d.isVeg,
        isSignature: d.isSignature || false,
        isAvailable: true,
        spiceLevel: d.spiceLevel || 'MEDIUM',
        allergens: d.allergens || [],
        tags: d.tags || [],
      });
      dishCount++;
    } else {
      await dishRepository.update(d.id, {
        partnerId: partner.id,
        categoryId: cat.id,
        name: d.name,
        description: d.description,
        pricePerHead: d.pricePerHead,
        isVeg: d.isVeg,
        isSignature: d.isSignature || false,
        isAvailable: true,
        spiceLevel: d.spiceLevel || 'MEDIUM',
      }, partner.id);
      dishCount++;
    }
  }
  logger.info(`✓ ${dishCount} dishes ready in DynamoDB`);

  logger.info('\n🎉 DynamoDB Seed Complete!');
  logger.info('   Admin:    admin@foodtailor.in / password123');
  logger.info('   Customer: test@foodtailor.in / password123');
  logger.info('   Partner:  partner1@foodtailor.in / password123 (Cafe Niloufer)');
  logger.info('   Partner:  partner8@foodtailor.in / password123 (The Chocolate Room)\n');
  return true;
}

if (process.argv[1]?.endsWith('seedDynamo.js')) {
  seedDynamo()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ DynamoDB seed failed:', err);
      process.exit(1);
    });
}
