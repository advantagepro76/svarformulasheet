
export interface Chemical {
  id: string;
  name: string;
  pricePerKg: number;
}

export interface FormulaItem {
  id: string;
  rawMaterial: string;
  quantityInGrams: number;
  pricePerKg: number;
  totalPrice: number;
}

export interface SavedFormula {
  id?: string; // ✅ optional because Firestore auto-generates it
  code: string;
  name: string;
  items: FormulaItem[];
  totalCost: number;
  totalQuantity: number;
  createdAt: string;
}
