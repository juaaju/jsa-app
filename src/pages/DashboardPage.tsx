import React from 'react';

// Sample data for dashboard statistics
const statsData = [
  { title: 'Active Risks', value: '87', change: '+12%', status: 'increase' },
  { title: 'Pending Approvals', value: '23', change: '-5%', status: 'decrease' },
  { title: 'Hazards Identified', value: '156', change: '+8%', status: 'increase' },
  { title: 'Completed Actions', value: '42', change: '+15%', status: 'increase' }
];

// Sample data for recent activities
const recentActivities = [
  { id: 'ACT-001', description: 'Risk assessment updated for Pipeline Maintenance', user: 'John Doe', time: '2 hours ago', type: 'update' },
  { id: 'ACT-002', description: 'New hazard identified: Confined Space in Tank B12', user: 'Sarah Johnson', time: '4 hours ago', type: 'hazard' },
  { id: 'ACT-003', description: 'L2SA approved for Welding operations', user: 'Mike Williams', time: '1 day ago', type: 'approval' },
  { id: 'ACT-004', description: 'Risk mitigation action completed for Chemical Storage', user: 'Emily Taylor', time: '1 day ago', type: 'action' },
  { id: 'ACT-005', description: 'New JSA submitted for Scaffold Erection', user: 'Robert Chen', time: '2 days ago', type: 'submission' }
];

// Sample data for upcoming deadlines
const upcomingDeadlines = [
  { id: 'DL-001', task: 'Update Risk Assessment for Offshore Operations', deadline: 'March 28, 2025', status: 'pending' },
  { id: 'DL-002', task: 'Complete Hazard Identification for New Equipment', deadline: 'March 25, 2025', status: 'urgent' },
  { id: 'DL-003', task: 'Review L2SA for Lifting Operations', deadline: 'March 30, 2025', status: 'pending' },
  { id: 'DL-004', task: 'Implement Corrective Actions for Audit Findings', deadline: 'April 5, 2025', status: 'planned' }
];

// Sample data for risk breakdown
const riskBreakdownData = [
  { category: 'High Risk', value: 23, color: '#ef4444' },
  { category: 'Medium Risk', value: 45, color: '#f97316' },
  { category: 'Low Risk', value: 78, color: '#22c55e' }
];

// Sample data for top hazards
const topHazardsData = [
  { hazard: 'Working at Height', count: 32 },
  { hazard: 'Confined Space', count: 28 },
  { hazard: 'Hot Work', count: 24 },
  { hazard: 'Chemical Exposure', count: 18 },
  { hazard: 'Electrical', count: 14 }
];

// Dashboard Component
const DashboardPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back. Here's the current status of the risk management system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                stat.status === 'increase' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="font-semibold text-gray-800">Recent Activity</h2>
            </div>
            <div className="p-4">
              <div className="divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="py-3">
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 rounded-full p-2 mr-3 ${
                        activity.type === 'hazard' ? 'bg-red-100 text-red-600' :
                        activity.type === 'update' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'approval' ? 'bg-green-100 text-green-600' :
                        activity.type === 'action' ? 'bg-purple-100 text-purple-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {activity.type === 'hazard' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                        {activity.type === 'update' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        )}
                        {activity.type === 'approval' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {activity.type === 'action' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        )}
                        {activity.type === 'submission' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{activity.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          by {activity.user} • {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800">View All Activity</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="font-semibold text-gray-800">Upcoming Deadlines</h2>
            </div>
            <div className="p-4">
              <ul className="divide-y divide-gray-200">
                {upcomingDeadlines.map((deadline) => (
                  <li key={deadline.id} className="py-3">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium text-gray-800">{deadline.task}</div>
                      <div className={`text-xs rounded-full px-2 py-1 ${
                        deadline.status === 'urgent' 
                          ? 'bg-red-100 text-red-800' 
                          : deadline.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {deadline.deadline}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800">View All Deadlines</button>
              </div>
            </div>
          </div>

          {/* Risk Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="font-semibold text-gray-800">Risk Breakdown</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {riskBreakdownData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.category}</span>
                        <span className="text-sm font-medium text-gray-700">{item.value}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ width: `${(item.value / riskBreakdownData.reduce((acc, curr) => acc + curr.value, 0)) * 100}%`, backgroundColor: item.color }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Hazards */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="font-semibold text-gray-800">Top Hazards</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {topHazardsData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{item.hazard}</span>
                    <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;