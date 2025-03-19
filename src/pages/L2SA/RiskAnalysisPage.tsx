import React, { useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield, ChevronRight, Plus, Save, Edit, Check } from 'lucide-react';

const RiskAnalysisPage = () => {
    const navigate = useNavigate();
    const [steps, setSteps] = useState([
        {
            no: 1,
            description: "Mempersiapkan area kerja",
            hazards: "Permukaan licin",
            impacts: "Terpeleset, cedera punggung",
            initialRisk: {
                severity: 3,
                probability: 2,
                level: "Medium",
                color: "bg-yellow-500"
            },
            controls: [
                { type: "AD", description: "Briefing keselamatan sebelum memulai pekerjaan" },
                { type: "APD", description: "Penggunaan sepatu safety anti-slip" }
            ],
            controlExecutor: "John Doe",
            executorInitial: "JD",
            residualRisk: {
                severity: 2,
                probability: 1,
                level: "Low",
                color: "bg-green-500"
            },
            verificationDate: "24/02/2025",
            verificationInitial: "AB",
            isEditing: false
        },
        {
            no: 2,
            description: "Memasang perancah",
            hazards: "Jatuh dari ketinggian",
            impacts: "Cedera serius, kematian",
            initialRisk: {
                severity: 5,
                probability: 3,
                level: "High",
                color: "bg-red-500"
            },
            controls: [
                { type: "EL", description: "Evaluasi keperluan bekerja di ketinggian" },
                { type: "EC", description: "Pemasangan safety rail" },
                { type: "APD", description: "Penggunaan full body harness" }
            ],
            controlExecutor: "Jane Smith",
            executorInitial: "JS",
            residualRisk: {
                severity: 4,
                probability: 1,
                level: "Medium",
                color: "bg-yellow-500"
            },
            verificationDate: "24/02/2025",
            verificationInitial: "AB",
            isEditing: false
        }
    ]);

    const riskLevels = {
        "Low": "bg-green-500",
        "Medium": "bg-yellow-500",
        "High": "bg-red-500",
        "Extreme": "bg-purple-500"
    };

    const calculateRiskLevel = (severity, probability) => {
        const score = severity * probability;
        if (score <= 4) return {level: "Low", color: "bg-green-500"};
        if (score <= 9) return {level: "Medium", color: "bg-yellow-500"};
        if (score <= 15) return {level: "High", color: "bg-red-500"};
        return {level: "Extreme", color: "bg-purple-500"};
    };

    const controlTypes = {
        "EL": "1. Eliminasi",
        "SB": "2. Subtitusi",
        "EC": "3. Engineering",
        "AD": "4. Administratif",
        "APD": "5. Alat Pelindung Diri"
    };

    const addNewStep = () => {
        const newStep = {
            no: steps.length + 1,
            description: "",
            hazards: "",
            impacts: "",
            initialRisk: {
                severity: 1,
                probability: 1,
                level: "Low",
                color: "bg-green-500"
            },
            controls: [],
            controlExecutor: "",
            executorInitial: "",
            residualRisk: {
                severity: 1,
                probability: 1,
                level: "Low",
                color: "bg-green-500"
            },
            verificationDate: "",
            verificationInitial: "",
            isEditing: true
        };
        setSteps([...steps, newStep]);
    };

    const toggleEditMode = (index) => {
        const updatedSteps = [...steps];
        updatedSteps[index].isEditing = !updatedSteps[index].isEditing;
        setSteps(updatedSteps);
    };

    const updateStep = (index, field, value) => {
        const updatedSteps = [...steps];
        
        if (field.includes('.')) {
            const [mainField, subField] = field.split('.');
            updatedSteps[index][mainField][subField] = value;
            
            if (mainField === 'initialRisk' && (subField === 'severity' || subField === 'probability')) {
                const severity = subField === 'severity' ? value : updatedSteps[index].initialRisk.severity;
                const probability = subField === 'probability' ? value : updatedSteps[index].initialRisk.probability;
                const riskResult = calculateRiskLevel(severity, probability);
                updatedSteps[index].initialRisk.level = riskResult.level;
                updatedSteps[index].initialRisk.color = riskResult.color;
            }
            
            if (mainField === 'residualRisk' && (subField === 'severity' || subField === 'probability')) {
                const severity = subField === 'severity' ? value : updatedSteps[index].residualRisk.severity;
                const probability = subField === 'probability' ? value : updatedSteps[index].residualRisk.probability;
                const riskResult = calculateRiskLevel(severity, probability);
                updatedSteps[index].residualRisk.level = riskResult.level;
                updatedSteps[index].residualRisk.color = riskResult.color;
            }
        } else {
            updatedSteps[index][field] = value;
        }
        
        setSteps(updatedSteps);
    };

    const addControl = (stepIndex) => {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex].controls.push({ type: "AD", description: "" });
        setSteps(updatedSteps);
    };

    const updateControl = (stepIndex, controlIndex, field, value) => {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex].controls[controlIndex][field] = value;
        setSteps(updatedSteps);
    };

    const removeControl = (stepIndex, controlIndex) => {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex].controls.splice(controlIndex, 1);
        setSteps(updatedSteps);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">L2SA Risk Analysis</h1>

            {/* Job Summary */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Job Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Job Type</p>
                            <p className="font-medium">Working at Height</p>
                        </div>
                        <div>
                            <p className="text-gray-500">PTW Type</p>
                            <div className="flex items-center">
                                <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                                <p className="font-medium">Critical Work</p>
                            </div>
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
                        <div>
                            <p className="text-gray-500">Supervisor</p>
                            <p className="font-medium">John Doe</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* L2SA Table */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Level 2 Safety Analysis</CardTitle>
                        <button 
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                            onClick={addNewStep}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Step
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border p-2 text-left">No (1)</th>
                                    <th className="border p-2 text-left">Deskripsi Langkah Pekerjaan (2)</th>
                                    <th className="border p-2 text-left">Bahaya (3)</th>
                                    <th className="border p-2 text-left">Dampak (4)</th>
                                    <th className="border p-2 text-left" colSpan="3">Risiko Awal (5)</th>
                                    <th className="border p-2 text-left">Tindakan Pengendalian (6)</th>
                                    <th className="border p-2 text-left">Pelaksana (7)</th>
                                    <th className="border p-2 text-left">Paraf (8)</th>
                                    <th className="border p-2 text-left" colSpan="3">Risiko Sisa (9)</th>
                                    <th className="border p-2 text-left">Verifikasi (10)</th>
                                    <th className="border p-2 text-left">Aksi</th>
                                </tr>
                                <tr className="bg-gray-50">
                                    <th className="border p-2"></th>
                                    <th className="border p-2"></th>
                                    <th className="border p-2"></th>
                                    <th className="border p-2"></th>
                                    <th className="border p-2 text-left">Keparahan (5a)</th>
                                    <th className="border p-2 text-left">Kemungkinan (5b)</th>
                                    <th className="border p-2 text-left">Tingkat Risiko (5c)</th>
                                    <th className="border p-2"></th>
                                    <th className="border p-2"></th>
                                    <th className="border p-2"></th>
                                    <th className="border p-2 text-left">Keparahan (9a)</th>
                                    <th className="border p-2 text-left">Kemungkinan (9b)</th>
                                    <th className="border p-2 text-left">Tingkat Risiko (9c)</th>
                                    <th className="border p-2"></th>
                                    <th className="border p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {steps.map((step, stepIndex) => (
                                    <tr key={stepIndex} className="border-b">
                                        <td className="border p-2">
                                            {step.isEditing ? (
                                                <input
                                                    type="number"
                                                    className="w-12 p-1 border rounded"
                                                    value={step.no}
                                                    onChange={(e) => updateStep(stepIndex, 'no', parseInt(e.target.value))}
                                                />
                                            ) : (
                                                step.no
                                            )}
                                        </td>
                                        <td className="border p-2">
                                            {step.isEditing ? (
                                                <textarea
                                                    className="w-full p-1 border rounded"
                                                    value={step.description}
                                                    onChange={(e) => updateStep(stepIndex, 'description', e.target.value)}
                                                />
                                            ) : (
                                                step.description
                                            )}
                                        </td>
                                        <td className="border p-2">
                                            {step.isEditing ? (
                                                <textarea
                                                    className="w-full p-1 border rounded"
                                                    value={step.hazards}
                                                    onChange={(e) => updateStep(stepIndex, 'hazards', e.target.value)}
                                                />
                                            ) : (
                                                step.hazards
                                            )}
                                        </td>
                                        <td className="border p-2">
                                            {step.isEditing ? (
                                                <textarea
                                                    className="w-full p-1 border rounded"
                                                    value={step.impacts}
                                                    onChange={(e) => updateStep(stepIndex, 'impacts', e.target.value)}
                                                />
                                            ) : (
                                                step.impacts
                                            )}
                                        </td>
                                        <td className="border p-2">
                                            {step.isEditing ? (
                                                <select
                                                    className="w-full p-1 border rounded"
                                                    value={step.initialRisk.severity}
                                                    onChange={(e) => updateStep(stepIndex, 'initialRisk.severity', parseInt(e.target.value))}
                                                >
                                                    {[1, 2, 3, 4, 5].map(val => (
                                                        <option key={val} value={val}>{val}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                step.initialRisk.severity
                                            )}
                                        </td>
                                        <td className="border p-2">
                                            {step.isEditing ? (
                                                <select
                                                    className="w-full p-1 border rounded"
                                                    value={step.initialRisk.probability}
                                                    onChange={(e) => updateStep(stepIndex, 'initialRisk.probability', parseInt(e.target.value))}
                                                >
                                                    {[1, 2, 3, 4, 5].map(val => (
                                                        <option key={val} value={val}>{val}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                step.initialRisk.probability
                                            )}
                                        </td>
                                        <td className="border p-2">
                                            <div className={`rounded-full h-4 w-4 ${step.initialRisk.color}`}></div>
                                            <span className="ml-1">{step.initialRisk.level}</span>
                                        </td>
                                        <td className="border p-2">
                                            {step.isEditing ? (
                                                <div className="space-y-2">
                                                    {step.controls.map((control, controlIndex) => (
                                                        <div key={controlIndex} className="flex items-center space-x-1">
                                                            <select
                                                                className="w-20 p-1 border rounded"
                                                                value={control.type}
                                                                onChange={(e) => updateControl(stepIndex, controlIndex, 'type', e.target.value)}
                                                            >
                                                                {Object.entries(controlTypes).map(([key, label]) => (
                                                                    <option key={key} value={key}>{key}</option>
                                                                ))}
                                                            </select>
                                                            <input
                                                                type="text"
                                                                className="flex-1 p-1 border rounded"
                                                                value={control.description}
                                                                onChange={(e) => updateControl(stepIndex, controlIndex, 'description', e.target.value)}
                                                            />
                                                            <button 
                                                                className="text-red-500 hover:text-red-700"
                                                                onClick={() => removeControl(stepIndex, controlIndex)}
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button 
                                                        className="text-sm text-blue-600 hover:text-blue-800"
                                                        onClick={() => addControl(stepIndex)}
                                                    >
                                                        + Tambah
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    {step.controls.map((control, controlIndex) => (
                                                        <div key={controlIndex}>
                                                            <span className="font-medium">{control.type}:</span> {control.description}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="border p-2">
                                            {step.isEditing ? (
                                                <input
                                                    type="text"
                                                    className="w-full p-1 border rounded"
                                                    value={step.controlExecutor}
                                                    onChange={(e) => updateStep(stepIndex, 'controlExecutor', e.target.value)}
                                                />
                                            ) : (
                                                step.controlExecutor
                                            )}
                                        </td>
                                        <td className="border p-2">
                                            {step.isEditing ? (
                                                <input
                                                    type="text"
                                                    className="w-16 p-1 border rounded"
                                                    value={step.executorInitial}
                                                    onChange={(e) => updateStep(stepIndex, 'executorInitial', e.target.value)}
                                                />
                                            ) : (
                                                <div className="w-8 h-8 border border-gray-400 rounded flex items-center justify-center">
                                                    {step.executorInitial}
                                                </div>
                                            )}
                                        </td>
                                        <td className="border p-2">
                                            {step.isEditing ? (
                                                <select
                                                    className="w-full p-1 border rounded"
                                                    value={step.residualRisk.severity}
                                                    onChange={(e) => updateStep(stepIndex, 'residualRisk.severity', parseInt(e.target.value))}
                                                >
                                                    {[1, 2, 3, 4, 5].map(val => (
                                                        <option key={val} value={val}>{val}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                step.residualRisk.severity
                                            )}
                                        </td>
                                        <td className="border p-2">
                                            {step.isEditing ? (
                                                <select
                                                    className="w-full p-1 border rounded"
                                                    value={step.residualRisk.probability}
                                                    onChange={(e) => updateStep(stepIndex, 'residualRisk.probability', parseInt(e.target.value))}
                                                >
                                                    {[1, 2, 3, 4, 5].map(val => (
                                                        <option key={val} value={val}>{val}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                step.residualRisk.probability
                                            )}
                                        </td>
                                        <td className="border p-2">
                                            <div className={`rounded-full h-4 w-4 ${step.residualRisk.color}`}></div>
                                            <span className="ml-1">{step.residualRisk.level}</span>
                                        </td>
                                        <td className="border p-2">
                                            {step.isEditing ? (
                                                <div className="space-y-1">
                                                    <input
                                                        type="text"
                                                        className="w-full p-1 border rounded"
                                                        placeholder="DD/MM/YYYY"
                                                        value={step.verificationDate}
                                                        onChange={(e) => updateStep(stepIndex, 'verificationDate', e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="w-full p-1 border rounded"
                                                        placeholder="Initial"
                                                        value={step.verificationInitial}
                                                        onChange={(e) => updateStep(stepIndex, 'verificationInitial', e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <div>{step.verificationDate}</div>
                                                    <div className="w-8 h-8 border border-gray-400 rounded flex items-center justify-center mt-1">
                                                        {step.verificationInitial}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="border p-2">
                                            {step.isEditing ? (
                                                <button 
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    onClick={() => toggleEditMode(stepIndex)}
                                                >
                                                    <Save className="h-5 w-5" />
                                                </button>
                                            ) : (
                                                <button 
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    onClick={() => toggleEditMode(stepIndex)}
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6">
                        <p className="text-sm font-medium mb-2">Legend - Risk Levels:</p>
                        <div className="flex space-x-4">
                            {Object.entries(riskLevels).map(([level, color]) => (
                                <div key={level} className="flex items-center">
                                    <div className={`rounded-full h-4 w-4 ${color} mr-1`}></div>
                                    <span>{level}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="text-sm font-medium mb-2">Legend - Control Types:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {Object.entries(controlTypes).map(([code, description]) => (
                                <div key={code} className="flex items-center">
                                    <span className="font-medium mr-1">{code}:</span>
                                    <span>{description}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button className="px-4 py-2 border rounded hover:bg-gray-100" onClick={() => navigate("/tha")}>
                            Lihat Task Hazard Asessment
                        </button>
                        <button 
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={() => navigate("/exportl2sa")}
                        >
                            Export to Excel
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RiskAnalysisPage;