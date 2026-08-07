'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Mail, Phone, CheckCircle2, Circle, Package, Download, Edit, Plus, Trash2, Save, X, Search } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

export default function OrderDetailsPage() {
  const { order_number } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Add Product Search States
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductSearch, setShowProductSearch] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${order_number}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
          setEditedOrder(JSON.parse(JSON.stringify(data.data)));
        }
      } catch (error) {
        console.error('Failed to fetch order details', error);
      } finally {
        setLoading(false);
      }
    };
    if (order_number) fetchOrder();
  }, [order_number]);

  // Fetch products when entering edit mode
  useEffect(() => {
    if (isEditing && products.length === 0) {
      fetch('/api/products').then(res => res.json()).then(data => {
        if (data.success) setProducts(data.data);
      });
    }
  }, [isEditing]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f8b80]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Order not found</h2>
        <Link href="/admin/orders" className="text-[#0f8b80] hover:underline mt-4 inline-block">Return to Orders</Link>
      </div>
    );
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit
      setEditedOrder(JSON.parse(JSON.stringify(order))); // Reset to original
      setShowProductSearch(false);
    }
    setIsEditing(!isEditing);
  };

  const handleQuantityChange = (idx, delta) => {
    const newOrder = { ...editedOrder };
    const item = newOrder.items[idx];
    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) return; // don't go below 1

    item.quantity = newQuantity;
    recalculateTotals(newOrder);
  };

  const handleRemoveItem = (idx) => {
    const newOrder = { ...editedOrder };
    newOrder.items.splice(idx, 1);
    recalculateTotals(newOrder);
  };

  const handleAddProduct = (product) => {
    const newOrder = { ...editedOrder };

    // Check if product already in order
    const existingIdx = newOrder.items.findIndex(i => i.product_id === product._id);
    if (existingIdx >= 0) {
      newOrder.items[existingIdx].quantity += 1;
    } else {
      newOrder.items.push({
        product_id: product._id,
        name: product.name,
        price: product.unit_price || product.price || 0,
        quantity: 1,
        image: product.image_url || (product.product_images?.[0]) || null
      });
    }
    recalculateTotals(newOrder);
    setSearchQuery('');
    setShowProductSearch(false);
  };

  const recalculateTotals = (newOrder) => {
    const newSubtotal = newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    newOrder.subtotal = newSubtotal;
    newOrder.total_amount = newSubtotal + newOrder.shipping_cost;
    setEditedOrder(newOrder);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/orders/${order_number}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: editedOrder.items,
          subtotal: editedOrder.subtotal,
          total_amount: editedOrder.total_amount,
          shipping_cost: editedOrder.shipping_cost,
          tracking_number: editedOrder.tracking_number,
          courier_name: editedOrder.courier_name
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
        setEditedOrder(JSON.parse(JSON.stringify(data.data)));
        setIsEditing(false);
        Swal.fire({ icon: 'success', title: 'Saved!', text: 'Order updated successfully.', timer: 1500, showConfirmButton: false });
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  // We use editedOrder when editing, otherwise use original order
  const displayOrder = isEditing ? editedOrder : order;

  // Derived values
  const totalItems = displayOrder.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Dummy data for VAT and Discount as requested in screenshot
  const subTotal = displayOrder.subtotal || displayOrder.total_amount;
  const vat = subTotal * 0.15; // 15% dummy VAT instead of 40% to be realistic
  const discount = 0;
  const shipping = displayOrder.shipping_cost || 0;
  const finalTotal = displayOrder.total_amount;

  const downloadInvoice = async () => {
    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 139, 128); // #0f8b80
    doc.text('MOHONA', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Invoice for Order: ' + (displayOrder.order_number || displayOrder._id), 14, 28);
    doc.text('Date: ' + (displayOrder.createdAt ? format(new Date(displayOrder.createdAt), 'dd MMM yyyy, hh:mm a') : 'Unknown'), 14, 34);
    
    // Customer Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Billed To:', 14, 45);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(displayOrder.customer_name || 'N/A', 14, 52);
    doc.text(displayOrder.email || 'N/A', 14, 58);
    doc.text(displayOrder.contact_number || 'N/A', 14, 64);
    doc.text(displayOrder.address || 'N/A', 14, 70);

    // Items Table
    const tableColumn = ["Product Name", "Quantity", "Unit Price", "Total"];
    const tableRows = [];

    displayOrder.items?.forEach(item => {
      const itemData = [
        item.name,
        item.quantity.toString(),
        `BDT ${item.price?.toFixed(2)}`,
        `BDT ${(item.price * item.quantity).toFixed(2)}`
      ];
      tableRows.push(itemData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 80,
      theme: 'grid',
      headStyles: { fillColor: [15, 139, 128], textColor: 255 },
      styles: { fontSize: 9 },
    });

    // Totals
    const finalY = doc.lastAutoTable?.finalY || 80;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Subtotal: BDT ${subTotal.toFixed(2)}`, 140, finalY + 12);
    doc.text(`Shipping: BDT ${shipping.toFixed(2)}`, 140, finalY + 18);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: BDT ${finalTotal.toFixed(2)}`, 140, finalY + 26);

    // Save
    doc.save(`Invoice_${displayOrder.order_number || displayOrder._id}.pdf`);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  return (
    <div className="container mx-auto p-2 sm:p-6 min-h-[calc(100vh-120px)] w-full max-w-full animate-in fade-in duration-500 font-sans">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Details</h1>
        </div>
        <div className="flex gap-3">
          {!isEditing && (
            <button onClick={downloadInvoice} className="px-5 py-2 text-sm font-bold border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Download size={16} /> Export
            </button>
          )}

          {isEditing ? (
            <>
              <button onClick={handleEditToggle} className="px-5 py-2 text-sm font-bold border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <X size={16} /> Cancel
              </button>
              <button onClick={handleSaveChanges} disabled={isSaving} className="px-5 py-2 text-sm font-bold bg-[#0f8b80] text-white rounded-full hover:bg-[#0d7a70] flex items-center gap-2 disabled:opacity-50 transition-colors shadow-lg shadow-teal-500/30">
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button onClick={handleEditToggle} className="px-5 py-2 text-sm font-bold bg-slate-900 text-white rounded-full hover:bg-slate-800 flex items-center gap-2 transition-colors shadow-lg shadow-slate-900/20">
              <Edit size={16} /> Edit Order
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Order Information</h2>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-gray-900">{displayOrder.order_number || `#${displayOrder._id?.slice(-5).toUpperCase()}`}</h3>
          <div className="flex gap-2">
            <span className={`px-4 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${displayOrder.payment_status === 'Paid' ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-amber-500 text-amber-600 bg-amber-50'}`}>
              {displayOrder.payment_status || 'PENDING'}
            </span>
            <span className="px-4 py-1 text-xs font-bold rounded-full bg-[#dcfce7] text-emerald-700 uppercase tracking-wider">
              {displayOrder.status || 'PROCESSING'}
            </span>
          </div>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#ccfbf1] p-6 rounded-2xl">
            <div className="text-[11px] font-bold text-teal-800/60 uppercase tracking-wider mb-2">Order Date</div>
            <div className="text-lg font-bold text-teal-950">
              {displayOrder.createdAt ? format(new Date(displayOrder.createdAt), 'dd MMM, yyyy') : 'Unknown'}
            </div>
          </div>
          <div className="bg-[#fce7f3] p-6 rounded-2xl">
            <div className="text-[11px] font-bold text-pink-800/60 uppercase tracking-wider mb-2">Total Items</div>
            <div className="text-lg font-bold text-pink-950">{totalItems} pcs</div>
          </div>
          <div className="bg-[#dcfce7] p-6 rounded-2xl">
            <div className="text-[11px] font-bold text-emerald-800/60 uppercase tracking-wider mb-2">Delivery Date</div>
            <div className="text-lg font-bold text-emerald-950">
              {displayOrder.createdAt ? format(new Date(new Date(displayOrder.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000), 'dd MMM, yyyy') : 'Unknown'}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-8">

            {/* Items Table */}
            <div className="border border-gray-100 rounded-2xl overflow-visible bg-white">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Order Items</h2>
                {isEditing && (
                  <button onClick={() => setShowProductSearch(!showProductSearch)} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-sm">
                    <Plus size={14} /> Add Product
                  </button>
                )}
              </div>

              {/* Add Product Search Dropdown */}
              {showProductSearch && isEditing && (
                <div className="p-4 bg-gray-50 border-b border-gray-100 relative">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search product by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#0f8b80] focus:ring-1 focus:ring-[#0f8b80]"
                    />
                  </div>
                  {searchQuery && (
                    <div className="absolute z-10 left-4 right-4 mt-1 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                      {filteredProducts.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center font-medium">No products found.</div>
                      ) : (
                        filteredProducts.map(p => (
                          <div key={p._id} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <img src={p.image_url || (p.product_images?.[0]) || 'https://via.placeholder.com/30'} className="w-8 h-8 rounded object-contain p-2 border border-gray-200" />
                              <div>
                                <div className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</div>
                                <div className="text-xs font-medium text-gray-500">BDT {p.unit_price || p.price}</div>
                              </div>
                            </div>
                            <button onClick={() => handleAddProduct(p)} className="px-3 py-1.5 bg-[#0f8b80] text-white text-xs font-bold rounded-lg hover:bg-[#0d7a70] shadow-sm">
                              Add
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] uppercase tracking-wider font-bold text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Product Name</th>
                      <th className="px-4 py-4 text-center">Items</th>
                      <th className="px-4 py-4 text-right">Price</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {displayOrder.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="w-10 h-10 rounded-lg object-contain p-2 border border-gray-100" />
                            <div>
                              <div className="font-bold text-gray-900">{item.name}</div>
                              <div className="text-[10px] text-gray-500 font-medium">ID: #{item.product_id?.slice(-5).toUpperCase() || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-3">
                              <button onClick={() => handleQuantityChange(idx, -1)} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 font-bold hover:bg-gray-200 transition-colors">-</button>
                              <span className="font-bold text-gray-900 w-4">{item.quantity}</span>
                              <button onClick={() => handleQuantityChange(idx, 1)} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 font-bold hover:bg-gray-200 transition-colors">+</button>
                            </div>
                          ) : (
                            <span className="font-bold text-gray-700">{item.quantity}</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-gray-900">BDT {item.price?.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">
                          {isEditing ? (
                            <button onClick={() => handleRemoveItem(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex justify-center items-center">
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <button className="px-3 py-1 border border-gray-200 text-gray-500 text-[11px] font-bold rounded-full hover:bg-gray-50 transition-colors uppercase tracking-wider">
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {displayOrder.items?.length === 0 && (
                      <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500 font-medium">No items in this order.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h2>
              <div className="border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-white">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayOrder.customer_name || 'Customer')}&background=0f8b80&color=fff&size=80`} alt="Avatar" className="w-20 h-20 rounded-2xl shadow-sm" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{displayOrder.customer_name}</h3>
                  <div className="flex flex-wrap gap-4 md:gap-8 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-2"><Mail size={16} className="text-gray-400" /> {displayOrder.email}</div>
                    <div className="flex items-center gap-2"><Phone size={16} className="text-gray-400" /> {displayOrder.contact_number}</div>
                    <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {displayOrder.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Tracking */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Tracking</h2>
              <div className="border border-gray-100 rounded-2xl p-6 bg-white">

                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Courier Name</label>
                      <input
                        type="text"
                        value={editedOrder.courier_name || ''}
                        onChange={(e) => setEditedOrder({ ...editedOrder, courier_name: e.target.value })}
                        placeholder="e.g. RedX, Pathao"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0f8b80] font-medium text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Tracking Number</label>
                      <input
                        type="text"
                        value={editedOrder.tracking_number || ''}
                        onChange={(e) => setEditedOrder({ ...editedOrder, tracking_number: e.target.value })}
                        placeholder="e.g. RX123456789"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0f8b80] font-medium text-gray-900"
                      />
                    </div>
                  </div>
                ) : (
                  (displayOrder.courier_name || displayOrder.tracking_number) && (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-6">
                      {displayOrder.courier_name && (
                        <div>
                          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Courier</div>
                          <div className="font-bold text-gray-900">{displayOrder.courier_name}</div>
                        </div>
                      )}
                      {displayOrder.tracking_number && (
                        <div>
                          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tracking ID</div>
                          <div className="font-bold text-gray-900 tracking-wide">{displayOrder.tracking_number}</div>
                        </div>
                      )}
                    </div>
                  )
                )}

                <div className="relative pl-8 flex flex-col gap-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">

                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[35px] top-0 bg-white">
                      <CheckCircle2 size={24} className="text-[#0f8b80] fill-[#0f8b80]/10" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <div className="font-bold text-gray-900">Order Placed</div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">Confirmed by System</div>
                      </div>
                      <div className="text-[11px] font-bold text-gray-400">
                        {displayOrder.createdAt ? format(new Date(displayOrder.createdAt), 'MMM dd, yyyy, hh:mm a') : ''}
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-[35px] top-0 bg-white">
                      {displayOrder.status !== 'Pending' ? <CheckCircle2 size={24} className="text-[#0f8b80] fill-[#0f8b80]/10" /> : <Circle size={24} className="text-gray-300 fill-white" />}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <div className="font-bold text-gray-900">Processing & Packed</div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">Preparing for shipment</div>
                      </div>
                      <div className="text-[11px] font-bold text-gray-400">Pending</div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className="absolute -left-[35px] top-0 bg-white">
                      {['Shipped', 'Delivered'].includes(displayOrder.status) ? <CheckCircle2 size={24} className="text-[#0f8b80] fill-[#0f8b80]/10" /> : <Circle size={24} className="text-gray-300 fill-white" />}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <div className="font-bold text-gray-900">Shipped</div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">Handed over to courier</div>
                      </div>
                      <div className="text-[11px] font-bold text-gray-400">Pending</div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div className="absolute -left-[35px] top-0 bg-white">
                      {displayOrder.status === 'Delivered' ? <CheckCircle2 size={24} className="text-[#0f8b80] fill-[#0f8b80]/10" /> : <Circle size={24} className="text-gray-300 fill-white" />}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <div className="font-bold text-gray-900">Delivered</div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">Received by customer</div>
                      </div>
                      <div className="text-[11px] font-bold text-gray-400">Pending</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-[#fef08a] rounded-2xl p-6 sticky top-6 shadow-sm border border-yellow-200/50">
              <h2 className="text-lg font-bold text-yellow-950 mb-6">Order Summary</h2>

              <div className="flex flex-col gap-4 text-sm font-medium text-yellow-900/80 border-b border-yellow-900/10 pb-6 mb-6">
                <div className="flex justify-between">
                  <span>Sub-Total</span>
                  <span className="font-bold text-yellow-950">BDT {subTotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (15%)</span>
                  <span className="font-bold text-yellow-950">BDT {vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="font-bold text-yellow-950">-BDT {discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipment</span>
                  <span className="font-bold text-yellow-950">BDT {shipping?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-bold text-yellow-950">BDT 0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <span className="text-lg font-bold text-yellow-950">Total</span>
                <span className="text-2xl font-black text-yellow-950">BDT {finalTotal?.toFixed(2)}</span>
              </div>

              <div className="bg-white/60 rounded-xl p-4 flex justify-between items-center">
                <span className="text-[13px] font-bold text-yellow-950">Paid via {displayOrder.payment_method || 'System'}</span>
                {displayOrder.payment_method === 'Bkash' ? (
                  <span className="font-black text-pink-600 text-[13px]">bKash</span>
                ) : (
                  <Package size={20} className="text-yellow-700" />
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
