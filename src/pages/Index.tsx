
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calculator, Database, Beaker } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Chemical Formula Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Streamline your chemical formula creation with intelligent suggestions, 
            automatic pricing calculations, and comprehensive data management.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Chemical Database</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Store and manage your chemical inventory with real-time pricing data
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Beaker className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Smart Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Get intelligent chemical name suggestions as you type your formulas
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Auto Calculation</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Automatic cost calculations based on quantity and current pricing
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate('/formula')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Creating Formulas
          </Button>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6 text-sm">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-2 font-bold">1</div>
                <p className="text-gray-600">Add chemicals to your database with prices</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mb-2 font-bold">2</div>
                <p className="text-gray-600">Start typing chemical names for suggestions</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mb-2 font-bold">3</div>
                <p className="text-gray-600">Enter quantities in grams</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mb-2 font-bold">4</div>
                <p className="text-gray-600">Get automatic cost calculations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
