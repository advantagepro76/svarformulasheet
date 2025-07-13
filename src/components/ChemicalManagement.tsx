import {
  addChemicalToFirebase,
  fetchChemicals,
  updateChemicalInFirebase
} from "@/lib/firebaseFunctions";

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Download, Upload, Edit, Save, X, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Chemical } from './FormulaPage';

interface ChemicalManagementProps {
  chemicals: Chemical[];
  onUpdateChemicals: (chemicals: Chemical[]) => void;
}

export const ChemicalManagement: React.FC<ChemicalManagementProps> = ({
  chemicals,
  onUpdateChemicals
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [newChemicalName, setNewChemicalName] = useState('');
  const [newChemicalPrice, setNewChemicalPrice] = useState('');

  const filteredChemicals = chemicals.filter(chemical =>
    chemical.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadTemplate = useCallback(() => {
    const csvContent = "Chemical Name,Price Per Kg\nSample Chemical 1,25.50\nSample Chemical 2,30.00";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chemical_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Template downloaded successfully!",
      variant: "default"
    });
  }, [toast]);

  const handleBulkUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').slice(1); // Skip header
        const newChemicals: Chemical[] = [];

        lines.forEach((line, index) => {
          const [name, price] = line.split(',');
          if (name && price && name.trim() && price.trim()) {
            const cleanName = name.trim().replace(/"/g, '');
            const cleanPrice = parseFloat(price.trim().replace(/"/g, ''));
            
            if (!isNaN(cleanPrice)) {
              newChemicals.push({
                id: `bulk_${Date.now()}_${index}`,
                name: cleanName,
                pricePerKg: cleanPrice
              });
            }
          }
        });

        if (newChemicals.length > 0) {
          onUpdateChemicals([...chemicals, ...newChemicals]);
          toast({
            title: "Success",
            description: `${newChemicals.length} chemicals imported successfully!`,
            variant: "default"
          });
        } else {
          toast({
            title: "Error",
            description: "No valid chemicals found in the file",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to parse the uploaded file",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [chemicals, onUpdateChemicals, toast]);

  const startEdit = useCallback((chemical: Chemical) => {
    setEditingId(chemical.id);
    setEditName(chemical.name);
    setEditPrice(chemical.pricePerKg.toString());
  }, []);

  const saveEdit = useCallback(() => {
    if (!editName.trim() || !editPrice.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both name and price",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(editPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive"
      });
      return;
    }

    const updatedChemicals = chemicals.map(chemical =>
      chemical.id === editingId
        ? { ...chemical, name: editName.trim(), pricePerKg: price }
        : chemical
    );

    onUpdateChemicals(updatedChemicals);
    setEditingId(null);
    setEditName('');
    setEditPrice('');
    
    toast({
      title: "Success",
      description: "Chemical updated successfully!",
      variant: "default"
    });
  }, [editingId, editName, editPrice, chemicals, onUpdateChemicals, toast]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditName('');
    setEditPrice('');
  }, []);

  const addNewChemical = useCallback(() => {
    if (!newChemicalName.trim() || !newChemicalPrice.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both name and price",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(newChemicalPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive"
      });
      return;
    }

    const newChemical: Chemical = {
      id: Date.now().toString(),
      name: newChemicalName.trim(),
      pricePerKg: price
    };

    onUpdateChemicals([...chemicals, newChemical]);
    setNewChemicalName('');
    setNewChemicalPrice('');
    
    toast({
      title: "Success",
      description: "Chemical added successfully!",
      variant: "default"
    });
  }, [newChemicalName, newChemicalPrice, chemicals, onUpdateChemicals, toast]);

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lab-purple">
            <FileSpreadsheet size={20} />
            Chemical Database Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search chemicals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={downloadTemplate} variant="outline" className="gap-2">
                <Download size={16} />
                Download Template
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleBulkUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="gap-2">
                  <Upload size={16} />
                  Bulk Upload
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Chemical */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lab-orange">Add New Chemical</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newName">Chemical Name</Label>
              <Input
                id="newName"
                placeholder="Enter chemical name..."
                value={newChemicalName}
                onChange={(e) => setNewChemicalName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPrice">Price per Kg (₹)</Label>
              <Input
                id="newPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={newChemicalPrice}
                onChange={(e) => setNewChemicalPrice(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addNewChemical} className="w-full gap-2">
                <Plus size={16} />
                Add Chemical
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chemicals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lab-teal">
            Chemical Database ({filteredChemicals.length} chemicals)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Chemical Name</TableHead>
                  <TableHead className="w-[150px]">Price per Kg (₹)</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChemicals.map((chemical, index) => (
                  <TableRow key={chemical.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      {editingId === chemical.id ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        chemical.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === chemical.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        `₹${chemical.pricePerKg.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === chemical.id ? (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={saveEdit} className="h-8 w-8 p-0">
                            <Save size={14} />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8 w-8 p-0">
                            <X size={14} />
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => startEdit(chemical)} className="h-8 w-8 p-0">
                          <Edit size={14} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredChemicals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No chemicals found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};