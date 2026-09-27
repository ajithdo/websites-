import { useMemo, useSyncExternalStore } from 'react';
import {
  builderReducer,
  emptyDraft,
  sanitizeDraft,
  type BuilderAction,
  type BuilderContext,
  type BuilderDraft,
} from '~/lib/builder';
import { readJSON, removeKey, storageKeys, writeJSON } from '~/lib/storage';

/**
 * Builder state as an external store: the server snapshot is the empty first
 * step (matching the static HTML); in the browser it restores the saved draft
 * and applies ?occasion= from the occasion tiles.
 */
function createBuilderStore(ctx: BuilderContext) {
  let state: BuilderDraft | null = null;
  let restored = false;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  const load = (): BuilderDraft => {
    let draft = sanitizeDraft(readJSON(storageKeys.builder), ctx);
    restored = draft !== null;
    const params = new URLSearchParams(window.location.search);
    const occasion = params.get('occasion');
    if (occasion && ctx.occasions.includes(occasion)) {
      const base = draft ?? emptyDraft;
      draft = {
        ...base,
        occasion,
        step: Math.max(1, base.step),
        maxStep: Math.max(1, base.maxStep),
      };
      restored = false;
      params.delete('occasion');
      const query = params.toString();
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`,
      );
    }
    return draft ?? emptyDraft;
  };

  return {
    get restored() {
      return restored;
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot(): BuilderDraft {
      state ??= load();
      return state;
    },
    getServerSnapshot(): BuilderDraft {
      return emptyDraft;
    },
    dispatch(action: BuilderAction) {
      state = builderReducer(state ?? load(), action, ctx);
      if (action.type === 'reset') {
        removeKey(storageKeys.builder);
        restored = false;
      } else {
        writeJSON(storageKeys.builder, state);
      }
      emit();
    },
  };
}

export function useBuilderStore(ctx: BuilderContext) {
  const store = useMemo(() => createBuilderStore(ctx), [ctx]);
  const draft = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { draft, dispatch: store.dispatch, store };
}
