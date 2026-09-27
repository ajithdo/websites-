import { useMemo, useSyncExternalStore } from 'react';
import {
  cartReducer,
  sanitizeCart,
  type CartAction,
  type CartLine,
  type CartMenuItem,
} from '~/lib/cart';
import { readJSON, storageKeys, writeJSON } from '~/lib/storage';

const EMPTY: CartLine[] = [];

/**
 * A tiny external store for the cart, persisted in localStorage.
 * The server snapshot is always empty, so hydration matches the static HTML;
 * the saved cart appears right after, and other open tabs stay in sync.
 */
function createCartStore(byId: ReadonlyMap<string, CartMenuItem>) {
  let state: CartLine[] | null = null;
  const listeners = new Set<() => void>();
  const load = () => sanitizeCart(readJSON(storageKeys.cart), byId);
  const emit = () => listeners.forEach((l) => l());
  const onStorage = (e: StorageEvent) => {
    if (e.key !== storageKeys.cart) return;
    state = load();
    emit();
  };
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (listeners.size === 1) window.addEventListener('storage', onStorage);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener('storage', onStorage);
      };
    },
    getSnapshot(): CartLine[] {
      state ??= load();
      return state;
    },
    getServerSnapshot(): CartLine[] {
      return EMPTY;
    },
    dispatch(action: CartAction) {
      state = cartReducer(state ?? load(), action);
      writeJSON(storageKeys.cart, state);
      emit();
    },
  };
}

export function useCart(byId: ReadonlyMap<string, CartMenuItem>) {
  const store = useMemo(() => createCartStore(byId), [byId]);
  const lines = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return {
    lines,
    dispatch: store.dispatch,
    ready: lines !== EMPTY || typeof window !== 'undefined',
  };
}
