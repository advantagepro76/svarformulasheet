import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Printer, Trash2, Calendar, Calculator, Edit, Copy } from 'lucide-react';
import { SavedFormula } from './FormulaPage';

interface SavedFormulasProps {
  formulas: SavedFormula[];
  onPrintFormula: (formula: SavedFormula) => void;
  onDeleteFormula: (id: string) => void;
  onEditFormula?: (formula: SavedFormula) => void;
  onDuplicateFormula?: (formula: SavedFormula) => void;
}

export const SavedFormulas: React.FC<SavedFormulasProps> = ({
  formulas,
  onPrintFormula,
  onDeleteFormula,
  onEditFormula,
  onDuplicateFormula
}) => {
  if (formulas.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Calculator size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground">No Saved Formulas</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Create your first formula using the "Create Formula" tab. All saved formulas will appear here for easy access and management.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {formulas.map((formula) => (
          <Card key={formula.id} className="overflow-hidden">
            <CardHeader className="bg-lab-light/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl text-lab-blue">{formula.name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formula.createdAt.toLocaleDateString()}
                    </div>
                    <Badge variant="secondary">
                      {formula.rows.length} chemicals
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditFormula?.(formula)}
                    className="gap-2"
                  >
                    <Edit size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDuplicateFormula?.(formula)}
                    className="gap-2"
                  >
                    <Copy size={14} />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPrintFormula(formula)}
                    className="gap-2"
                  >
                    <Printer size={14} />
                    Print
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteFormula(formula.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Raw Materials */}
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3">Raw Materials</h4>
                  <div className="grid gap-2">
                    {formula.rows.map((row, index) => (
                      <div key={row.id} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-muted-foreground w-6">
                            {index + 1}.
                          </span>
                          <span className="font-medium">{row.chemical?.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">{row.quantity}g</span>
                          <span className="font-semibold">₹{row.calculatedPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Cost Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Cost</div>
                    <div className="text-lg font-semibold">₹{formula.totalCost.toFixed(2)}</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground">Multiplier</div>
                    <div className="text-lg font-semibold">{formula.multiplyingFactor}x</div>
                  </div>
                  <div className="text-center p-4 bg-success/10 rounded-lg">
                    <div className="text-sm text-muted-foreground">Selling Price</div>
                    <div className="text-lg font-bold text-success">₹{formula.sellingPrice.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};