import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      shippingCost: 5,
      setShippingCost: (cost) => set({ shippingCost: cost }),
      addItem: (product, quantity = 1, demandDate = null) => {
        const currentItems = get().items;
        const getProductId = (p) => p._id || p.product_id || p.id;
        const newProductId = getProductId(product);
        
        const existingItem = currentItems.find(
          (item) => getProductId(item.product) === newProductId && item.product.selected_unit === product.selected_unit
        );

        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + quantity,
            product.max_order_qty || Infinity
          );
          
          set({
            items: currentItems.map((item) =>
              getProductId(item.product) === newProductId && item.product.selected_unit === product.selected_unit
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
        } else {
          const initialQuantity = Math.max(quantity, product.moq || 1);
          set({ items: [...currentItems, { product, quantity: initialQuantity, demandDate }] });
        }
      },
      removeItem: (productId, selectedUnit) => {
        const getProductId = (p) => p._id || p.product_id || p.id;
        set({
          items: get().items.filter(
            (item) => !(getProductId(item.product) === productId && item.product.selected_unit === selectedUnit)
          ),
        });
      },
      updateQuantity: (productId, selectedUnit, quantity) => {
        const getProductId = (p) => p._id || p.product_id || p.id;
        if (quantity <= 0) {
          get().removeItem(productId, selectedUnit);
          return;
        }
        
        set({
          items: get().items.map((item) => {
            if (getProductId(item.product) === productId && item.product.selected_unit === selectedUnit) {
               const maxAllowed = item.product.max_order_qty || Infinity;
               const minAllowed = item.product.moq || 1;
               const safeQuantity = Math.max(minAllowed, Math.min(quantity, maxAllowed));
               return { ...item, quantity: safeQuantity };
            }
            return item;
          }),
        });
      },
      clearCart: () => set({ items: [], shippingCost: 5 }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + (item.product.unit_price || item.product.price || 0) * item.quantity, 0);
      },
    }),
    {
      name: 'betopia-daily-cart',
    }
  )
);

