"use client";

import { useEffect, useState } from "react";

const prices = { Paperback: 14.99, Digital: 1.99 } as const;

export function BookStore() {
  const [format, setFormat] = useState<"Paperback" | "Digital">("Paperback");
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  const price = prices[format];
  const total = (price * quantity).toFixed(2);
  const checkoutLink = format === "Paperback"
    ? process.env.NEXT_PUBLIC_STRIPE_PRINT_LINK
    : process.env.NEXT_PUBLIC_STRIPE_DIGITAL_LINK;
  const addToCart = () => {
    setInCart(true);
    setCartOpen(true);
  };

  return <section className="inline-book-store" id="book-excerpt">
    <header className="book-store-heading">
      <span>FROM THE PREFACE</span>
      <h2>Cleared for Takeoff</h2>
      <blockquote>“The skies are open, the stars are waiting, and the journey begins here.”</blockquote>
    </header>
    <div className="book-store-panel">
      <img className="actual-book-cover" src="/cleared-for-takeoff-cover.jpg" alt="Cleared for Takeoff book cover by Ishitha Arekapudi"/>
      <div className="book-store-excerpt">
        <h3>A roadmap for the next generation of aviation and aerospace.</h3>
        <p>Imagine looking up in 2037 and seeing a sky filled with airplanes, piloted by a new generation of aviators and knowing that somewhere beyond Earth’s atmosphere, humans are living and working on Mars. This vision is no longer science fiction.</p>
        <p>I wrote <i>Cleared for Takeoff</i> as a guide to help you navigate the paths to becoming pilots, engineers, scientists, mechanics, and innovators. My goal is to break down barriers and show you how to access the knowledge, resources, and networks that can launch your journey.</p>
        <div className="inside-book">
          <span>INSIDE THE BOOK</span>
          <div><b>Explore Pathways</b><b>Find Funding</b><b>Build Your Network</b></div>
        </div>
      </div>
      <aside className="book-buy-card">
        <h3>Cleared for Takeoff</h3>
        <label>Format</label>
        <div className="format-options">
          <button className={format === "Paperback" ? "active" : ""} onClick={() => setFormat("Paperback")}>Paperback</button>
          <button className={format === "Digital" ? "active" : ""} onClick={() => setFormat("Digital")}>Digital</button>
        </div>
        <strong className="book-price">${price.toFixed(2)}</strong>
        <small>{format === "Paperback" ? "Print edition" : "Digital edition"}</small>
        <label>Quantity</label>
        <div className="quantity-stepper">
          <button onClick={() => setQuantity(value => Math.max(1, value - 1))} aria-label="Decrease quantity">−</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(value => value + 1)} aria-label="Increase quantity">+</button>
        </div>
        <button className="book-add-button" onClick={addToCart}>Add to Cart</button>
        <button className="book-buy-button" onClick={addToCart}>Buy Now</button>
        <small>Secure checkout · Shipping calculated at checkout</small>
      </aside>
    </div>

    <div className={`cart-overlay ${cartOpen ? "open" : ""}`} onClick={() => setCartOpen(false)} aria-hidden={!cartOpen}/>
    <aside className={`cart-drawer ${cartOpen ? "open" : ""}`} aria-hidden={!cartOpen} aria-label="Shopping cart">
      <header><div><h2>Your Cart</h2><span>{inCart ? "1 item" : "0 items"}</span></div><button onClick={() => setCartOpen(false)} aria-label="Close cart">×</button></header>
      {inCart ? <>
        <div className="cart-success">✓ <span>Added to your cart</span></div>
        <div className="cart-product">
          <img src="/cleared-for-takeoff-cover.jpg" alt="Cleared for Takeoff"/>
          <div><h3>Cleared for Takeoff</h3><span>{format}</span><strong>${price.toFixed(2)}</strong><div className="quantity-stepper"><button onClick={() => setQuantity(value => Math.max(1, value - 1))}>−</button><span>{quantity}</span><button onClick={() => setQuantity(value => value + 1)}>+</button></div></div>
          <button className="cart-remove" onClick={() => setInCart(false)} aria-label="Remove from cart">Remove</button>
        </div>
      </> : <div className="empty-cart"><h3>Your cart is empty.</h3><button onClick={() => setCartOpen(false)}>Continue Shopping</button></div>}
      {inCart && <div className="cart-footer">
        <button className="promo-toggle" onClick={() => setPromoOpen(value => !value)}>Enter a promo code <span>{promoOpen ? "−" : "+"}</span></button>
        {promoOpen && <div className="promo-entry"><input placeholder="Promo code"/><button>Apply</button></div>}
        <div className="cart-summary"><span>Subtotal <b>${total}</b></span><span>Shipping <b>Calculated at checkout</b></span><strong>Estimated total <b>${total}</b></strong></div>
        {checkoutLink ? <a className="checkout-button" href={checkoutLink} target="_blank" rel="noreferrer">Secure Checkout ↗</a> : <button className="checkout-button" onClick={() => alert("Add the Stripe payment link for this format in Vercel to activate checkout.")}>Secure Checkout</button>}
        <button className="continue-button" onClick={() => setCartOpen(false)}>Continue Shopping</button>
        <small>🔒 Secure checkout</small>
      </div>}
    </aside>
  </section>;
}
