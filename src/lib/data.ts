export type Product = {
  id: string;
  name: string;
  fit: string;
  price: number;
  image: string;
  category: string;
};

export const products: Product[] = [
  { id: 'heavyweight-oversized-tee-black', name: 'Heavyweight Oversized Tee (Black)', fit: 'Oversized', price: 1499, image: '/images/product1.png', category: 'Tees' },
  { id: 'utility-cargo-charcoal', name: 'Utility Cargo Pants (Charcoal)', fit: 'Baggy', price: 2999, image: '/images/product2.png', category: 'Bottoms' },
  { id: 'minimal-slim-denim-black', name: 'Minimal Slim Denim (Black Wash)', fit: 'Slim', price: 3499, image: '/images/product3.png', category: 'Bottoms' },
  { id: 'heavyweight-oversized-tee-white', name: 'Heavyweight Oversized Tee (White)', fit: 'Oversized', price: 1499, image: '/images/product4.png', category: 'Tees' },
  { id: 'track-jacket-obsidian', name: 'Nylon Track Jacket (Obsidian)', fit: 'Baggy', price: 4599, image: '/images/hero.png', category: 'Outerwear' },
  { id: 'relaxed-fit-hoodie-ash', name: 'Relaxed Fit Hoodie (Ash Grey)', fit: 'Oversized', price: 2499, image: '/images/product4.png', category: 'Fleece' },
  { id: 'pleated-trousers-sand', name: 'Pleated Wide Trousers (Sand)', fit: 'Baggy', price: 3299, image: '/images/product2.png', category: 'Bottoms' },
  { id: 'essential-slim-tee-bone', name: 'Essential Slim Tee (Bone)', fit: 'Slim', price: 999, image: '/images/product1.png', category: 'Tees' },
  { id: 'heavy-weight-sweatpants-black', name: 'Heavyweight Sweatpants (Black)', fit: 'Oversized', price: 2199, image: '/images/product2.png', category: 'Bottoms' },
  { id: 'cropped-puffer-jacket-onyx', name: 'Cropped Puffer Jacket (Onyx)', fit: 'Regular', price: 5999, image: '/images/hero.png', category: 'Outerwear' },
  { id: 'boxy-flannel-shirt-rust', name: 'Boxy Fit Flannel (Rust)', fit: 'Oversized', price: 2799, image: '/images/product1.png', category: 'Tops' },
  { id: 'parashute-pants-olive', name: 'Parachute Pants (Olive Green)', fit: 'Baggy', price: 3199, image: '/images/product2.png', category: 'Bottoms' },
  { id: 'slim-zip-hoodie-slate', name: 'Slim Zip Hoodie (Slate)', fit: 'Slim', price: 2299, image: '/images/product4.png', category: 'Fleece' },
  { id: 'structured-coach-jacket-navy', name: 'Structured Coach Jacket (Navy)', fit: 'Regular', price: 3999, image: '/images/hero.png', category: 'Outerwear' },
  { id: 'baggy-denim-ice-blue', name: 'Baggy Denim (Ice Blue)', fit: 'Baggy', price: 3599, image: '/images/product3.png', category: 'Bottoms' }
];
