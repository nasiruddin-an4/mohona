'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Eye, Trash2, Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Swal from 'sweetalert2';
import StatusDropdown from '../../components/StatusDropdown';

export default function ProductReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [dateSort, setDateSort] = useState('newest');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.map(r => r._id === id ? { ...r, status: newStatus } : r));
      } else {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to update status', confirmButtonColor: '#0f8b80' });
      }
    } catch (error) {
      console.error('Failed to toggle status', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'An error occurred', confirmButtonColor: '#0f8b80' });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setReviews(reviews.filter(r => r._id !== id));
        await Swal.fire({ title: 'Deleted!', text: 'Review has been deleted.', icon: 'success', confirmButtonColor: '#0f8b80' });
      } else {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to delete review', confirmButtonColor: '#0f8b80' });
      }
    } catch (error) {
      console.error('Failed to delete review', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'An error occurred while deleting', confirmButtonColor: '#0f8b80' });
    }
  };

  // Filter and Sort
  let filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      (r.user_name || '').toLowerCase().includes(search.toLowerCase()) || 
      (r.review_text || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.product_id?.name || '').toLowerCase().includes(search.toLowerCase());
      
    const matchesRating = ratingFilter ? r.rating === Number(ratingFilter) : true;
    
    return matchesSearch && matchesRating;
  });

  if (dateSort === 'newest') {
    filteredReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (dateSort === 'oldest') {
    filteredReviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] bg-white w-full max-w-full animate-in fade-in duration-500 flex flex-col font-sans">
      
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Review</h1>
      </div>

      <div className="bg-white flex-1 flex flex-col">
        {/* Filters Bar */}
        <div className="pb-4 mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0f8b80]/20 transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="relative">
              <select 
                value={ratingFilter}
                onChange={(e) => { setRatingFilter(e.target.value); setCurrentPage(1); }}
                className="appearance-none bg-gray-50 border border-gray-100 rounded-full px-5 py-2.5 pr-10 text-[13px] font-medium text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select 
                value={dateSort}
                onChange={(e) => { setDateSort(e.target.value); setCurrentPage(1); }}
                className="appearance-none bg-gray-50 border border-gray-100 rounded-full px-5 py-2.5 pr-10 text-[13px] font-medium text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table Area */}
        {loading ? (
          <div className="flex justify-center items-center h-64 flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1 min-h-[300px]">
            <table className="w-full text-left text-[13px] whitespace-nowrap">
              <thead>
                <tr className="text-gray-900 font-bold border-b border-gray-100 border-t">
                  <th className="px-6 py-4 w-12">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0f8b80] focus:ring-[#0f8b80]" />
                  </th>
                  <th className="px-4 py-4">ID</th>
                  <th className="px-4 py-4">Product</th>
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">Review</th>
                  <th className="px-4 py-4">Rating</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedReviews.length > 0 ? (
                  paginatedReviews.map((review) => {
                    const dateObj = new Date(review.createdAt || Date.now());
                    const formattedDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                    const productImg = (review.product_id?.product_images?.length > 0 ? review.product_id.product_images[0] : null) || review.product_id?.image_url || review.product_id?.cover_image;

                    return (
                      <tr key={review._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0f8b80] focus:ring-[#0f8b80]" />
                        </td>
                        <td className="px-4 py-4 text-gray-500">
                          #{review._id.slice(-5)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-0.5 bg-white">
                              {productImg ? (
                                <img src={productImg} alt={review.product_id?.name || 'Product'} className="w-full h-full object-cover rounded-md" />
                              ) : (
                                <div className="w-full h-full bg-gray-100 rounded-md"></div>
                              )}
                            </div>
                            <span className="font-medium text-gray-700">{review.product_id?.name || 'Unknown Product'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-500">{review.user_name}</td>
                        <td className="px-4 py-4 text-gray-500 max-w-[200px] truncate" title={review.review_text}>{review.review_text}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star 
                                key={star} 
                                size={14} 
                                className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} 
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-500">{formattedDate}</td>
                        <td className="px-4 py-4">
                          <StatusDropdown
                            value={review.status || 'Published'}
                            options={['Published', 'Hidden']}
                            onChange={(newStatus) => handleToggleStatus(review._id, newStatus)}
                            getStyle={(val) => val === 'Published' ? 'bg-[#e2f5f3] text-[#0f8b80] border-transparent' : 'bg-gray-100 text-gray-600 border-gray-200'}
                            roundedStyle="rounded-full"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-4 text-gray-500">
                            <button onClick={() => setSelectedReview(review)} className="hover:text-gray-900 transition-colors" title="View Review">
                              <Eye size={16} strokeWidth={2} />
                            </button>
                            <button onClick={() => handleDelete(review._id)} className="hover:text-red-600 transition-colors" title="Delete">
                              <Trash2 size={16} strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-gray-500">
                      No reviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 0 && (
          <div className="pt-6 flex justify-end">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-[13px] transition-colors ${
                    currentPage === page 
                      ? 'bg-[#dcfce7] text-green-700 font-bold' 
                      : 'font-medium text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Review Details</h3>
              <button 
                onClick={() => setSelectedReview(null)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                <div className="w-16 h-16 rounded-xl border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-1 bg-white">
                  {(() => {
                    const img = (selectedReview.product_id?.product_images?.length > 0 ? selectedReview.product_id.product_images[0] : null) || selectedReview.product_id?.image_url || selectedReview.product_id?.cover_image;
                    return img ? (
                      <img src={img} alt={selectedReview.product_id?.name || 'Product'} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg"></div>
                    );
                  })()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{selectedReview.product_id?.name || 'Unknown Product'}</h4>
                  <p className="text-sm text-gray-500">Product ID: #{selectedReview.product_id?._id?.slice(-6) || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Customer</label>
                  <p className="text-gray-900 font-medium">{selectedReview.user_name}</p>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Status</label>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${selectedReview.status === 'Hidden' ? 'bg-gray-100 text-gray-600' : 'bg-[#e2f5f3] text-[#0f8b80]'}`}>
                    {selectedReview.status || 'Published'}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          size={16} 
                          className={star <= selectedReview.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} 
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Date</label>
                    <p className="text-gray-900 text-sm">
                      {new Date(selectedReview.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Review Content</label>
                  <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm leading-relaxed">
                    {selectedReview.review_text}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedReview(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full text-sm font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
