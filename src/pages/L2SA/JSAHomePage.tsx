import React from 'react';
import { useNavigate } from 'react-router-dom';

const JSAHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome to Safety Analysis System</h1>
        <p className="text-gray-600">Job Safety Analysis</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div 
          className="bg-green-50 border border-green-200 rounded-lg p-6 cursor-pointer hover:bg-green-100"
          onClick={() => navigate('/new-l2sa')}
        >
          <h3 className="font-bold mb-2">Create New L2SA</h3>
          <p className="text-sm text-gray-600">Start a new Level 2 Safety Analysis</p>
        </div>
        <div 
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 cursor-pointer hover:bg-yellow-100"
          onClick={() => navigate('/new-l1sa')}
        >
          <h3 className="font-bold mb-2">Create New L1SA</h3>
          <p className="text-sm text-gray-600">Start a new Level 1 Safety Analysis</p>
        </div>

        <div 
          className="bg-red-50 border border-red-200 rounded-lg p-6 cursor-pointer hover:bg-red-100"
          onClick={() => navigate('/history')}
        >
          <h3 className="font-bold mb-2">History</h3>
          <p className="text-sm text-gray-600">View past and ongoing L2SA or L1SA</p>
        </div>
      </div>

      {/* Recent JSAs */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Recent</h2>
        <div className="space-y-3">
          {[
            { id: 'L2SA-001', title: 'Scaffold Installation', status: 'In Progress', risk: 'High' },
            { id: 'L1SA-002', title: 'Electrical Maintenance', status: 'Completed', risk: 'Medium' },
            { id: 'L2SA-003', title: 'Chemical Transfer', status: 'Pending Review', risk: 'High' },
          ].map((jsa) => (
            <div key={jsa.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
              <div>
                <p className="font-medium">{jsa.title}</p>
                <p className="text-sm text-gray-500">{jsa.id}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  jsa.risk === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {jsa.risk}
                </span>
                <span className="text-sm text-gray-500">{jsa.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm text-gray-500">Active</h3>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm text-gray-500">High Risk Tasks</h3>
          <p className="text-2xl font-bold text-red-600">8</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm text-gray-500">Completed Today</h3>
          <p className="text-2xl font-bold text-green-600">12</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm text-gray-500">Pending Review</h3>
          <p className="text-2xl font-bold text-yellow-600">5</p>
        </div>
      </div>
    </div>
  );
};

export default JSAHomePage;