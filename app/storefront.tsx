"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { products, type Product } from "@/lib/products";

const categories = ["All objects", "Lighting", "Tabletop", "Textiles"];

export default function Storefront() {
  const [cart, setCart] = useCart();
  const [activeCategory, setActiveCategory] = useState("All objects");
  const [search, setSearch] = useState("");
  const [bagOpen, setBagOpen] = useState(false);

  const visibleProducts = useMemo(
    () => products.filter((product) => {
      const matchesCategory = activeCategory === "All objects" || product.category === activeCategory;
      const matchesSearch = `${product.name} ${product.description}`.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    }),
    [activeCategory, search],
  );
  const itemCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const total = products.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0);

  function addToBag(product: Product) {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }));
    setBagOpen(true);
  }

  function changeQuantity(productId: string, amount: number) {
    setCart((current) => {
      const quantity = (current[productId] ?? 0) + amount;
      const next = { ...current };
      if (quantity < 1) delete next[productId];
      else next[productId] = quantity;
      return next;
    });
  }

  return (
    <main>
      <div className="announcement">Thoughtful things, made to stay. Complimentary shipping over $120.</div>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Sola home">sola<span>®</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#collection">Shop all</a><a href="#story">Our point of view</a><a href="#newsletter">Journal</a>
        </nav>
        <div className="header-actions">
          <Link className="account-link" href="/signin">Sign in</Link>
          <button className="bag-trigger" type="button" onClick={() => setBagOpen(true)} aria-label={`Open bag, ${itemCount} items`}>
            Bag <span className="bag-count">{itemCount}</span>
          </button>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-image" role="img" aria-label="Sunlit living room with sculptural furniture" />
        <div className="hero-copy">
          <p className="eyebrow">A softer kind of everyday.</p>
          <h1 id="hero-title">Make room<br />for <em>meaning.</em></h1>
          <p className="hero-description">Useful objects with a little more soul. Considered in form, honest in material, and made for the rituals that make a home.</p>
          <a className="button button-dark" href="#collection">Explore the collection <span aria-hidden="true">↘</span></a>
        </div>
        <div className="hero-note"><span>01 / 03</span><span>Objects for living well</span></div>
      </section>

      <section className="intro-strip" id="story">
        <p>Less, but <em>better.</em></p>
        <p>Small-batch pieces designed to be reached for every day, then handed down one day.</p>
        <a href="#collection" aria-label="Shop the collection">Discover our approach <span aria-hidden="true">↗</span></a>
      </section>

      <section className="collection section-wrap" id="collection">
        <div className="section-heading">
          <div><p className="eyebrow">The considered edit / 2026</p><h2>Good things, <em>well made.</em></h2></div>
          <label className="search-field"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find something" aria-label="Search products" /></label>
        </div>
        <div className="collection-toolbar">
          <div className="category-tabs" role="tablist" aria-label="Filter by category">
            {categories.map((category) => <button key={category} type="button" role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? "category-tab active" : "category-tab"} onClick={() => setActiveCategory(category)}>{category}</button>)}
          </div>
          <span className="result-count">{visibleProducts.length} considered objects</span>
        </div>
        <div className="product-grid">
          {visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} onAdd={addToBag} />)}
          {visibleProducts.length === 0 && <p className="empty-results">Nothing here just yet. Try another search.</p>}
        </div>
      </section>

      <section className="materials-band">
        <div className="materials-image" role="img" aria-label="Handcrafted ceramic vessels in natural light" />
        <div className="materials-copy">
          <p className="eyebrow">Made with intention</p><h2>Materials with<br />a <em>past and future.</em></h2>
          <p>Natural fibers, reclaimed timber, and ceramics shaped by hand. We work with small workshops that care as much about how something is made as how it looks on your shelf.</p>
          <a className="text-link" href="#newsletter">Read our material notes <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="newsletter section-wrap" id="newsletter">
        <p className="eyebrow">A little note from us</p><h2>Good things, occasionally.</h2>
        <p>New work, old stories, and ideas for making home feel more like yours.</p>
        <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
          <input type="email" placeholder="Your email address" aria-label="Your email address" required />
          <button className="button button-dark" type="submit">Count me in <span aria-hidden="true">↗</span></button>
        </form>
      </section>

      <footer className="site-footer"><Link className="wordmark" href="/">sola<span>®</span></Link><span>Objects for everyday rituals.</span><span>© 2026 Sola Studio</span><Link href="/signin">Account</Link></footer>

      {bagOpen && <div className="bag-backdrop" onClick={() => setBagOpen(false)} role="presentation">
        <aside className="bag-panel" onClick={(event) => event.stopPropagation()} aria-label="Shopping bag" aria-modal="true" role="dialog">
          <div className="bag-heading"><div><p className="eyebrow">Your edit</p><h2>Shopping bag <span>({itemCount})</span></h2></div><button type="button" className="close-button" onClick={() => setBagOpen(false)} aria-label="Close bag">×</button></div>
          {itemCount === 0 ? <div className="bag-empty"><p>Your bag is taking a little breather.</p><button className="text-link" type="button" onClick={() => setBagOpen(false)}>Keep exploring <span aria-hidden="true">↗</span></button></div> : <>
            <div className="bag-lines">{products.filter((product) => cart[product.id]).map((product) => <div className="bag-line" key={product.id}>
              <div className="bag-thumb" style={{ backgroundImage: `url('${product.image}')` }} />
              <div className="bag-line-copy"><h3>{product.name}</h3><p>${product.price}</p><div className="quantity-control"><button type="button" onClick={() => changeQuantity(product.id, -1)} aria-label={`Remove one ${product.name}`}>−</button><span>{cart[product.id]}</span><button type="button" onClick={() => changeQuantity(product.id, 1)} aria-label={`Add one ${product.name}`}>+</button></div></div>
              <span className="line-total">${product.price * cart[product.id]}</span>
            </div>)}</div>
            <div className="bag-summary"><div><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div><p>Shipping and taxes calculated at checkout.</p><Link className="button button-dark checkout-button" href="/checkout">Continue to checkout <span aria-hidden="true">→</span></Link></div>
          </>}
        </aside>
      </div>}
    </main>
  );
}

function ProductCard({ product, index, onAdd }: { product: Product; index: number; onAdd: (product: Product) => void }) {
  return <article className="product-card" style={{ animationDelay: `${index * 70}ms` }}>
    <div className="product-image" style={{ backgroundImage: `url('${product.image}')` }} role="img" aria-label={product.name}>
      {product.label && <span className="product-label">{product.label}</span>}
      <button className="quick-add" type="button" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to bag`}>+</button>
    </div>
    <div className="product-meta"><div><h3>{product.name}</h3><p>{product.description}</p></div><strong>${product.price}</strong></div>
    <div className="product-detail"><span>{product.material}</span><span>{product.category}</span></div>
  </article>;
}