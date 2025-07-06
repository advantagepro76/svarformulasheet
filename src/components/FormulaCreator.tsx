import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Save, Printer } from 'lucide-react';
import { Chemical, FormulaItem } from '@/types/chemical';
import FormulaRow from './FormulaRow';
import { useToast } from "@/hooks/use-toast";

interface FormulaCreatorProps {
  chemicals: Chemical[];
}

const FormulaCreator: React.FC<FormulaCreatorProps> = ({ chemicals }) => {
  const [formulaItems, setFormulaItems] = useState<FormulaItem[]>([{
    id: '1', rawMaterial: '', quantityInGrams: 0, pricePerKg: 0, totalPrice: 0
  }]);
  const [formulaName, setFormulaName] = useState('');
  const [multiplyingFactor, setMultiplyingFactor] = useState(1);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const { toast } = useToast();

  const addNewRow = () => {
    const newItem: FormulaItem = {
      id: Date.now().toString(), rawMaterial: '', quantityInGrams: 0, pricePerKg: 0, totalPrice: 0
    };
    setFormulaItems([...formulaItems, newItem]);
  };

  const updateItem = (index: number, updatedItem: FormulaItem) => {
    const newItems = [...formulaItems];
    newItems[index] = updatedItem;
    setFormulaItems(newItems);
  };

  const removeItem = (index: number) => {
    if (formulaItems.length > 1) {
      const newItems = formulaItems.filter((_, i) => i !== index);
      setFormulaItems(newItems);
    }
  };

  const getTotalCost = () => formulaItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const getTotalQuantity = () => formulaItems.reduce((sum, item) => sum + item.quantityInGrams, 0);
  const getSellingPrice = () => getTotalCost() * multiplyingFactor;

  useEffect(() => {
    const totalQuantity = getTotalQuantity();
    if (totalQuantity > 0) {
      const updatedItems = formulaItems.map(item => ({
        ...item,
        totalPrice: item.quantityInGrams > 0 && item.pricePerKg > 0
          ? (item.quantityInGrams * item.pricePerKg) / totalQuantity
          : 0
      }));
      setFormulaItems(updatedItems);
    }
  }, [formulaItems.map(item => item.quantityInGrams).join(',')]);

  const generateFormulaCode = () => {
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `AV${timestamp}${random}`;
  };

  const handleSaveFormula = async () => {
    if (!formulaName.trim()) {
      toast({
        title: "Formula Name Required",
        description: "Please enter a name for your formula.",
        variant: "destructive",
      });
      return;
    }

    const validItems = formulaItems.filter(item => item.rawMaterial && item.quantityInGrams > 0);
    if (validItems.length === 0) {
      toast({
        title: "No Valid Items",
        description: "Please add at least one raw material with quantity.",
        variant: "destructive",
      });
      return;
    }

    const savedFormula = {
      id: Date.now().toString(),
      code: generateFormulaCode(),
      name: formulaName,
      totalCost: getTotalCost(),
      totalQuantity: getTotalQuantity(),
      createdAt: new Date().toISOString(),
      items: validItems
    };

    try {
      const previous = JSON.parse(localStorage.getItem('savedFormulas') || '[]');
      localStorage.setItem('savedFormulas', JSON.stringify([...previous, savedFormula]));

      setShowSaveDialog(false);
      setFormulaName('');

      toast({
        title: "Formula Saved",
        description: `Saved with code: ${savedFormula.code}`,
      });
    } catch (err) {
      toast({
        title: "Save Failed",
        description: "Could not save formula to local storage",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    const validItems = formulaItems.filter(item => item.rawMaterial && item.quantityInGrams > 0);
    if (validItems.length === 0) {
      toast({ title: "No Valid Items", description: "Please add at least one raw material with quantity to print.", variant: "destructive" });
      return;
    }
    const totalQuantity = getTotalQuantity();
    const sellingPrice = getSellingPrice();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Chemical Formula</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .summary { margin-top: 20px; font-size: 16px; }
              .summary span { display: block; margin-bottom: 6px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Chemical Formula</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Raw Material</th>
                  <th>Quantity (g)</th>
                </tr>
              </thead>
              <tbody>
                ${validItems.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.rawMaterial}</td>
                    <td>${item.quantityInGrams.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="summary">
              <span><strong>Total Quantity:</strong> ${totalQuantity.toFixed(2)} g</span>
              <span><strong>Selling Price:</strong> ₹${sellingPrice.toFixed(4)}</span>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">Formula Creator</span>
          <div className="flex gap-2">
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2 text-sm">
                  <Save className="w-4 h-4" /> Save
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md">
                <DialogHeader>
                  <DialogTitle>Save Formula</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter formula name"
                    value={formulaName}
                    onChange={(e) => setFormulaName(e.target.value)}
                  />
                  <Button onClick={handleSaveFormula} className="w-full">Save Formula</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2 text-sm">
              <Printer className="w-4 h-4" /> Print
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 sm:p-6">
        <div className="space-y-2 mb-4">
          {formulaItems.map((item, index) => (
            <FormulaRow
              key={item.id}
              item={item}
              index={index}
              chemicals={chemicals}
              totalQuantity={getTotalQuantity()}
              onUpdate={(updatedItem) => updateItem(index, updatedItem)}
              onRemove={() => removeItem(index)}
            />
          ))}
        </div>

        <div className="flex justify-center mb-6">
          <Button
            onClick={addNewRow}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Raw Material
          </Button>
        </div>

        {/* Summary Section */}
        <div className="border-t pt-6 mt-6 space-y-6">
          {/* Totals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-center p-6 rounded-xl bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">{getTotalQuantity().toFixed(2)} g</div>
              <div className="text-sm text-gray-600">Total Quantity</div>
            </div>

            <div className="text-center p-6 rounded-xl bg-green-50">
              <div className="text-2xl font-bold text-green-600">₹{getTotalCost().toFixed(4)}</div>
              <div className="text-sm text-gray-600">Total Cost</div>
            </div>
          </div>

          {/* Multiplying Factor Input */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Multiplying Factor</label>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              value={multiplyingFactor}
              onChange={(e) => setMultiplyingFactor(Number(e.target.value))}
              className="max-w-xs"
            />
          </div>

          {/* Selling Price */}
          <div className="text-center p-6 rounded-xl bg-purple-50">
            <div className="text-2xl font-bold text-purple-600">₹{getSellingPrice().toFixed(4)}</div>
            <div className="text-sm text-gray-600">Selling Price (Total Cost × {multiplyingFactor})</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormulaCreator;
