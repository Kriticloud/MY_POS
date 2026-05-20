// Script to add product images and user avatars to the database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Product images mapped by slug — using Unsplash (free, permanent URLs)
const productImages = {
  // ── Restaurant ──
  'espresso': 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
  'cappuccino': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
  'latte': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
  'classic-burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  'chicken-sandwich': 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop',
  'margherita-pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
  'chocolate-cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
  'french-fries': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
  'burger-combo': 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop',
  'pancake-stack': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',

  // ── Salon ──
  'mens-haircut': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
  'womens-haircut': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
  'kids-haircut': 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=300&fit=crop',
  'buzz-cut': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop',
  'beard-trim': 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=300&fit=crop',
  'clean-shave': 'https://images.unsplash.com/photo-1585747860019-024b6e8de8c9?w=400&h=300&fit=crop',
  'beard-coloring': 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=300&fit=crop',
  'hair-coloring': 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
  'highlights': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
  'keratin-treatment': 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=300&fit=crop',
  'blowdry-style': 'https://images.unsplash.com/photo-1522337094846-8a818192de1f?w=400&h=300&fit=crop',
  'head-massage': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
  'full-body-massage': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop',
  'aromatherapy-spa': 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=400&h=300&fit=crop',
  'manicure': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
  'pedicure': 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=300&fit=crop',
  'gel-nails': 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=300&fit=crop',
  'nail-art-design': 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=300&fit=crop',
  'facial': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
  'waxing-legs': 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop',
  'threading-eyebrows': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop',
  'groom-package': 'https://images.unsplash.com/photo-1585747860019-024b6e8de8c9?w=400&h=300&fit=crop',
  'bridal-package': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop',
  'pamper-package': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',

  // ── Cafe ──
  'americano': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=300&fit=crop',
  'flat-white': 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&h=300&fit=crop',
  'mocha': 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=300&fit=crop',
  'hot-chocolate': 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop',
  'chai-latte': 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=400&h=300&fit=crop',
  'iced-latte': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
  'iced-matcha': 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=300&fit=crop',
  'lemonade': 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop',
  'smoothie-bowl': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop',
  'croissant': 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=300&fit=crop',
  'almond-danish': 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400&h=300&fit=crop',
  'blueberry-muffin': 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop',
  'club-sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
  'avocado-toast': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
  'cheesecake-slice': 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=300&fit=crop',
  'carrot-cake': 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop',

  // ── Grocery ──
  'bananas': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
  'tomatoes': 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=300&fit=crop',
  'baby-spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
  'avocado': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop',
  'whole-milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
  'free-range-eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop',
  'cheddar-cheese': 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400&h=300&fit=crop',
  'greek-yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
  'sourdough-bread': 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&h=300&fit=crop',
  'bagels': 'https://images.unsplash.com/photo-1585535738349-cf9c78e0ac88?w=400&h=300&fit=crop',
  'chicken-breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d82571?w=400&h=300&fit=crop',
  'salmon-fillet': 'https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=400&h=300&fit=crop',
  'olive-oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop',
  'pasta': 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=300&fit=crop',
  'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
  'orange-juice': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
  'sparkling-water': 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop',

  // ── Pharmacy ──
  'paracetamol': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
  'ibuprofen': 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=300&fit=crop',
  'cough-syrup': 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop',
  'allergy-relief': 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop',
  'antacid': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
  'vitamin-c': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=300&fit=crop',
  'multivitamin': 'https://images.unsplash.com/photo-1577401239170-897c2a5074c2?w=400&h=300&fit=crop',
  'omega3': 'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=400&h=300&fit=crop',
  'vitamin-d3': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=300&fit=crop',
  'bandages': 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=300&fit=crop',
  'antiseptic-spray': 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=300&fit=crop',
  'thermometer': 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop',
  'hand-sanitizer': 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&h=300&fit=crop',
  'sunscreen': 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=400&h=300&fit=crop',
  'baby-formula': 'https://images.unsplash.com/photo-1584839404042-8bc91a49be55?w=400&h=300&fit=crop',
  'diapers': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',

  // ── Retail ──
  'classic-tshirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
  'denim-jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
  'hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop',
  'summer-dress': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=300&fit=crop',
  'running-shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
  'canvas-sneakers': 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop',
  'leather-belt': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
  'sunglasses': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
  'backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
  'wireless-earbuds': 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=300&fit=crop',
  'phone-case': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop',
  'usb-c-cable': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop',
  'scented-candle': 'https://images.unsplash.com/photo-1602607650990-90f5e0a5e784?w=400&h=300&fit=crop',
  'throw-pillow': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=300&fit=crop',
  'coffee-mug': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop',
};

// User avatars using UI Avatars (deterministic service)
const userAvatars = {
  'admin@mypos.com': 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff&size=128&bold=true',
  'maria@mypos.com': 'https://ui-avatars.com/api/?name=Maria+Garcia&background=ec4899&color=fff&size=128&bold=true',
  'james@mypos.com': 'https://ui-avatars.com/api/?name=James+Wilson&background=22c55e&color=fff&size=128&bold=true',
  'sarah@mypos.com': 'https://ui-avatars.com/api/?name=Sarah+Chen&background=f59e0b&color=fff&size=128&bold=true',
  'robert@mypos.com': 'https://ui-avatars.com/api/?name=Robert+Kim&background=8b5cf6&color=fff&size=128&bold=true',
};

async function updateImages() {
  console.log('🖼️  Updating product images...');

  const products = await prisma.product.findMany({ select: { id: true, slug: true } });
  let updated = 0;

  for (const product of products) {
    const image = productImages[product.slug];
    if (image) {
      await prisma.product.update({
        where: { id: product.id },
        data: { image },
      });
      updated++;
    }
  }

  console.log(`✅ Updated ${updated}/${products.length} product images`);

  console.log('👤 Updating user avatars...');
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  let avatarCount = 0;

  for (const user of users) {
    const avatar = userAvatars[user.email];
    if (avatar) {
      await prisma.user.update({
        where: { id: user.id },
        data: { avatar },
      });
      avatarCount++;
    }
  }

  console.log(`✅ Updated ${avatarCount}/${users.length} user avatars`);
}

updateImages()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
