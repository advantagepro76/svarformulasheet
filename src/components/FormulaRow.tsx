import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { Chemical, FormulaRowData } from './FormulaPage';

interface FormulaRowProps {
  rowNumber: number;
  row: FormulaRowData;
  chemicals: Chemical[];
  onUpdateRow: (id: string, updatedRow: Partial<FormulaRowData>) => void;
  onRemoveRow: (id: string) => void;
  onCalculatePrice: (chemical: Chemical, quantity: number) => number;
  canRemove: boolean;
}

export const FormulaRow: React.FC<FormulaRowProps> = ({
  rowNumber,
  row,
  chemicals,
  onUpdateRow,
  onRemoveRow,
  onCalculatePrice,
  canRemove
}) => {
  const [searchTerm, setSearchTerm] = useState(row.chemical?.name || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredChemicals, setFilteredChemicals] = useState<Chemical[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm) {
      const filtered = chemicals.filter(chemical =>
        chemical.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChemicals(filtered);
    } else {
      setFilteredChemicals([]);
    }
  }, [searchTerm, chemicals]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChemicalSelect = (chemical: Chemical) => {
    setSearchTerm(chemical.name);
    setShowSuggestions(false);
    
    const calculatedPrice = onCalculatePrice(chemical, row.quantity);
    
    onUpdateRow(row.id, {
      chemical,
      calculatedPrice
    });
  };

  const handleQuantityChange = (quantity: number) => {
    const calculatedPrice = row.chemical ? onCalculatePrice(row.chemical, quantity) : 0;
    
    onUpdateRow(row.id, {
      quantity,
      calculatedPrice
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value !== row.chemical?.name) {
      onUpdateRow(row.id, {
        chemical: null,
        calculatedPrice: 0
      });
    }
    setShowSuggestions(true);
  };

  return (
    <div className="md:grid md:grid-cols-12 gap-4 items-center py-2 border-b border-border/50 last:border-b-0 space-y-2 md:space-y-0">
      {/* Row Number */}
      <div className="md:col-span-1">
        <span className="text-sm font-medium text-muted-foreground block md:hidden">#{rowNumber}</span>
        <span className="text-sm font-medium text-muted-foreground hidden md:block">{rowNumber}</span>
      </div>

      {/* Raw Material with Autocomplete */}
      <div className="md:col-span-4 relative">
        <label className="block md:hidden text-xs font-medium text-muted-foreground mb-1">Raw Material</label>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search chemicals..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className="w-full"
        />
        
        {showSuggestions && filteredChemicals.length > 0 && (
          <Card 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto"
          >
            <div className="p-1">
              {filteredChemicals.map((chemical) => (
                <button
                  key={chemical.id}
                  onClick={() => handleChemicalSelect(chemical)}
                  className="w-full text-left px-3 py-2 rounded-sm hover:bg-accent hover:text-accent-foreground text-sm transition-colors"
                >
                  <div className="font-medium">{chemical.name}</div>
                  <div className="text-xs text-muted-foreground">₹{chemical.pricePerKg}/kg</div>
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Quantity */}
      <div className="md:col-span-2">
        <label className="block md:hidden text-xs font-medium text-muted-foreground mb-1">Quantity (g)</label>
        <Input
          type="number"
          placeholder="0"
          min="0"
          step="0.1"
          value={row.quantity || ''}
          onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 0)}
          className="w-full"
        />
      </div>

      {/* Price per kg */}
      <div className="md:col-span-2">
        <label className="block md:hidden text-xs font-medium text-muted-foreground mb-1">Price/kg (₹)</label>
        <div className="px-3 py-2 bg-muted rounded-md text-sm">
          ₹{row.chemical?.pricePerKg.toFixed(2) || '0.00'}
        </div>
      </div>

      {/* Total Price */}
      <div className="md:col-span-2">
        <label className="block md:hidden text-xs font-medium text-muted-foreground mb-1">Total (₹)</label>
        <div className="px-3 py-2 bg-lab-light rounded-md text-sm font-semibold text-lab-blue">
          ₹{row.calculatedPrice.toFixed(2)}
        </div>
      </div>

      {/* Actions */}
      <div className="md:col-span-1 flex justify-center">
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveRow(row.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={14} />
          </Button>
        )}
      </div>
    </div>
  );
};