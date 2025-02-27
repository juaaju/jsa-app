import React from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield, ChevronRight } from 'lucide-react';

const RiskAnalysisPage = () => {
    const navigate = useNavigate(); // Hook untuk pindah halaman
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">AI Risk Analysis</h1>

      {/* Job Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Job Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Job Type</p>
              <p className="font-medium">Working at Height</p>
            </div>
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium">Plant A - Level 2</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">24 Feb 2025</p>
            </div>
            <div>
              <p className="text-gray-500">Team Size</p>
              <p className="font-medium">4 persons</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AI Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="font-medium">High Risk Assessment</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Based on historical data and current conditions, this job has been assessed as high risk.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-sm text-gray-500">Probability</p>
                  <p className="font-medium">4/5 (Likely)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Severity</p>
                  <p className="font-medium">4/5 (Critical)</p>
                </div>
              </div>
            </div>

            {/* Identified Hazards */}
            <div>
              <h3 className="font-medium mb-2">Identified Hazards</h3>
              <div className="space-y-2">
                {[
                  { hazard: 'Fall from height', prob: 'High', severity: 'Critical' },
                  { hazard: 'Falling objects', prob: 'Medium', severity: 'Major' },
                  { hazard: 'Weather conditions', prob: 'Medium', severity: 'Moderate' }
                ].map((item, index) => (
                  <div key={index} className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.hazard}</p>
                      <p className="text-sm text-gray-500">
                        Probability: {item.prob} | Severity: {item.severity}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Incidents */}
            <div>
              <h3 className="font-medium mb-2">Similar Historical Incidents</h3>
              <div className="text-sm text-gray-600">
                <p>• 2 incidents in the last 12 months</p>
                <p>• 5 near-misses reported in similar conditions</p>
                <p>• Common factors: inadequate fall protection, poor weather</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button className="px-4 py-2 border rounded hover:bg-gray-100">
              Review Details
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => navigate("/actions")}>
              Continue to Controls
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAnalysisPage;