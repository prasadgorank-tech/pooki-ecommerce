"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  appliedCoupon: any | null;
  applyCoupon: (coupon: any) => void;
  removeCoupon: () => void;
  discountAmount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existing) {
        return prev.map((i) => 
          i.id === item.id && i.size === item.size 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const applyCoupon = (coupon: any) => setAppliedCoupon(coupon);
  const removeCoupon = () => setAppliedCoupon(null);

  const discountAmount = appliedCoupon ? (
    appliedCoupon.discount_type === 'percentage' 
      ? (cartTotal * appliedCoupon.discount_value) / 100
      : appliedCoupon.discount_value
  ) : 0;

  return (
    <CartContext.Provider value={{ 
      items, addToCart, removeFromCart, isCartOpen, setIsCartOpen, 
      cartTotal, appliedCoupon, applyCoupon, removeCoupon, discountAmount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
