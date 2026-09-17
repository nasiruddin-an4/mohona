import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Journal from '@/models/Journal';
import { ChevronLeft, Calendar, User } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Use force-dynamic or revalidate to ensure fresh data
export const revalidate = 60; // revalidate every minute

async function getJournal(slug) {
  await connectDB();
  const journal = await Journal.findOne({ slug, status: 'Publish' });
  
  if (!journal) {
    return null;
  }
  
  // Return plain JS object
  return {
    _id: journal._id.toString(),
    title: journal.title,
    content: journal.content,
    author: journal.author,
    image_url: journal.image_url,
    publishedAt: journal.publishedAt ? journal.publishedAt.toISOString() : journal.createdAt.toISOString(),
  };
}

export default async function JournalPage({ params }) {
  const resolvedParams = await params;
  const journal = await getJournal(resolvedParams.slug);

  if (!journal) {
    notFound();
  }

  const formattedDate = new Date(journal.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="min-h-screen bg-[#fdfdfd] flex flex-col">
      <Navbar />
      
      <article className="flex-grow pt-24 pb-16">
        {/* Header Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Link 
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors mb-8"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>

          <div className="space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              {journal.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-1.5">
                <User size={16} />
                <span>{journal.author || 'Admin'}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <time dateTime={journal.publishedAt}>{formattedDate}</time>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {journal.image_url && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mb-12">
            <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-md">
              <img 
                src={journal.image_url} 
                alt={journal.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div 
            className="prose prose-lg prose-slate max-w-none 
              prose-headings:font-bold prose-headings:text-slate-900
              prose-a:text-orange-500 hover:prose-a:text-orange-600
              prose-img:rounded-xl prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: journal.content }}
          />
        </div>
      </article>

      <Footer />
    </main>
  );
}
