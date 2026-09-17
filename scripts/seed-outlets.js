/**
 * Seed Script — Multi-Outlet RBAC Setup
 *
 * Creates:
 *   - 5 Mohona outlets
 *   - 1 Super Admin DB user (mirrors env credentials)
 *   - 5 Outlet Managers (one per outlet)
 *
 * Usage:
 *   node scripts/seed-outlets.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'mohona_db';

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not found in .env');
  process.exit(1);
}

// ── Schemas (inline to avoid Next.js module issues) ─────────────────────────

const OutletSchema = new mongoose.Schema({
  name: String, slug: String, address: String, phone: String, email: String, status: { type: String, default: 'Active' },
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: { type: String, select: false },
  role: String, outletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Outlet', default: null },
  status: { type: String, default: 'Active' }, avatar: String, lastActive: Date,
}, { timestamps: true });

const Outlet = mongoose.models.Outlet || mongoose.model('Outlet', OutletSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// ── Data ─────────────────────────────────────────────────────────────────────

const OUTLETS = [
  {
    name: 'Mohona Shop Dhaka',
    slug: 'mohona-shop-dhaka',
    address: 'Dhaka, Bangladesh',
    phone: '+880 1700-000001',
    email: 'dhaka@mohona.com',
    status: 'Active',
  },
  {
    name: 'Mohona Exclusive Shop Chattogram',
    slug: 'mohona-exclusive-shop-chattogram',
    address: 'Chattogram, Bangladesh',
    phone: '+880 1700-000002',
    email: 'chattogram@mohona.com',
    status: 'Active',
  },
  {
    name: 'Super Shop Mohona Mongla',
    slug: 'super-shop-mohona-mongla',
    address: 'Mongla, Bagerhat, Bangladesh',
    phone: '+880 1700-000003',
    email: 'mongla@mohona.com',
    status: 'Active',
  },
  {
    name: 'Mohona Exclusive Shop Bhola',
    slug: 'mohona-exclusive-shop-bhola',
    address: 'Bhola, Bangladesh',
    phone: '+880 1700-000004',
    email: 'bhola@mohona.com',
    status: 'Active',
  },
  {
    name: 'Mohona Exclusive Shop Patuakhali',
    slug: 'mohona-exclusive-shop-patuakhali',
    address: 'Patuakhali, Bangladesh',
    phone: '+880 1700-000005',
    email: 'patuakhali@mohona.com',
    status: 'Active',
  },
];

// ── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🔌  Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  console.log('✅  Connected\n');

  // 1. Create outlets
  console.log('🏪  Seeding outlets...');
  const createdOutlets = [];
  for (const outletData of OUTLETS) {
    const existing = await Outlet.findOne({ slug: outletData.slug });
    if (existing) {
      console.log(`   ⤷ Already exists: ${outletData.name}`);
      createdOutlets.push(existing);
    } else {
      const outlet = await Outlet.create(outletData);
      console.log(`   ✓ Created: ${outlet.name} (/${outlet.slug})`);
      createdOutlets.push(outlet);
    }
  }

  // 2. Create Super Admin DB user
  console.log('\n👑  Seeding Super Admin user...');
  const superEmail = process.env.SUPER_ADMIN || 'mohona@gmail.com';
  const superPassword = process.env.SUPER_ADMIN_PASSWORD || 'mohona@2026';
  
  const existingSuperAdmin = await User.findOne({ email: superEmail });
  if (existingSuperAdmin) {
    console.log(`   ⤷ Super Admin already exists: ${superEmail}`);
  } else {
    const hashed = await bcrypt.hash(superPassword, 12);
    await User.create({
      name: 'Super Admin',
      email: superEmail,
      password: hashed,
      role: 'SUPER_ADMIN',
      outletId: null,
      status: 'Active',
    });
    console.log(`   ✓ Super Admin created: ${superEmail}`);
  }

  // 3. Create one Outlet Manager per outlet
  console.log('\n👤  Seeding Outlet Managers...');
  const managerDefs = [
    { name: 'Dhaka Manager', email: 'manager.dhaka@mohona.com', password: 'manager@dhaka2026' },
    { name: 'Chattogram Manager', email: 'manager.chattogram@mohona.com', password: 'manager@chittagong2026' },
    { name: 'Mongla Manager', email: 'manager.mongla@mohona.com', password: 'manager@mongla2026' },
    { name: 'Bhola Manager', email: 'manager.bhola@mohona.com', password: 'manager@bhola2026' },
    { name: 'Patuakhali Manager', email: 'manager.patuakhali@mohona.com', password: 'manager@patuakhali2026' },
  ];

  for (let i = 0; i < managerDefs.length; i++) {
    const { name, email, password } = managerDefs[i];
    const outlet = createdOutlets[i];
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`   ⤷ Already exists: ${name} (${email})`);
    } else {
      const hashed = await bcrypt.hash(password, 12);
      await User.create({
        name,
        email,
        password: hashed,
        role: 'OUTLET_MANAGER',
        outletId: outlet._id,
        status: 'Active',
      });
      console.log(`   ✓ ${name} → ${outlet.name}`);
    }
  }

  console.log('\n🎉  Seed complete!\n');
  console.log('━'.repeat(50));
  console.log('Login credentials:');
  console.log('━'.repeat(50));
  console.log(`Super Admin: ${process.env.SUPER_ADMIN || 'mohona@gmail.com'}`);
  console.log(`Password:    ${process.env.SUPER_ADMIN_PASSWORD || 'mohona@2026'}`);
  console.log('━'.repeat(50));
  managerDefs.forEach((m, i) => {
    console.log(`${createdOutlets[i].name}`);
    console.log(`  Email: ${m.email}`);
    console.log(`  Pass:  ${m.password}`);
  });
  console.log('━'.repeat(50));

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌  Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
