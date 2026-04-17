"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function AddToCartSection({ title, price, image }: { title: string, price: number, image: string }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleAdd = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }

    addToCart({
      id: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      price,
      quantity: 1,
      size: selectedSize,
      image,
    });
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2 mb-8">
        {['S', 'M', 'L', 'XL'].map((size) => (
          <button 
            key={size} 
            onClick={() => setSelectedSize(size)}
            className={`border py-3 font-bold transition-colors ${
              selectedSize === size 
                ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]' 
                : 'border-[var(--color-border)] hover:border-[var(--foreground)]'
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      <button 
        onClick={handleAdd}
        className="w-full bg-[var(--foreground)] text-[var(--background)] py-4 font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity mb-4"
      >
        {selectedSize ? `Add ${selectedSize} To Cart` : 'Select Size To Add'}
      </button>
    </>
  );
}
