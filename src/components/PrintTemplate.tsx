import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Printer, X } from 'lucide-react';
import { SavedFormula } from './FormulaPage';

interface PrintTemplateProps {
  formula: SavedFormula;
  onClose: () => void;
}

export const PrintTemplate: React.FC<PrintTemplateProps> = ({ formula, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Print Template - {formula.name}</span>
            <div className="flex items-center gap-2">
              <Button onClick={handlePrint} size="sm" className="gap-2">
                <Printer size={14} />
                Print
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={14} />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Print Template Content */}
        <div id="print-content" className="space-y-6 p-6 bg-white text-black">
          {/* Header */}
          <div className="text-center space-y-2 border-b-2 border-black pb-4">
            <h1 className="text-3xl font-bold">Chemical Formula</h1>
            <h2 className="text-xl font-semibold">{formula.name}</h2>
            <p className="text-sm">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          {/* Raw Materials Table */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Raw Materials</h3>
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-2 text-left">S.No.</th>
                  <th className="border border-black p-2 text-left">Raw Material Name</th>
                  <th className="border border-black p-2 text-left">Quantity (grams)</th>
                </tr>
              </thead>
              <tbody>
                {formula.rows.map((row, index) => (
                  <tr key={row.id}>
                    <td className="border border-black p-2">{index + 1}</td>
                    <td className="border border-black p-2 font-medium">{row.chemical?.name}</td>
                    <td className="border border-black p-2">{row.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing Information</h3>
            <div className="flex justify-center">
              <div className="border border-black p-4 text-center bg-gray-100">
                <div className="text-sm font-medium">Total Selling Price</div>
                <div className="text-xl font-bold">₹{formula.sellingPrice.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-black pt-4 text-center text-sm">
            <p>This formula was generated using Chemical Formula Builder</p>
            <p>Date: {new Date().toLocaleDateString()} | Time: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Print Styles */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #print-content,
            #print-content * {
              visibility: visible;
            }
            #print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white !important;
              padding: 20px;
            }
            
            /* Hide dialog elements during print */
            .dialog-overlay,
            .dialog-content > *:not(#print-content) {
              display: none !important;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};