import Link from "next/link";

export default function Footer() {
  const categories = [
    { title: "TOP CATEGORIES", items: ["T-shirts", "Shirts", "Joggers", "Shorts", "Trousers", "Sweatshirts & Hoodies", "Sweaters"] },
    { title: "POPULAR SEARCHES", items: ["shirts for men", "jackets for men", "t-shirts for men", "cargo", "baggy jeans", "mens jeans", "polo t-shirts"] },
    { title: "MOST POPULAR ACCESSORIES", items: ["Ravenwood Braided Bracelet", "EternaWrap Black Bracelet", "Obsidian Blue Braided Bracelet", "Rustic Revolve Brown Bracelet", "Divine Skull Cross Chain", "Bar of Luxe Chain", "Rogue Bullet Pendant"] },
  ];

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--background)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-lg font-black uppercase tracking-tighter mb-8">More about shopping At Pooki</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-10">
            {categories.map((cat) => (
              <div key={cat.title}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-muted)] mb-6">{cat.title}</h3>
                <ul className="space-y-3">
                  {cat.items.map((item) => (
                    <li key={item}>
                      <Link 
                        href={`/collections/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                        className="text-[11px] font-medium text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors inline-block"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Support / Company Section */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-muted)] mb-6">SUPPORT & INFO</h3>
              <ul className="space-y-3">
                <li><Link href="/faq" className="text-[11px] font-medium text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors">FAQ</Link></li>
                <li><Link href="/shipping" className="text-[11px] font-medium text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors">Shipping & Returns</Link></li>
                <li><Link href="/contact" className="text-[11px] font-medium text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors">Contact Us</Link></li>
                <li><Link href="/offers" className="text-[11px] font-black text-[var(--color-accent)] hover:opacity-80 transition-opacity uppercase tracking-widest">Coupons & Gift Cards</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO Optimized Content Section */}
        <div className="mt-20 pt-16 border-t border-gray-100 pb-12">
          <div className="max-w-4xl">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-6 text-gray-900">
              The Pooki Shopping Experience – Where Agent-First Meets Style
            </h2>
            <div className="space-y-8 text-[12px] leading-relaxed text-gray-500 font-medium text-justify">
              <p>
                At <span className="text-black font-bold">POOKI</span>, we redefine the modern shopping experience, merging seamless agent-driven digital convenience with engaging streetwear aesthetics. Whether you're shopping our latest limited drops online or exploring our collection through our interactive AI stylist, we ensure a smooth, stylish, and hassle-free journey that caters to today's fashion-forward individuals.
              </p>
              
              <p>
                Our direct-to-consumer (D2C) approach eliminates traditional retail barriers, giving you complete control over how and where you engage with our trend-driven streetwear collections. From effortless online browsing to AI-powered fit discovery, Pooki lets you shop on your terms, at your pace.
              </p>

              <div>
                <h3 className="text-[14px] font-black text-black uppercase mb-3">Shop Anytime, Anywhere – The Digital Experience</h3>
                <p className="mb-4">
                  🚀 <span className="font-bold text-black">24/7 Accessibility – Fashion at Your Fingertips:</span> Gone are the days of restrictive store hours. Pooki online shopping allows you to browse, select, and purchase from our curated streetwear collections anytime, anywhere. Whether you're searching for minimal techwear, contemporary baggy styles, or trend-forward accessories, our platform provides an intuitive, fast, and agent-optimized experience.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 list-none p-0">
                  <li className="before:content-['✔'] before:mr-2 before:text-black"> <span className="font-bold text-black">User-Friendly Navigation</span> – Explore categories effortlessly, from joggers and co-ords to sunglasses and accessories.</li>
                  <li className="before:content-['✔'] before:mr-2 before:text-black"> <span className="font-bold text-black">AI-Powered Recommendations</span> – Get personalized outfit suggestions based on your style preferences.</li>
                  <li className="before:content-['✔'] before:mr-2 before:text-black"> <span className="font-bold text-black">Detailed Product Views</span> – High-quality images and tech-specs ensure zero guesswork when shopping online.</li>
                  <li className="before:content-['✔'] before:mr-2 before:text-black"> <span className="font-bold text-black">Secure & Easy Checkout</span> – Multiple payment options, fast processing, and seamless checkout make buying a breeze.</li>
                  <li className="before:content-['✔'] before:mr-2 before:text-black"> <span className="font-bold text-black">Exclusive Online Drops</span> – Stay ahead of trends with limited-edition online-only collections.</li>
                </ul>
                <p className="mt-4 italic"><span className="font-black text-black not-italic uppercase text-[10px] tracking-widest mr-2">Style Tip:</span> Need outfit inspiration? Our AI Stylist and 'Shop the Vibe' features help you discover effortless styling ideas in just a few clicks.</p>
              </div>

              <div>
                <h3 className="text-[14px] font-black text-black uppercase mb-3">Beyond the Screen – Innovation in Every Thread</h3>
                <p className="mb-4">
                  🛠️ <span className="font-bold text-black">Feel the Quality – Engineered Streetwear:</span> For those who love a tactile experience, Pooki's engineered fabrics provide a superior way to engage with premium textures, tailored fits, and contemporary aesthetics. Every piece is an evolution where style meets tech-innovation.
                </p>
                <p className="italic"><span className="font-black text-black not-italic uppercase text-[10px] tracking-widest mr-2">Pro Tip:</span> Try our best-selling heavy-weight joggers or oversized t-shirts to experience their premium feel and flawless agent-engineered fit firsthand.</p>
              </div>

              <div>
                <h3 className="text-[14px] font-black text-black uppercase mb-3">Pooki Seasonal Collections – Year-Round Evolution</h3>
                <p className="mb-4">
                  At Pooki, we design seasonal collections that keep you ahead of the curve throughout the year. From breathable summer layers to tech-heavy winter essentials, our pieces help you dress effortlessly.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="font-bold text-black border-b border-black pb-1 mb-2">Summer</p>
                    <p className="text-[11px]">Breezy cotton shirts and lightweight joggers for a cool, casual aesthetic.</p>
                  </div>
                  <div>
                    <p className="font-bold text-black border-b border-black pb-1 mb-2">Monsoon</p>
                    <p className="text-[11px]">Water-resistant jackets and quick-dry utility track pants.</p>
                  </div>
                  <div>
                    <p className="font-bold text-black border-b border-black pb-1 mb-2">Winter</p>
                    <p className="text-[11px]">Layered tech-wear, full-sleeve tees, and structured hooded jackets.</p>
                  </div>
                  <div>
                    <p className="font-bold text-black border-b border-black pb-1 mb-2">Staples</p>
                    <p className="text-[11px]">Classic obsidian joggers and minimalist white co-ords.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 border border-gray-100">
                 <h3 className="text-[14px] font-black text-black uppercase mb-3">Upgrade Your Shopping Experience – Explore POOKI Today!</h3>
                 <p>Ready to redefine your wardrobe? Shop the latest streetwear online. From effortless joggers and co-ords to bold sunglasses and statement accessories, Pooki has it all. Experience fashion for every season, occasion, and agent mood.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex flex-col gap-2">
            <h2 className="font-mono font-bold text-xl tracking-tighter uppercase leading-none">Pooki</h2>
            <p className="text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-[0.1em]">© {new Date().getFullYear()} Pooki Studios. Agent-First Streetwear.</p>
          </div>
          
          <div className="flex space-x-8">
            {["Instagram", "Twitter", "TikTok", "Facebook"].map((platform) => (
              <Link key={platform} href="#" className="text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--foreground)] transition-colors">
                {platform}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

