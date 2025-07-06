import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SavedFormula } from '@/types/chemical';
import { Trash2, Eye, Printer } from 'lucide-react';

interface SavedFormulasProps {
  savedFormulas: SavedFormula[];
  onDelete: (id: string) => void;
  onLoad: (formula: SavedFormula) => void;
}

const SavedFormulas: React.FC<SavedFormulasProps> = ({ savedFormulas, onDelete, onLoad }) => {
  const [selectedFormula, setSelectedFormula] = useState<SavedFormula | null>(null);

  // Print detailed formula in a new window
  const handlePrint = (formula: SavedFormula) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Formula ${formula.code} - ${formula.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .formula-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .summary { margin-top: 20px; }
            .total { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Chemical Formula</h1>
            <h2>${formula.name}</h2>
            <p>Formula Code: ${formula.code}</p>
            <p>Created: ${new Date(formula.createdAt).toLocaleDateString()}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Raw Material</th>
                <th>Quantity (g)</th>
                <th>Price/kg (₹)</th>
                <th>Total Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${formula.items.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.rawMaterial}</td>
                  <td>${item.quantityInGrams.toFixed(2)}</td>
                  <td>₹${item.pricePerKg.toFixed(2)}</td>
                  <td>₹${item.totalPrice.toFixed(4)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="summary">
            <p class="total">Total Quantity: ${formula.totalQuantity.toFixed(2)} g</p>
            <p class="total">Total Cost: ₹${formula.totalCost.toFixed(4)}</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          Saved Formulas
        </CardTitle>
      </CardHeader>

      <CardContent>
        {savedFormulas.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No saved formulas yet. Save your first formula to get started.
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {savedFormulas.map((formula) => (
              <div
                key={formula.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{formula.name}</div>
                  <div className="text-sm text-gray-600">
                    Code: {formula.code} | Total: ₹{formula.totalCost.toFixed(4)} | {formula.totalQuantity.toFixed(2)}g
                  </div>
                  <div className="text-xs text-gray-500">
                    Created: {new Date(formula.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* View formula details dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFormula(formula)}
                        aria-label={`View details of ${formula.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{formula.name} - {formula.code}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-100 rounded-lg font-medium text-sm">
                          <div className="col-span-1">#</div>
                          <div className="col-span-4">Raw Material</div>
                          <div className="col-span-2">Quantity (g)</div>
                          <div className="col-span-2">Price/kg</div>
                          <div className="col-span-3">Total Price</div>
                        </div>
                        {formula.items.map((item, index) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-12 gap-2 items-center p-3 bg-white border rounded-lg"
                          >
                            <div className="col-span-1">{index + 1}</div>
                            <div className="col-span-4">{item.rawMaterial}</div>
                            <div className="col-span-2">{item.quantityInGrams.toFixed(2)}</div>
                            <div className="col-span-2">₹{item.pricePerKg.toFixed(2)}</div>
                            <div className="col-span-3">₹{item.totalPrice.toFixed(4)}</div>
                          </div>
                        ))}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {formula.totalQuantity.toFixed(2)} g
                            </div>
                            <div className="text-sm text-gray-600">Total Quantity</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              ₹{formula.totalCost.toFixed(4)}
                            </div>
                            <div className="text-sm text-gray-600">Total Cost</div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={() => onLoad(formula)} className="flex-1">
                            Load Formula
                          </Button>
                          <Button onClick={() => handlePrint(formula)} variant="outline">
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Quick print button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrint(formula)}
                    aria-label={`Print formula ${formula.name}`}
                  >
                    <Printer className="w-4 h-4" />
                  </Button>

                  {/* Delete button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(formula.id)}
                    className="text-red-600 hover:text-red-700"
                    aria-label={`Delete formula ${formula.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedFormulas;
