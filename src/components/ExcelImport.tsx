
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chemical } from '@/types/chemical';
import { useToast } from "@/hooks/use-toast";

interface ExcelImportProps {
  onImport: (chemicals: Chemical[]) => void;
}

const ExcelImport: React.FC<ExcelImportProps> = ({ onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const chemicals: Chemical[] = [];

        // Skip header row and process data
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
          if (columns.length >= 2) {
            const name = columns[0];
            const price = parseFloat(columns[1]);
            
            if (name && !isNaN(price)) {
              chemicals.push({
                id: Date.now().toString() + i,
                name: name,
                pricePerKg: price
              });
            }
          }
        }

        if (chemicals.length > 0) {
          onImport(chemicals);
          toast({
            title: "Import Successful",
            description: `Successfully imported ${chemicals.length} chemicals.`,
          });
        } else {
          toast({
            title: "Import Failed",
            description: "No valid data found in the file.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to parse the file. Please check the format.",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const csvContent = "Chemical Name,Price Per Kg (INR)\nPotassium Chloride,150.50\nPhosphoric Acid,320.75\nSodium Hydroxide,180.25";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chemical_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          Excel Import
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Import chemicals from CSV/Excel file. Format: Chemical Name, Price Per Kg (₹)
          </div>
          
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-600 hover:bg-green-700"
            >
              Import from Excel/CSV
            </Button>
            <Button
              onClick={downloadTemplate}
              variant="outline"
            >
              Download Template
            </Button>
          </div>
          
          <div className="text-xs text-gray-500">
            Supported formats: CSV, Excel (.xlsx, .xls)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExcelImport;
