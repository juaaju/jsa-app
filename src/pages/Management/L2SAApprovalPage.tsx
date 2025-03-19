import React, { useState } from 'react';

// Sample L2SA data (in a real app, this would come from your API/backend)
const initialL2SAData = [
  {
    id: 'L1SA-2025-001',
    title: 'Pressure Vessel Maintenance',
    department: 'Maintenance',
    submittedBy: 'John Doe',
    submittedDate: '2025-03-10',
    dueDate: '2025-03-17',
    status: 'Pending Approval',
    riskLevel: 'High',
    activityType: 'Maintenance',
    location: 'Plant A - Process Unit 3',
    description: 'Inspection and maintenance of high pressure vessel V-101',
    documents: ['JSA-25-032.pdf', 'Risk Assessment.pdf', 'Procedure-PM-V101.pdf'],
    approvalFlow: [
      { role: 'Safety Officer', name: 'Sarah Johnson', status: 'Approved', date: '2025-03-11' },
      { role: 'Area Supervisor', name: 'Mike Williams', status: 'Approved', date: '2025-03-12' },
      { role: 'Department Manager', name: 'Robert Chen', status: 'Pending', date: null },
      { role: 'HSE Manager', name: 'Emily Taylor', status: 'Pending', date: null }
    ]
  },
  {
    id: 'L2SA-2025-002',
    title: 'Confined Space Entry - Tank T-305',
    department: 'Operations',
    submittedBy: 'David Wilson',
    submittedDate: '2025-03-12',
    dueDate: '2025-03-19',
    status: 'Pending Approval',
    riskLevel: 'Very High',
    activityType: 'Inspection',
    location: 'Plant B - Tank Farm',
    description: 'Internal inspection of storage tank T-305 requiring confined space entry',
    documents: ['Confined-Space-Permit.pdf', 'Gas-Test-Results.pdf', 'T305-Inspection-Plan.pdf'],
    approvalFlow: [
      { role: 'Safety Officer', name: 'Mark Adams', status: 'Approved', date: '2025-03-13' },
      { role: 'Area Supervisor', name: 'Jennifer Lopez', status: 'Approved', date: '2025-03-14' },
      { role: 'Department Manager', name: 'James Smith', status: 'Pending', date: null },
      { role: 'HSE Manager', name: 'Emily Taylor', status: 'Pending', date: null }
    ]
  },
  {
    id: 'L2SA-2025-003',
    title: 'Hot Work - Pipeline Modification',
    department: 'Projects',
    submittedBy: 'Lisa Chang',
    submittedDate: '2025-03-13',
    dueDate: '2025-03-20',
    status: 'Pending Approval',
    riskLevel: 'High',
    activityType: 'Construction',
    location: 'Plant A - Piperack Section 2',
    description: 'Welding and cutting activities for pipeline modification project P-203',
    documents: ['Hot-Work-Permit.pdf', 'JSA-25-045.pdf', 'Fire-Watch-Plan.pdf'],
    approvalFlow: [
      { role: 'Safety Officer', name: 'Sarah Johnson', status: 'Approved', date: '2025-03-14' },
      { role: 'Area Supervisor', name: 'Thomas Brown', status: 'Approved', date: '2025-03-15' },
      { role: 'Department Manager', name: 'Ahmed Hassan', status: 'Pending', date: null },
      { role: 'HSE Manager', name: 'Emily Taylor', status: 'Pending', date: null }
    ]
  },
  {
    id: 'L2SA-2025-004',
    title: 'Chemical Unloading Operation',
    department: 'Logistics',
    submittedBy: 'Kevin Martin',
    submittedDate: '2025-03-15',
    dueDate: '2025-03-22',
    status: 'Pending Approval',
    riskLevel: 'High',
    activityType: 'Material Handling',
    location: 'Chemical Storage Area',
    description: 'Unloading of hazardous chemicals from tanker truck to storage tanks',
    documents: ['Chemical-Handling-Procedure.pdf', 'SDS-Sheets.pdf', 'Emergency-Response-Plan.pdf'],
    approvalFlow: [
      { role: 'Safety Officer', name: 'Paul Rodriguez', status: 'Approved', date: '2025-03-16' },
      { role: 'Area Supervisor', name: 'Samantha Lee', status: 'Approved', date: '2025-03-16' },
      { role: 'Department Manager', name: 'Daniel White', status: 'Pending', date: null },
      { role: 'HSE Manager', name: 'Emily Taylor', status: 'Pending', date: null }
    ]
  },
  {
    id: 'L2SA-2025-005',
    title: 'Scaffold Erection for Tower Maintenance',
    department: 'Maintenance',
    submittedBy: 'Michael Johnson',
    submittedDate: '2025-03-16',
    dueDate: '2025-03-23',
    status: 'Pending Approval',
    riskLevel: 'Medium',
    activityType: 'Working at Height',
    location: 'Plant C - Distillation Unit',
    description: 'Erection of scaffolding around distillation tower for upcoming maintenance turnaround',
    documents: ['Scaffold-Plan.pdf', 'Height-Work-JSA.pdf', 'Load-Calculations.pdf'],
    approvalFlow: [
      { role: 'Safety Officer', name: 'Mark Adams', status: 'Approved', date: '2025-03-17' },
      { role: 'Area Supervisor', name: 'Ryan Cooper', status: 'Approved', date: '2025-03-17' },
      { role: 'Department Manager', name: 'Robert Chen', status: 'Pending', date: null },
      { role: 'HSE Manager', name: 'Emily Taylor', status: 'Pending', date: null }
    ]
  }
];

const L2SAApprovalPage = () => {
  const [l2saData, setL2saData] = useState(initialL2SAData);
  const [selectedL2SA, setSelectedL2SA] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [comments, setComments] = useState('');
  
  // Filter L2SA data based on status and search term
  const filteredL2SA = l2saData.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesStatus && matchesSearch;
  });

  // Handle document selection
  const handleSelectL2SA = (l2sa) => {
    setSelectedL2SA(l2sa);
    setComments('');
  };

  // Get color class based on risk level
  const getRiskLevelColor = (level) => {
    switch(level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Very High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100';
    }
  };
  
  // Handle document approval
  const handleApprove = () => {
    if (!selectedL2SA) return;
    
    // Find the next pending approval step
    const pendingApprovalIndex = selectedL2SA.approvalFlow.findIndex(step => step.status === 'Pending');
    
    if (pendingApprovalIndex >= 0) {
      // Update the approval flow
      const updatedL2SA = {
        ...selectedL2SA,
        approvalFlow: selectedL2SA.approvalFlow.map((step, index) => {
          if (index === pendingApprovalIndex) {
            return {
              ...step,
              status: 'Approved',
              date: new Date().toISOString().split('T')[0]
            };
          }
          return step;
        })
      };
      
      // Check if all steps are approved
      const allApproved = updatedL2SA.approvalFlow.every(step => step.status === 'Approved');
      if (allApproved) {
        updatedL2SA.status = 'Approved';
      }
      
      // Update state
      setL2saData(l2saData.map(item => 
        item.id === selectedL2SA.id ? updatedL2SA : item
      ));
      setSelectedL2SA(updatedL2SA);
      
      // Reset comments
      setComments('');
    }
  };
  
  // Handle document rejection
  const handleReject = () => {
    if (!selectedL2SA || !comments.trim()) return;
    
    // Find the next pending approval step
    const pendingApprovalIndex = selectedL2SA.approvalFlow.findIndex(step => step.status === 'Pending');
    
    if (pendingApprovalIndex >= 0) {
      // Update the approval flow
      const updatedL2SA = {
        ...selectedL2SA,
        status: 'Rejected',
        approvalFlow: selectedL2SA.approvalFlow.map((step, index) => {
          if (index === pendingApprovalIndex) {
            return {
              ...step,
              status: 'Rejected',
              date: new Date().toISOString().split('T')[0],
              comments: comments
            };
          }
          return step;
        })
      };
      
      // Update state
      setL2saData(l2saData.map(item => 
        item.id === selectedL2SA.id ? updatedL2SA : item
      ));
      setSelectedL2SA(updatedL2SA);
      
      // Reset comments
      setComments('');
    }
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Pending Approval': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h1 className="text-xl font-bold">JSA Approval</h1>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Left panel - L2SA List */}
          <div className="w-full md:w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-220px)]">
              {filteredL2SA.map((l2sa) => (
                <div 
                  key={l2sa.id} 
                  className={`p-4 border-b border-gray-200 cursor-pointer ${selectedL2SA && selectedL2SA.id === l2sa.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => handleSelectL2SA(l2sa)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-blue-900">{l2sa.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(l2sa.status)}`}>
                      {l2sa.status}
                    </span>
                  </div>
                  <h3 className="font-medium mb-1">{l2sa.title}</h3>
                  <div className="text-sm text-gray-600 mb-1">
                    <span>{l2sa.department} | </span>
                    <span>Submitted: {l2sa.submittedDate}</span>
                  </div>
                  <div className="text-sm">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getRiskLevelColor(l2sa.riskLevel)}`}>
                      {l2sa.riskLevel} Risk
                    </span>
                    <span className="text-gray-500 ml-2">Due: {l2sa.dueDate}</span>
                  </div>
                </div>
              ))}
              
              {filteredL2SA.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No L2SA documents match your filters
                </div>
              )}
            </div>
          </div>
          
          {/* Right panel - L2SA Details */}
          <div className="w-full md:w-2/3 p-4">
            {selectedL2SA ? (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{selectedL2SA.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(selectedL2SA.status)}`}>
                      {selectedL2SA.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Document ID</p>
                      <p>{selectedL2SA.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p>{selectedL2SA.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Activity Type</p>
                      <p>{selectedL2SA.activityType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p>{selectedL2SA.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submitted By</p>
                      <p>{selectedL2SA.submittedBy} on {selectedL2SA.submittedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Risk Level</p>
                      <p className={`inline-block px-2 py-1 rounded-full text-sm ${getRiskLevelColor(selectedL2SA.riskLevel)}`}>
                        {selectedL2SA.riskLevel}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="bg-gray-50 p-3 rounded-md">{selectedL2SA.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Attached Documents</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedL2SA.documents.map((doc, index) => (
                        <div key={index} className="bg-gray-100 px-3 py-2 rounded-md flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Approval Flow</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedL2SA.approvalFlow.map((step, index) => (
                            <tr key={index} className="border-t border-gray-200">
                              <td className="px-4 py-2">{step.role}</td>
                              <td className="px-4 py-2">{step.name}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(step.status)}`}>
                                  {step.status}
                                </span>
                              </td>
                              <td className="px-4 py-2">{step.date || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Comments and approval/rejection section */}
                  {selectedL2SA.status === 'Pending Approval' && (
                    <div>
                      <h3 className="font-medium mb-2">Decision</h3>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-md mb-4"
                        rows="4"
                        placeholder="Enter your comments or feedback here..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                      ></textarea>
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                          onClick={handleReject}
                          disabled={!comments.trim()}
                        >
                          Reject
                        </button>
                        <button
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                          onClick={handleApprove}
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {selectedL2SA.status === 'Rejected' && (
                    <div className="bg-red-50 p-4 rounded-md border border-red-200">
                      <h3 className="font-medium text-red-800 mb-2">Rejection Reason</h3>
                      <p className="text-red-700">
                        {selectedL2SA.approvalFlow.find(step => step.status === 'Rejected')?.comments || 'No comments provided'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p>Select an L2SA document to review</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default L2SAApprovalPage;