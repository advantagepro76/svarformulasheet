import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SavedFormula } from "@/types/chemical";

const FormulaDashboard = () => {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/formulas")
      .then(res => res.json())
      .then(data => {
        setFormulas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching formulas", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="grid gap-6 p-6">
      <h2 className="text-xl font-semibold">Saved Formulas</h2>
      {loading ? <p>Loading...</p> : formulas.length === 0 ? <p>No formulas saved yet.</p> : (
        formulas.map(formula => (
          <Card key={formula.id}>
            <CardHeader>
              <CardTitle>{formula.name} ({formula.code})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p><strong>Total Cost:</strong> ₹{formula.totalCost.toFixed(2)}</p>
              <p><strong>Total Quantity:</strong> {formula.totalQuantity.toFixed(2)} g</p>
              <p><strong>Items:</strong> {formula.items.length}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default FormulaDashboard;
