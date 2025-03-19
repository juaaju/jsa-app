import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for top risks by activity
const topRiskActivities = [
  { id: 1, activity: 'Pipe Spool Replacement', totalRisk: 22, riskScore: 20 },
  { id: 2, activity: 'Proyek TAR Welding', totalRisk: 18, riskScore: 20 },
  { id: 3, activity: 'Warehouse / Storage', totalRisk: 12, riskScore: 16 },
  { id: 4, activity: 'Valve Replacement', totalRisk: 9, riskScore: 20 },
  { id: 5, activity: 'Vessel Cleaning', totalRisk: 8, riskScore: 20 },
  { id: 6, activity: 'Erect and Dismantle Scaffolding', totalRisk: 7, riskScore: 20 },
  { id: 7, activity: 'Hazardous Material Handling', totalRisk: 7, riskScore: 16 },
  { id: 8, activity: 'Maintenance Electric', totalRisk: 7, riskScore: 16 },
  { id: 9, activity: 'Maintenance Welding', totalRisk: 7, riskScore: 20 },
  { id: 10, activity: 'Demolish Activity', totalRisk: 7, riskScore: 20 },
];

// Format data for recharts
const activityChartData = topRiskActivities.map(item => ({
  name: item.activity,
  value: item.totalRisk,
}));

// Sample data for top risks by hazard
const topRiskHazards = [
  { id: 1, hazard: 'Working at Height', totalRisk: 25, riskScore: 20 },
  { id: 2, hazard: 'Hot Work', totalRisk: 20, riskScore: 20 },
  { id: 3, hazard: 'Confined Space', totalRisk: 15, riskScore: 16 },
  { id: 4, hazard: 'Chemical Exposure', totalRisk: 12, riskScore: 20 },
  { id: 5, hazard: 'Flammable Materials', totalRisk: 10, riskScore: 20 },
  { id: 6, hazard: 'Moving Machinery', totalRisk: 9, riskScore: 20 },
  { id: 7, hazard: 'Manual Handling', totalRisk: 8, riskScore: 16 },
  { id: 8, hazard: 'Electrical Hazards', totalRisk: 8, riskScore: 16 },
  { id: 9, hazard: 'Pressurized Systems', totalRisk: 7, riskScore: 20 },
  { id: 10, hazard: 'Dropped Objects', totalRisk: 7, riskScore: 20 },
];

// Format data for recharts
const hazardChartData = topRiskHazards.map(item => ({
  name: item.hazard,
  value: item.totalRisk,
}));

const TopRiskAnalysisPage = () => {
  const [tabView, setTabView] = useState('activity'); // 'activity' or 'hazard'

  // Custom label renderer for the bars
  const renderCustomBarLabel = ({ x, y, width, value }) => {
    return (
      <text x={x + width / 2} y={y - 5} fill="#000" textAnchor="middle" fontSize={12}>
        {value}
      </text>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h1 className="text-xl font-bold">Top Risk Analysis</h1>
        </div>

        {/* Tab navigation */}
        <div className="border-b">
          <div className="flex">
            <button
              className={`py-2 px-4 font-medium ${
                tabView === 'activity'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setTabView('activity')}
            >
              Top Risk by Activity
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                tabView === 'hazard'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setTabView('hazard')}
            >
              Top Risk by Hazard
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Activity Analysis */}
          {tabView === 'activity' && (
            <div>
              <h2 className="text-xl font-semibold text-center mb-6">Top 10 High Risk - Activity</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Table view */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-center">No.</th>
                        <th className="border px-4 py-2">Top 10 High Risk - Activity</th>
                        <th className="border px-4 py-2 text-center">Total Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topRiskActivities.map((risk) => (
                        <tr key={risk.id}>
                          <td className="border px-4 py-2 text-center">{risk.id}</td>
                          <td className="border px-4 py-2">{risk.activity}</td>
                          <td className="border px-4 py-2 text-center">{risk.totalRisk}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Chart view */}
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activityChartData}
                      margin={{ top: 30, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={120} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, 25]} 
                        ticks={[0, 5, 10, 15, 20, 25]} 
                      />
                      <Tooltip />
                      <Bar 
                        dataKey="value" 
                        fill="#ef4444" 
                        label={renderCustomBarLabel}
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Hazard Analysis */}
          {tabView === 'hazard' && (
            <div>
              <h2 className="text-xl font-semibold text-center mb-6">Top 10 High Risk - Hazard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Table view */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-center">No.</th>
                        <th className="border px-4 py-2">Top 10 High Risk - Hazard</th>
                        <th className="border px-4 py-2 text-center">Total Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topRiskHazards.map((risk) => (
                        <tr key={risk.id}>
                          <td className="border px-4 py-2 text-center">{risk.id}</td>
                          <td className="border px-4 py-2">{risk.hazard}</td>
                          <td className="border px-4 py-2 text-center">{risk.totalRisk}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Chart view */}
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={hazardChartData}
                      margin={{ top: 30, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={120} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, 25]} 
                        ticks={[0, 5, 10, 15, 20, 25]} 
                      />
                      <Tooltip />
                      <Bar 
                        dataKey="value" 
                        fill="#ef4444" 
                        label={renderCustomBarLabel}
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopRiskAnalysisPage;