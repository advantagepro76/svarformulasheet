export interface FormulaIngredient {
  chemicalId: string;     // id of the chemical from database
  name: string;           // for display
  quantityInGrams: number;
  pricePerKg: number;     // auto-fetched from Firebase
}
import { useEffect } from 'react';
import { fetchChemicals } from '../lib/firebasfunctions';

export interface Formula {
  id?: string;
  name: string;
  ingredients: FormulaIngredient[];
  totalCost: number;
  sellingPrice: number;
}

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, Printer, Trash2 } from 'lucide-react';
import { FormulaRow } from './FormulaRow';
import { SavedFormulas } from './SavedFormulas';
import { PrintTemplate } from './PrintTemplate';
import { ChemicalManagement } from './ChemicalManagement';
import { useToast } from '@/hooks/use-toast';

export interface Chemical {
  id: string;
  name: string;
  pricePerKg: number;
}

export interface FormulaRowData {
  id: string;
  chemical: Chemical | null;
  quantity: number;
  calculatedPrice: number;
}

export interface SavedFormula {
  id: string;
  name: string;
  rows: FormulaRowData[];
  totalCost: number;
  sellingPrice: number;
  multiplyingFactor: number;
  createdAt: Date;
}

// Mock chemical data
const mockChemicals: Chemical[] = [
  { id: '1', name: 'Potassium Chloride', pricePerKg: 25.50 },
  { id: '2', name: 'Potassium Nitrate', pricePerKg: 32.75 },
  { id: '3', name: 'Phosphoric Acid', pricePerKg: 18.90 },
  { id: '4', name: 'Phenol', pricePerKg: 45.20 },
  { id: '5', name: 'Sodium Chloride', pricePerKg: 12.30 },
  { id: '6', name: 'Sulfuric Acid', pricePerKg: 15.80 },
  { id: '7', name: 'Sodium Hydroxide', pricePerKg: 22.10 },
  { id: '8', name: 'Calcium Carbonate', pricePerKg: 8.75 },
  { id: '9', name: 'Citric Acid', pricePerKg: 28.60 },
  { id: '10', name: 'Copper Sulfate', pricePerKg: 35.40 },
];

export const FormulaPage: React.FC = () => {
    useEffect(() => {
    const testFirebase = async () => {
      try {
        const chemicals = await fetchChemicals();
        console.log("✅ Firebase is working! Fetched chemicals:", chemicals);
      } catch (error) {
        console.error("❌ Firebase failed:", error);
      }
    };

    testFirebase();
  }, []);

  const { toast } = useToast();
  const [chemicals, setChemicals] = useState<Chemical[]>(mockChemicals);
  const [formulaRows, setFormulaRows] = useState<FormulaRowData[]>([
    { id: '1', chemical: null, quantity: 0, calculatedPrice: 0 }
  ]);
  const [formulaName, setFormulaName] = useState('');
  const [multiplyingFactor, setMultiplyingFactor] = useState(1.0);
  const [savedFormulas, setSavedFormulas] = useState<SavedFormula[]>([]);
  const [showPrintTemplate, setShowPrintTemplate] = useState(false);
  const [currentFormulaToPrint, setCurrentFormulaToPrint] = useState<SavedFormula | null>(null);

  const addRow = useCallback(() => {
    const newRow: FormulaRowData = {
      id: Date.now().toString(),
      chemical: null,
      quantity: 0,
      calculatedPrice: 0
    };
    setFormulaRows(prev => [...prev, newRow]);
  }, []);

  const removeRow = useCallback((id: string) => {
    if (formulaRows.length > 1) {
      setFormulaRows(prev => prev.filter(row => row.id !== id));
    }
  }, [formulaRows.length]);

  const updateRow = useCallback((id: string, updatedRow: Partial<FormulaRowData>) => {
    setFormulaRows(prev => prev.map(row => 
      row.id === id ? { ...row, ...updatedRow } : row
    ));
  }, []);

  const calculateRowPrice = useCallback((chemical: Chemical, quantity: number): number => {
    if (!chemical || quantity <= 0) return 0;
    return (quantity * chemical.pricePerKg) / 1000; // Convert grams to kg
  }, []);

  const getTotalCost = useCallback((): number => {
    return formulaRows.reduce((total, row) => total + row.calculatedPrice, 0);
  }, [formulaRows]);

  const getSellingPrice = useCallback((): number => {
    return getTotalCost() * multiplyingFactor;
  }, [getTotalCost, multiplyingFactor]);

  const saveFormula = useCallback(() => {
    if (!formulaName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a formula name",
        variant: "destructive"
      });
      return;
    }

    if (formulaRows.every(row => !row.chemical)) {
      toast({
        title: "Error", 
        description: "Please add at least one chemical to the formula",
        variant: "destructive"
      });
      return;
    }

    const newFormula: SavedFormula = {
      id: Date.now().toString(),
      name: formulaName,
      rows: [...formulaRows.filter(row => row.chemical)],
      totalCost: getTotalCost(),
      sellingPrice: getSellingPrice(),
      multiplyingFactor,
      createdAt: new Date()
    };

    setSavedFormulas(prev => [...prev, newFormula]);
    
    // Reset form
    setFormulaName('');
    setFormulaRows([{ id: Date.now().toString(), chemical: null, quantity: 0, calculatedPrice: 0 }]);
    setMultiplyingFactor(1.0);

    toast({
      title: "Success",
      description: "Formula saved successfully!",
      variant: "default"
    });
  }, [formulaName, formulaRows, getTotalCost, getSellingPrice, multiplyingFactor, toast]);

  const printFormula = useCallback((formula: SavedFormula) => {
    setCurrentFormulaToPrint(formula);
    setShowPrintTemplate(true);
  }, []);

  const editFormula = useCallback((formula: SavedFormula) => {
    setFormulaName(formula.name);
    setFormulaRows([...formula.rows]);
    setMultiplyingFactor(formula.multiplyingFactor);
    setSavedFormulas(prev => prev.filter(f => f.id !== formula.id));
    toast({
      title: "Formula loaded for editing",
      description: "Formula has been loaded into the create form",
      variant: "default"
    });
  }, [toast]);

  const duplicateFormula = useCallback((formula: SavedFormula) => {
    const duplicatedFormula: SavedFormula = {
      ...formula,
      id: Date.now().toString(),
      name: `${formula.name} (Copy)`,
      createdAt: new Date()
    };
    setSavedFormulas(prev => [...prev, duplicatedFormula]);
    toast({
      title: "Formula duplicated",
      description: "A copy of the formula has been created",
      variant: "default"
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">Chemical Formula Builder</h1>
          <p className="text-muted-foreground text-lg">Create and manage chemical formulas with precision</p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto md:h-10">
            <TabsTrigger value="create">Create Formula</TabsTrigger>
            <TabsTrigger value="chemicals">Manage Chemicals ({chemicals.length})</TabsTrigger>
            <TabsTrigger value="saved">Saved Formulas ({savedFormulas.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            {/* Formula Name */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-lab-blue">Formula Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="formulaName">Formula Name</Label>
                  <Input
                    id="formulaName"
                    placeholder="Enter formula name..."
                    value={formulaName}
                    onChange={(e) => setFormulaName(e.target.value)}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Formula Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lab-blue">Raw Materials</span>
                  <Button onClick={addRow} size="sm" className="gap-2">
                    <Plus size={16} />
                    Add Row
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="hidden md:grid grid-cols-12 gap-4 font-semibold text-sm text-muted-foreground border-b pb-2">
                    <div className="col-span-1">#</div>
                    <div className="col-span-4">Raw Material</div>
                    <div className="col-span-2">Quantity (g)</div>
                    <div className="col-span-2">Price/kg (₹)</div>
                    <div className="col-span-2">Total (₹)</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                  
                  {/* Rows */}
                  {formulaRows.map((row, index) => (
                    <FormulaRow
                      key={row.id}
                      rowNumber={index + 1}
                      row={row}
                      chemicals={chemicals}
                      onUpdateRow={updateRow}
                      onRemoveRow={removeRow}
                      onCalculatePrice={calculateRowPrice}
                      canRemove={formulaRows.length > 1}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lab-teal">Cost Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Cost:</span>
                    <span className="font-semibold text-lg">₹{getTotalCost().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-semibold">Selling Price:</span>
                    <span className="font-bold text-xl text-success">₹{getSellingPrice().toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lab-teal">Multiplying Factor & Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="multiplyingFactor">Multiplying Factor</Label>
                    <Input
                      id="multiplyingFactor"
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="1.0"
                      value={multiplyingFactor}
                      onChange={(e) => setMultiplyingFactor(parseFloat(e.target.value) || 1.0)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Multiplying Factor:</span>
                    <span className="font-semibold">{multiplyingFactor}x</span>
                  </div>
                  <Button 
                    onClick={saveFormula} 
                    className="w-full gap-2" 
                    size="lg"
                  >
                    <Save size={18} />
                    Save Formula
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Save this formula to use it later or create variations
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chemicals">
            <ChemicalManagement
              chemicals={chemicals}
              onUpdateChemicals={setChemicals}
            />
          </TabsContent>

          <TabsContent value="saved">
            <SavedFormulas 
              formulas={savedFormulas}
              onPrintFormula={printFormula}
              onEditFormula={editFormula}
              onDuplicateFormula={duplicateFormula}
              onDeleteFormula={(id) => {
                setSavedFormulas(prev => prev.filter(f => f.id !== id));
                toast({
                  title: "Success",
                  description: "Formula deleted successfully",
                  variant: "default"
                });
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Print Template Modal */}
        {showPrintTemplate && currentFormulaToPrint && (
          <PrintTemplate
            formula={currentFormulaToPrint}
            onClose={() => {
              setShowPrintTemplate(false);
              setCurrentFormulaToPrint(null);
            }}
          />
        )}
      </div>
    </div>
  );
};