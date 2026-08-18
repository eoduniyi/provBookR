export interface TypeElementState {
  x: number;          // percentage 0..100
  y: number;          // percentage 0..100
  rotation: number;   // degrees -180..180
  fontSize: number;   // px (e.g. 24)
  fontWeight: number; // 100..900
  fontFamily: 'serif' | 'mono' | 'sans';
  color: string;
  isItalic: boolean;
  opacity: number;
}

export interface TypeElement extends TypeElementState {
  id: string;
  text: string;
  initialState: TypeElementState; // Un-distorted "zero state" snapshot
}

export type DeliveryMode = 'line-by-line' | 'word-by-word' | 'scatter';
export type LayoutMode = 'cascade' | 'center' | 'staircase' | 'scatter' | 'grid';
export type TargetSide = 'left' | 'right' | 'both';

const STORAGE_KEY = 'prov_type_composer_v1';

function loadPersisted(): Record<string, TypeElement[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to load persisted type compositions', e);
    return {};
  }
}

function persist(data: Record<string, TypeElement[]>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to persist type compositions', e);
  }
}

class TypeComposerStore {
  // Reactive map of pageKey -> TypeElement[]
  pageElements = $state<Record<string, TypeElement[]>>(loadPersisted());
  
  // UI state
  isOpen = $state(false);
  targetSide = $state<TargetSide>('left');
  activePageKey = $state<string>('spread-1-left');
  selectedIds = $state<Set<string>>(new Set());
  
  // Global settings for newly seeded text / active selection
  inputText = $state<string>('');
  fontFamily = $state<'serif' | 'mono' | 'sans'>('serif');
  fontSize = $state<number>(24);
  fontWeight = $state<number>(400);
  isItalic = $state<boolean>(false);
  textColor = $state<string>('inherit');
  deliveryMode = $state<DeliveryMode>('line-by-line');

  constructor() {
    $effect.root(() => {
      $effect(() => {
        // Auto persist whenever pageElements change
        persist(this.pageElements);
      });
    });
  }

  getElements(pageKey: string): TypeElement[] {
    return this.pageElements[pageKey] || [];
  }

  getTargetKeysForSpread(spreadIndex: number): string[] {
    if (spreadIndex === 0) return ['page-cover'];
    if (this.targetSide === 'left') return [`spread-${spreadIndex}-left`];
    if (this.targetSide === 'right') return [`spread-${spreadIndex}-right`];
    return [`spread-${spreadIndex}-left`, `spread-${spreadIndex}-right`];
  }

  selectElement(pageKey: string, id: string) {
    this.activePageKey = pageKey;
    this.selectedIds = new Set([id]);
    const list = this.getElements(pageKey);
    const target = list.find(el => el.id === id);
    if (target) {
      this.inputText = target.text;
      this.fontFamily = target.fontFamily;
      this.fontSize = target.fontSize;
      this.fontWeight = target.fontWeight;
      this.isItalic = target.isItalic;
    }
  }

  updateSelectedText(text: string) {
    this.inputText = text;
    if (this.selectedIds.size === 1) {
      const selectedId = Array.from(this.selectedIds)[0];
      const list = this.getElements(this.activePageKey);
      const target = list.find(el => el.id === selectedId);
      if (target) {
        this.updateElement(this.activePageKey, selectedId, { text });
      }
    }
  }

  setFontSize(size: number) {
    this.fontSize = size;
    if (this.selectedIds.size > 0) {
      this.selectedIds.forEach(id => {
        this.updateElement(this.activePageKey, id, { fontSize: size });
      });
    }
  }

  setFontWeight(weight: number) {
    this.fontWeight = weight;
    if (this.selectedIds.size > 0) {
      this.selectedIds.forEach(id => {
        this.updateElement(this.activePageKey, id, { fontWeight: weight });
      });
    }
  }

  setFontFamily(family: 'serif' | 'mono' | 'sans') {
    this.fontFamily = family;
    if (this.selectedIds.size > 0) {
      this.selectedIds.forEach(id => {
        this.updateElement(this.activePageKey, id, { fontFamily: family });
      });
    }
  }

  setItalic(italic: boolean) {
    this.isItalic = italic;
    if (this.selectedIds.size > 0) {
      this.selectedIds.forEach(id => {
        this.updateElement(this.activePageKey, id, { isItalic: italic });
      });
    }
  }

  seedTextForSpread(spreadIndex: number, rawText: string, delivery: DeliveryMode = this.deliveryMode) {
    if (!rawText.trim()) return;

    let items: string[] = [];
    if (delivery === 'word-by-word') {
      items = rawText.trim().split(/\s+/);
    } else {
      items = rawText.split('\n').map(s => s.trim()).filter(Boolean);
    }

    if (items.length === 0) return;

    const targetKeys = this.getTargetKeysForSpread(spreadIndex);

    if (targetKeys.length === 1) {
      this.seedItemsToKey(targetKeys[0], items, delivery);
    } else {
      // 'both' target mode: distribute text gracefully across Left and Right pages
      const leftItems = items.filter((_, i) => i % 2 === 0);
      const rightItems = items.filter((_, i) => i % 2 === 1);

      if (leftItems.length > 0) this.seedItemsToKey(targetKeys[0], leftItems, delivery);
      if (rightItems.length > 0) this.seedItemsToKey(targetKeys[1], rightItems, delivery);
      else if (leftItems.length > 0) this.seedItemsToKey(targetKeys[1], [...leftItems], delivery); // Mirror if single item
    }
  }

  private seedItemsToKey(pageKey: string, items: string[], delivery: DeliveryMode) {
    const current = this.getElements(pageKey);
    const startY = current.length > 0 ? Math.min(80, 15 + current.length * 8) : 20;

    const newElements: TypeElement[] = items.map((t, idx) => {
      const id = `type-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      let x = 15;
      let y = Math.min(85, startY + idx * 7);

      if (delivery === 'scatter') {
        x = 10 + Math.random() * 70;
        y = 15 + Math.random() * 70;
      }

      const state: TypeElementState = {
        x,
        y,
        rotation: 0,
        fontSize: this.fontSize,
        fontWeight: this.fontWeight,
        fontFamily: this.fontFamily,
        color: this.textColor,
        isItalic: this.isItalic,
        opacity: 1
      };

      return {
        id,
        text: t,
        ...state,
        initialState: { ...state } // Immutable zero-state snapshot
      };
    });

    this.pageElements = {
      ...this.pageElements,
      [pageKey]: [...current, ...newElements]
    };
  }

  updateElement(pageKey: string, id: string, patch: Partial<TypeElementState> | { text: string }) {
    const list = this.getElements(pageKey);
    this.pageElements = {
      ...this.pageElements,
      [pageKey]: list.map(el => el.id === id ? { ...el, ...patch } : el)
    };
  }

  // ── Zero State Reset Engine ──
  resetToZeroStateForSpread(spreadIndex: number) {
    const targetKeys = this.getTargetKeysForSpread(spreadIndex);
    let updatedPageElements = { ...this.pageElements };

    targetKeys.forEach(pageKey => {
      const list = this.getElements(pageKey);
      updatedPageElements[pageKey] = list.map(el => ({
        ...el,
        ...el.initialState,
        x: el.initialState.x,
        y: el.initialState.y,
        rotation: 0,
        opacity: 1
      }));
    });

    this.pageElements = updatedPageElements;
  }

  // ── Layout Distribution Presets ──
  applyLayoutForSpread(spreadIndex: number, mode: LayoutMode) {
    const targetKeys = this.getTargetKeysForSpread(spreadIndex);
    let updatedPageElements = { ...this.pageElements };

    targetKeys.forEach(pageKey => {
      const list = this.getElements(pageKey);
      if (list.length === 0) return;

      const count = list.length;
      const updated = list.map((el, i) => {
        let x = el.x;
        let y = el.y;

        if (mode === 'cascade') {
          x = 12 + (i % 6) * 6;
          y = 15 + (i / count) * 65;
        } else if (mode === 'center') {
          x = 50;
          y = 20 + (i / count) * 60;
        } else if (mode === 'staircase') {
          x = 10 + (i / Math.max(1, count - 1)) * 65;
          y = 15 + (i / Math.max(1, count - 1)) * 65;
        } else if (mode === 'scatter') {
          x = 12 + Math.random() * 70;
          y = 15 + Math.random() * 65;
        } else if (mode === 'grid') {
          const cols = Math.ceil(Math.sqrt(count));
          const col = i % cols;
          const row = Math.floor(i / cols);
          x = 15 + col * (70 / Math.max(1, cols - 1));
          y = 20 + row * 14;
        }

        return {
          ...el,
          x,
          y,
          rotation: 0 // Reset rotation on layout change
        };
      });

      updatedPageElements[pageKey] = updated;
    });

    this.pageElements = updatedPageElements;
  }

  // ── Wacky Transformations ──
  applyWackyDistortionForSpread(spreadIndex: number) {
    const targetKeys = this.getTargetKeysForSpread(spreadIndex);
    let updatedPageElements = { ...this.pageElements };

    targetKeys.forEach(pageKey => {
      const list = this.getElements(pageKey);
      const updated = list.map(el => {
        const rot = (Math.random() - 0.5) * 45; // -22.5 to +22.5 deg
        const dx = (Math.random() - 0.5) * 15;
        const dy = (Math.random() - 0.5) * 15;
        return {
          ...el,
          x: Math.max(5, Math.min(90, el.x + dx)),
          y: Math.max(10, Math.min(85, el.y + dy)),
          rotation: Math.round(rot)
        };
      });

      updatedPageElements[pageKey] = updated;
    });

    this.pageElements = updatedPageElements;
  }

  deleteElement(pageKey: string, id: string) {
    const list = this.getElements(pageKey);
    this.pageElements = {
      ...this.pageElements,
      [pageKey]: list.filter(el => el.id !== id)
    };
    this.selectedIds.delete(id);
  }

  clearPageForSpread(spreadIndex: number) {
    const targetKeys = this.getTargetKeysForSpread(spreadIndex);
    let updatedPageElements = { ...this.pageElements };

    targetKeys.forEach(pageKey => {
      updatedPageElements[pageKey] = [];
    });

    this.pageElements = updatedPageElements;
    this.selectedIds.clear();
  }
}

export const typeComposerState = new TypeComposerStore();
