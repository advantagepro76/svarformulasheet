import React, { useState, useEffect } from 'react';
import ChemicalStorage from '@/components/ChemicalStorage';
import FormulaCreator from '@/components/FormulaCreator';
import SavedFormulas from '@/components/SavedFormulas';
import { Chemical, SavedFormula } from '@/types/chemical';

const Formula = () => {
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [savedFormulas, setSavedFormulas] = useState<SavedFormula[]>([]);

  // Load chemicals from localStorage on component mount
  useEffect(() => {
    const savedChemicals = localStorage.getItem('chemicals');
    if (savedChemicals) {
      setChemicals(JSON.parse(savedChemicals));
    } else {
      // Add some sample data with INR prices
      const sampleChemicals: Chemical[] = [
        { id: '1', name: 'Potassium Chloride', pricePerKg: 150.50 },
        { id: '2', name: 'Phosphoric Acid', pricePerKg: 320.75 },
        { id: '3', name: 'Sodium Hydroxide', pricePerKg: 180.25 },
        { id: '4', name: 'Calcium Carbonate', pricePerKg: 95.00 },
        { id: '5', name: 'Magnesium Sulfate', pricePerKg: 210.30 }
      ];
      setChemicals(sampleChemicals);
    }
  }, []);

  // Load saved formulas from localStorage
  useEffect(() => {
    const savedFormulasData = localStorage.getItem('savedFormulas');
    if (savedFormulasData) {
      setSavedFormulas(JSON.parse(savedFormulasData));
    }
  }, []);

  // Save chemicals to localStorage whenever chemicals change
  useEffect(() => {
    localStorage.setItem('chemicals', JSON.stringify(chemicals));
  }, [chemicals]);

  // Save formulas to localStorage whenever savedFormulas change
  useEffect(() => {
    localStorage.setItem('savedFormulas', JSON.stringify(savedFormulas));
  }, [savedFormulas]);

  const handleSaveFormula = (formula: SavedFormula) => {
    setSavedFormulas(prev => [...prev, formula]);
  };

  const handleDeleteFormula = (id: string) => {
    setSavedFormulas(prev => prev.filter(formula => formula.id !== id));
  };

  const handleLoadFormula = (formula: SavedFormula) => {
    // This would be handled by the FormulaCreator component
    console.log('Loading formula:', formula);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8 text-center px-2">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
            Chemical Formula Manager
          </h1>
          <p className="text-gray-600 text-sm sm:text-lg">
            Create and calculate chemical formulas with intelligent suggestions and automatic pricing in INR
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            <ChemicalStorage
              chemicals={chemicals}
              onChemicalsChange={setChemicals}
            />
            <SavedFormulas
              savedFormulas={savedFormulas}
              onDelete={handleDeleteFormula}
              onLoad={handleLoadFormula}
            />
          </div>
          
          <div className="xl:col-span-2">
            <FormulaCreator 
              chemicals={chemicals} 
              onSaveFormula={handleSaveFormula}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formula;
