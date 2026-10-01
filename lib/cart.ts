"use client";

import { useSyncExternalStore } from "react";

export type Cart = Record<string, number>;
type CartUpdate = Cart | ((current: Cart) => Cart);

const storageKey = "sola-cart";
const cartEvent = "sola-cart-change";
const emptyCart = "{}";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(cartEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(cartEvent, callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(storageKey) ?? emptyCart;
}

function getServerSnapshot() {
  return emptyCart;
}

export function useCart(): [Cart, (update: CartUpdate) => void, boolean] {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  let cart: Cart = {};
  try {
    cart = JSON.parse(snapshot) as Cart;
  } catch {
    cart = {};
  }

  function setCart(update: CartUpdate) {
    const next = typeof update === "function" ? update(cart) : update;
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    window.dispatchEvent(new Event(cartEvent));
  }

  return [cart, setCart, hydrated];
}