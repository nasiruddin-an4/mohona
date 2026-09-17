const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Outlet = mongoose.model('Outlet', new mongoose.Schema({ name: String, slug: String }));
  const outlets = await Outlet.find({}, 'name slug');
  console.log(outlets);
  process.exit();
});
