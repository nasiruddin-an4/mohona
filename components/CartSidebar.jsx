"use client";

import React from "react";
import { X, Pencil, Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useRouter } from "next/navigation";

export default function CartSidebar({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getCartTotal();
  const total = subtotal; // Shipping calculated during checkout

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[90%] sm:w-full max-w-[420px] bg-white shadow-2xl z-[101] transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close Button Inside */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors z-10"
        >
          <X size={24} strokeWidth={1.5} />
        </button>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="px-6 sm:px-8 pt-8 pb-4 flex-shrink-0">
            <h2 className="text-[28px] font-serif text-gray-800 font-medium">Shopping cart</h2>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 custom-scrollbar pb-8 min-h-0">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <p>Your cart is empty.</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-6 mt-4">
                {items.map((item) => (
                  <div key={`${item.product._id || item.product.product_id || item.product.id}-${item.product.selected_unit || 'default'}`} className="flex gap-4 items-start">
                    {/* Item Image */}
                    <div className="w-20 shrink-0">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-auto object-contain p-2"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col pt-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-[14px] text-gray-800 font-medium leading-snug pr-2">{item.product.name}</h4>
                        <span className="text-[14px] text-gray-800 font-medium whitespace-nowrap">৳ {item.product.unit_price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-end mt-auto">
                        <div className="text-[12px] text-gray-400 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span>Qty</span>
                            <div className="flex items-center bg-gray-50 rounded px-1.5 py-0.5 border border-gray-100">
                              <button onClick={() => updateQuantity(item.product._id || item.product.product_id || item.product.id, item.product.selected_unit, item.quantity - 1)} className="text-gray-400 hover:text-black">
                                <Minus size={12} strokeWidth={3} />
                              </button>
                              <span className="w-5 text-center text-[11px] font-bold text-gray-900">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product._id || item.product.product_id || item.product.id, item.product.selected_unit, item.quantity + 1)} className="text-gray-400 hover:text-black">
                                <Plus size={12} strokeWidth={3} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 text-[11px] text-gray-400">
                          <button onClick={() => removeItem(item.product._id || item.product.product_id || item.product.id, item.product.selected_unit)} className="flex items-center gap-2 hover:text-red-500 transition-colors">
                            Remove <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Summary */}
          <div className="bg-[#f4f4f4] px-6 sm:px-8 py-5 flex-shrink-0 flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <span className="text-[18px] font-bold text-gray-800 ">Total</span>
              <span className="text-[28px] font-bold text-gray-800">৳{total.toFixed(2)}</span>
            </div>

            <div className="flex justify-end mt-2">
              <button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="bg-[#2f2f2f] hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[13px] px-12 py-4 tracking-wide transition-colors w-full font-bold"
              >
                CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
