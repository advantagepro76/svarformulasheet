import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Pencil, Check } from 'lucide-react';
import { Chemical } from '@/types/chemical';
import ExcelImport from './ExcelImport';

interface ChemicalStorageProps {
  chemicals: Chemical[];
  onChemicalsChange: (chemicals: Chemical[]) => void;
}

const ChemicalStorage: React.FC<ChemicalStorageProps> = ({ chemicals, onChemicalsChange }) => {
  const [newChemical, setNewChemical] = useState({ name: '', pricePerKg: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [edited, setEdited] = useState<{ name: string; pricePerKg: string }>({
    name: '',
    pricePerKg: ''
  });

  const addChemical = () => {
    if (newChemical.name && newChemical.pricePerKg) {
      const chemical: Chemical = {
        id: Date.now().toString(),
        name: newChemical.name,
        pricePerKg: parseFloat(newChemical.pricePerKg)
      };
      onChemicalsChange([...chemicals, chemical]);
      setNewChemical({ name: '', pricePerKg: '' });
    }
  };

  const removeChemical = (id: string) => {
    onChemicalsChange(chemicals.filter(chemical => chemical.id !== id));
  };

  const startEdit = (chemical: Chemical) => {
    setEditId(chemical.id);
    setEdited({
      name: chemical.name,
      pricePerKg: chemical.pricePerKg.toString()
    });
  };

  const saveEdit = (id: string) => {
    const updated = chemicals.map((chem) =>
      chem.id === id
        ? {
            ...chem,
            name: edited.name,
            pricePerKg: parseFloat(edited.pricePerKg)
          }
        : chem
    );
    onChemicalsChange(updated);
    setEditId(null);
    setEdited({ name: '', pricePerKg: '' });
  };

  const handleImport = (importedChemicals: Chemical[]) => {
    onChemicalsChange([...chemicals, ...importedChemicals]);
  };

  const filteredChemicals = chemicals.filter((chem) =>
    chem.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <ExcelImport onImport={handleImport} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            Chemical Data Storage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Chemical name"
              value={newChemical.name}
              onChange={(e) =>
                setNewChemical({ ...newChemical, name: e.target.value })
              }
              className="flex-1"
            />
            <Input
              placeholder="Price per kg (₹)"
              type="number"
              step="0.01"
              value={newChemical.pricePerKg}
              onChange={(e) =>
                setNewChemical({ ...newChemical, pricePerKg: e.target.value })
              }
              className="w-40"
            />
            <Button
              onClick={addChemical}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Input
            placeholder="Search chemical..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-3"
          />

          <div className="max-h-60 overflow-y-auto">
            <div className="grid grid-cols-1 gap-2">
              {filteredChemicals.map((chemical) => (
                <div
                  key={chemical.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  {editId === chemical.id ? (
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <Input
                        value={edited.name}
                        onChange={(e) =>
                          setEdited({ ...edited, name: e.target.value })
                        }
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        value={edited.pricePerKg}
                        onChange={(e) =>
                          setEdited({ ...edited, pricePerKg: e.target.value })
                        }
                        className="w-40"
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <span className="font-medium">{chemical.name}</span>
                      <span className="ml-4 text-gray-600">
                        ₹{chemical.pricePerKg.toFixed(2)}/kg
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 ml-2">
                    {editId === chemical.id ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => saveEdit(chemical.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(chemical)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeChemical(chemical.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredChemicals.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No chemicals match your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChemicalStorage;

