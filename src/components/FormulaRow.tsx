import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { Chemical, FormulaItem } from '@/types/chemical';

interface FormulaRowProps {
  item: FormulaItem;
  index: number;
  chemicals: Chemical[];
  totalQuantity: number;
  onUpdate: (item: FormulaItem) => void;
  onRemove: () => void;
}

const FormulaRow: React.FC<FormulaRowProps> = ({ item, index, chemicals, totalQuantity, onUpdate, onRemove }) => {
  const [suggestions, setSuggestions] = useState<Chemical[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(item.rawMaterial);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRawMaterialChange = (value: string) => {
    setInputValue(value);
    
    if (value.length > 0) {
      const filtered = chemicals.filter(chemical =>
        chemical.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    const selectedChemical = chemicals.find(c => c.name === value);
    const pricePerKg = selectedChemical ? selectedChemical.pricePerKg : 0;
    const totalPrice = item.quantityInGrams > 0 && totalQuantity > 0 ? (item.quantityInGrams * pricePerKg) / totalQuantity : 0;

    onUpdate({
      ...item,
      rawMaterial: value,
      pricePerKg,
      totalPrice
    });
  };

  const handleSuggestionClick = (chemical: Chemical) => {
    setInputValue(chemical.name);
    setShowSuggestions(false);
    
    const totalPrice = item.quantityInGrams > 0 && totalQuantity > 0 ? (item.quantityInGrams * chemical.pricePerKg) / totalQuantity : 0;
    
    onUpdate({
      ...item,
      rawMaterial: chemical.name,
      pricePerKg: chemical.pricePerKg,
      totalPrice
    });
  };

  const handleQuantityChange = (quantity: number) => {
    const totalPrice = quantity > 0 && item.pricePerKg > 0 && totalQuantity > 0 ? (quantity * item.pricePerKg) / totalQuantity : 0;
    
    onUpdate({
      ...item,
      quantityInGrams: quantity,
      totalPrice
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-12 gap-2 items-center p-3 bg-white border rounded-lg relative">
        <div className="col-span-1 text-center font-medium text-gray-600">
          {index + 1}
        </div>
        
        <div className="col-span-4 relative" ref={inputRef}>
          <Input
            placeholder="Enter raw material name"
            value={inputValue}
            onChange={(e) => handleRawMaterialChange(e.target.value)}
            className="w-full"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
              {suggestions.map((chemical) => (
                <div
                  key={chemical.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSuggestionClick(chemical)}
                >
                  <div className="font-medium">{chemical.name}</div>
                  <div className="text-gray-500 text-xs">₹{chemical.pricePerKg.toFixed(2)}/kg</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="col-span-2">
          <Input
            type="number"
            placeholder="Quantity (g)"
            value={item.quantityInGrams || ''}
            onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 0)}
            className="w-full"
          />
        </div>
        
        <div className="col-span-2 text-center">
          <span className="text-sm font-medium">
            ₹{item.pricePerKg.toFixed(2)}/kg
          </span>
        </div>
        
        <div className="col-span-2 text-center">
          <span className="text-sm font-medium text-green-600">
            ₹{item.totalPrice.toFixed(4)}
          </span>
        </div>
        
        <div className="col-span-1 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden bg-white border rounded-lg p-4 space-y-3 relative">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600 text-sm">#{index + 1}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">Raw Material</label>
          <div className="relative" ref={inputRef}>
            <Input
              placeholder="Enter raw material name"
              value={inputValue}
              onChange={(e) => handleRawMaterialChange(e.target.value)}
              className="w-full text-sm"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-32 overflow-y-auto">
                {suggestions.map((chemical) => (
                  <div
                    key={chemical.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleSuggestionClick(chemical)}
                  >
                    <div className="font-medium text-xs">{chemical.name}</div>
                    <div className="text-gray-500 text-xs">₹{chemical.pricePerKg.toFixed(2)}/kg</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Quantity (g)</label>
            <Input
              type="number"
              placeholder="0"
              value={item.quantityInGrams || ''}
              onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 0)}
              className="w-full text-sm"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Price/kg</label>
            <div className="h-10 flex items-center px-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium">₹{item.pricePerKg.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-600">Total Price:</span>
            <span className="text-sm font-bold text-green-600">₹{item.totalPrice.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormulaRow;
