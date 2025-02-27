import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

const RecommendedActionsPage = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Recommended Control Measures</h1>

      {/* Risk Summary */}
      <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="font-medium">High Risk Job</h3>
        </div>
        <p className="text-sm text-gray-600">
          Additional approval and strict control measures required
        </p>
      </div>

      {/* Control Measures */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Required Control Measures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Engineering Controls */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium mb-2">Engineering Controls</h3>
              <div className="space-y-2">
                {[
                  'Install temporary guardrails',
                  'Setup proper anchor points',
                  'Deploy safety nets',
                  'Ensure proper lighting'
                ].map((item, index) => (
                  <label key={index} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Administrative Controls */}
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-medium mb-2">Administrative Controls</h3>
              <div className="space-y-2">
                {[
                  'Conduct pre-work briefing',
                  'Verify worker certifications',
                  'Establish communication protocol',
                  'Mark restricted areas'
                ].map((item, index) => (
                  <label key={index} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PPE Requirements */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium mb-2">PPE Requirements</h3>
              <div className="space-y-2">
                {[
                  'Full body harness',
                  'Double lanyard',
                  'Safety helmet with chinstrap',
                  'Non-slip safety boots',
                  'High visibility vest'
                ].map((item, index) => (
                  <label key={index} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Required Permits */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium mb-2">Required Permits</h3>
              <div className="space-y-2">
                {[
                  'Working at Height Permit',
                  'Area Access Permit',
                  'Equipment Usage Permit'
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{item}</span>
                    <button className="text-sm text-blue-500">Request</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Response */}
          <div className="mt-6 p-4 bg-orange-50 rounded">
            <h3 className="font-medium mb-2">Emergency Response Plan</h3>
            <div className="text-sm space-y-2">
              <p>• Emergency Contact: Safety Officer (Ext. 555)</p>
              <p>• Nearest First Aid: Level 2 Medical Room</p>
              <p>• Assembly Point: Car Park A</p>
              <p>• Rescue Equipment: Emergency Descent Kit</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button className="px-4 py-2 border rounded hover:bg-gray-100">
              Save Draft
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Confirm & Implement
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendedActionsPage;