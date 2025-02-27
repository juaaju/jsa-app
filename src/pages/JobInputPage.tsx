import { Routes, Route, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, MapPin, Calendar, Wrench, Users, Loader } from 'lucide-react';

const JobInputPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const handleAnalysis = () => {
        setIsLoading(true);
        
        // Simulate risk analysis processing time
        setTimeout(() => {
            setIsLoading(false);
            navigate("/analysis");
        }, 7000); // 2.5 seconds delay to simulate processing
    };
    
    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Create New Job Safety Analysis</h1>
            
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Job Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Job Type</label>
                            <select className="w-full p-2 border rounded">
                                <option>Working at Height</option>
                                <option>Hot Work</option>
                                <option>Confined Space</option>
                                <option>Lifting Operation</option>
                                <option>Electrical Work</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Job Description</label>
                            <textarea 
                                className="w-full p-2 border rounded"
                                rows={3}
                                placeholder="Describe the job in detail..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    <MapPin className="h-4 w-4 inline mr-1" />
                                    Location
                                </label>
                                <select className="w-full p-2 border rounded">
                                    <option>Plant A - Ground Floor</option>
                                    <option>Plant A - Level 1</option>
                                    <option>Plant B - Processing Area</option>
                                    <option>Warehouse</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    <Calendar className="h-4 w-4 inline mr-1" />
                                    Planned Date
                                </label>
                                <input 
                                    type="date"
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                <Wrench className="h-4 w-4 inline mr-1" />
                                Tools & Equipment
                            </label>
                            <div className="space-y-2">
                                {['Hand Tools', 'Power Tools', 'Scaffolding', 'Ladder', 'Welding Equipment'].map((tool) => (
                                    <label key={tool} className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        {tool}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                <Users className="h-4 w-4 inline mr-1" />
                                Work Team
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Team Size</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-2 border rounded"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Supervisor</label>
                                    <select className="w-full p-2 border rounded">
                                        <option>John Doe</option>
                                        <option>Jane Smith</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button 
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                            disabled={isLoading}
                        >
                            Save Draft
                        </button>
                        <button 
                            className={`px-4 py-2 rounded flex items-center justify-center min-w-32 ${isLoading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                            onClick={handleAnalysis}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Running Risk Analysis...
                                </>
                            ) : (
                                'Continue to Analysis'
                            )}
                        </button>
                    </div>
                    
                    {isLoading && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm">
                            <p className="font-medium mb-1">Risk Analysis in Progress</p>
                            <p className="text-gray-600">Analyzing job details and identifying potential hazards...</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default JobInputPage;