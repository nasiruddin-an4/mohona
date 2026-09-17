'use client';

import React, { useState, useEffect, use } from 'react';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import ImageUploader from '../../components/ImageUploader';

export default function EditJournalPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    slug: '',
    author: 'Admin',
    image_url: '',
    status: 'Draft',
    content: ''
  });

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const res = await fetch(`/api/journals/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success) {
          setForm({
            title: data.data.title || '',
            slug: data.data.slug || '',
            author: data.data.author || 'Admin',
            image_url: data.data.image_url || '',
            status: data.data.status || 'Draft',
            content: data.data.content || ''
          });
        } else {
          Swal.fire('Error', 'Journal not found', 'error');
          router.push('/admin/journals');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (resolvedParams.id) {
      fetchJournal();
    }
  }, [resolvedParams.id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      Swal.fire('Error', 'Title and content are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/journals/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (data.success) {
        Swal.fire('Success', 'Journal updated successfully', 'success');
        router.push('/admin/journals');
      } else {
        Swal.fire('Error', data.error || 'Failed to update journal', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Network error', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/journals" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Journal</h1>
            <p className="text-sm text-gray-500 mt-1">Update existing blog post</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium text-sm disabled:opacity-70"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="E.g., 5 Summer Fashion Trends"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Slug</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="Leave empty to auto-generate"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Unique URL identifier (e.g. 5-summer-fashion-trends)</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Content *</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your journal content here (HTML supported)..."
                rows="15"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 transition-colors font-mono text-sm"
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Sidebar Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 transition-colors"
              >
                <option value="Draft">Draft</option>
                <option value="Publish">Publish</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Admin"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 transition-colors"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-bold text-gray-900 mb-4">Featured Image</label>
            <ImageUploader 
              value={form.image_url}
              onChange={(url) => setForm(prev => ({ ...prev, image_url: url }))}
              folder="journals"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
