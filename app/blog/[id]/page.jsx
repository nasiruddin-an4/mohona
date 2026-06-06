import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowLeft, Clock, Tag, User, Share2 } from 'lucide-react';

// Mock data (same as the listing page)
const posts = [
  {
    id: 1,
    title: "The Art of Local Craftsmanship",
    excerpt: "Discover the intricate details and dedication behind our locally sourced handcrafted items that bring warmth to every home.",
    content: `
      <p class="mb-4">Handcrafted items have a soul that mass-produced products simply cannot replicate. Each piece tells a story of the artisan who spent hours, sometimes days, perfecting every detail.</p>
      <p class="mb-4">At Mohona, we believe in preserving these traditional techniques while giving them a modern touch. Our artisans come from various regions, bringing their unique heritage and skills to create items that truly stand out.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4">Why Choose Handmade?</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Uniqueness:</strong> No two handmade items are exactly alike.</li>
        <li><strong>Quality:</strong> Artisans use premium materials and pay close attention to durability.</li>
        <li><strong>Sustainability:</strong> Supporting local crafts reduces the carbon footprint associated with global manufacturing.</li>
      </ul>
      <p class="mb-4">Next time you decorate your home, consider adding a piece of local craftsmanship. It's not just a decoration; it's a piece of art.</p>
    `,
    date: "Oct 15, 2025",
    author: "Fatima Rahman",
    readTime: "4 min read",
    category: "Crafts",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Decorating Your Home for the Festive Season",
    excerpt: "A complete guide on how to utilize Mohona's exclusive decor collection to transform your living space this upcoming holiday season.",
    content: `
      <p class="mb-4">The festive season is a time of joy, family gatherings, and beautiful home decorations. Transforming your living space can seem daunting, but with the right pieces, it can be a delightful experience.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4">Start with a Theme</h3>
      <p class="mb-4">Before buying any decorations, decide on a theme. Whether it's rustic elegance, modern minimalism, or traditional vibrancy, having a cohesive look will make your space feel professionally styled.</p>
      <p class="mb-4">Mohona's exclusive decor collection offers versatile pieces that fit seamlessly into any theme. Use our handcrafted lamps for warm lighting, and our intricately woven rugs to add texture to your floors.</p>
    `,
    date: "Sep 28, 2025",
    author: "Ahmed Hassan",
    readTime: "5 min read",
    category: "Home Decor",
    image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Supporting Coast Guard Families",
    excerpt: "Learn how every purchase from Mohona directly contributes to the welfare of Bangladesh Coast Guard families.",
    content: `
      <p class="mb-4">Mohona is more than just a brand; it's a community initiative. Operated under the supervision of the Bangladesh Coast Guard Family Welfare Association, our mission extends beyond providing quality products.</p>
      <p class="mb-4">Every purchase you make directly supports the families of our brave Coast Guard personnel. The revenue generated helps fund educational programs, healthcare initiatives, and skill development workshops for family members.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4">Empowering Through Craft</h3>
      <p class="mb-4">We also provide training to family members, enabling them to become skilled artisans. This not only offers them a sustainable livelihood but also preserves local crafting traditions.</p>
      <p class="mb-4">Thank you for being a part of this journey. Your support makes a real difference.</p>
    `,
    date: "Sep 10, 2025",
    author: "Mohona Team",
    readTime: "3 min read",
    category: "Community",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Winter Collection",
    excerpt: "Discover our latest winter collection featuring warm, stylish, and comfortable clothing perfect for the colder months.",
    content: `
      <p class="mb-4">As the temperatures drop, it's time to embrace the warmth and style of our new Winter Collection. We've curated a selection of cozy, comfortable, and elegant pieces that will keep you looking and feeling great all season long.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4">Stay Warm in Style</h3>
      <p class="mb-4">Our winter garments are crafted with high-quality materials to ensure maximum insulation without sacrificing mobility or aesthetics. From chunky knit sweaters to elegant outerwear, there's something for everyone.</p>
    `,
    date: "Oct 28, 2025",
    author: "Mohona Team",
    readTime: "3 min read",
    category: "Winter",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop"
  }
];

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = posts.find(p => p.id === parseInt(id));
  
  if (!post) {
    return {
      title: 'Post Not Found - Mohona'
    };
  }

  return {
    title: `${post.title} - Mohona Blog`,
    description: post.excerpt,
  };
}

export default async function BlogDetails({ params }) {
  const { id } = await params;
  const post = posts.find(p => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog" className="text-[#49447b] font-bold hover:underline flex items-center justify-center">
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-1 flex flex-col">
        {/* Article Header */}
        <div className="bg-white pt-32 pb-12 px-4 border-b border-gray-100">
          <div className="container mx-auto max-w-4xl">
            <Link href="/blog" className="inline-flex items-center text-sm font-bold text-[#49447b] hover:text-[#7f6580] transition-colors mb-8 group">
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to all posts
            </Link>

            <div className="mb-6 flex items-center gap-3">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {post.category}
              </span>
              <span className="text-gray-400 text-sm flex items-center">
                <Clock size={14} className="mr-1" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-gray-100 mt-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-4 shrink-0 overflow-hidden">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{post.author}</h4>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {post.date}
                  </p>
                </div>
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-sm font-bold transition-colors">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="py-12 px-4 bg-white flex-1">
          <div className="container mx-auto max-w-4xl">
            {/* Featured Image */}
            <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-16 shadow-lg">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Prose */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[#49447b]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Article Footer */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-600 bg-gray-50 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">#{post.category.toLowerCase().replace(' ', '')}</span>
                <span className="text-sm font-bold text-gray-600 bg-gray-50 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">#mohona</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
