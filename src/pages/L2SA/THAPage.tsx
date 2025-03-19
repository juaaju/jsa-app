import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, PlusCircle, Check, Save } from 'lucide-react';

const TaskHazardAssessmentPage = () => {
    const navigate = useNavigate();
    const [selectedHazards, setSelectedHazards] = useState([]);
    const [customHazards, setCustomHazards] = useState([]);
    const [newCustomHazard, setNewCustomHazard] = useState({
        category: '',
        hazard: '',
        control: ''
    });

    const addCustomHazard = () => {
        if (newCustomHazard.hazard && newCustomHazard.control) {
            setCustomHazards([...customHazards, { ...newCustomHazard, id: Date.now() }]);
            setNewCustomHazard({ category: '', hazard: '', control: '' });
        }
    };

    const toggleHazard = (category, hazard, control) => {
        const hazardKey = `${category}-${hazard}-${control}`;
        if (selectedHazards.includes(hazardKey)) {
            setSelectedHazards(selectedHazards.filter(h => h !== hazardKey));
        } else {
            setSelectedHazards([...selectedHazards, hazardKey]);
        }
    };

    const removeCustomHazard = (id) => {
        setCustomHazards(customHazards.filter(hazard => hazard.id !== id));
    };

    const hazardData = [
        {
            category: "Perkakas dan Peralatan",
            hazards: [
                { hazard: "Inspeksi perkakas & peralatan", control: "Lakukan inspeksi rutin" },
                { hazard: "Tidak menggunakan perkakas modifikasi", control: "Gunakan peralatan standar yang disertifikasi" },
                { hazard: "Gunakan pelindung/guard", control: "Pastikan pelindung terpasang dengan benar" },
                { hazard: "Gunakan perkakas dan peralatan yang sesuai", control: "Periksa kesesuaian alat dengan pekerjaan" },
                { hazard: "Lapisi atau hilangkan sisi/bagian yang tajam", control: "Gunakan pelindung untuk bagian tajam" },
                { hazard: "Terapkan teknik keselamatan tangan (hand safety)", control: "Ikuti prosedur hand safety" }
            ]
        },
        {
            category: "Peralatan atau Obyek Bergerak",
            hazards: [
                { hazard: "Pastikan integritas pelindung mesin", control: "Periksa kondisi pelindung mesin sebelum operasi" },
                { hazard: "Sediakan barrier pelindung", control: "Pasang barrier untuk area berbahaya" },
                { hazard: "Observer untuk mengawasi orang atau peralatan yang mendekat", control: "Tetapkan pengawas khusus" },
                { hazard: "Shutdown atau lock out peralatan", control: "Implementasikan prosedur LOTO" },
                { hazard: "Jangan bekerja di line of fire", control: "Hindari area line of fire" }
            ]
        },
        {
            category: "Peralatan Bergetar",
            hazards: [
                { hazard: "Kelola waktu pajanan", control: "Batasi waktu paparan sesuai standar" },
                { hazard: "Anti getaran pada peralatan", control: "Gunakan peredam getaran" },
                { hazard: "Gunakan peralatan yang rendah getaran", control: "Pilih peralatan dengan getaran rendah" },
                { hazard: "Terapkan pengendalian kebisingan", control: "Gunakan peredam kebisingan" }
            ]
        },
        {
            category: "Peralatan Listrik Portable",
            hazards: [
                { hazard: "Inspeksi kondisi dan tanggal pengetesan peralatan", control: "Verifikasi sertifikasi dan tanggal pengujian" },
                { hazard: "Terapkan pemantauan pengukuran gas kontinu", control: "Gunakan gas detector" },
                { hazard: "Lindungi kabel listrik dari benturan atau kerusakan", control: "Pasang pelindung kabel" }
            ]
        },
        {
            category: "Peralatan Bergerak/Mobile",
            hazards: [
                { hazard: "Kaji kondisi peralatan", control: "Inspeksi peralatan sebelum digunakan" },
                { hazard: "Terapkan pengendalian personel atau akses", control: "Batasi akses ke area operasi" },
                { hazard: "Batasi dan monitor jarak dengan kabel atau peralatan listrik bertegangan", control: "Gunakan spotter" },
                { hazard: "Kelola bahaya di atas/overhead", control: "Pasang warning sign" },
                { hazard: "Patuhi peraturan jalan atau lokasi", control: "Patuhi batas kecepatan" }
            ]
        },
        {
            category: "Peralatan Bertekanan",
            hazards: [
                { hazard: "Lakukan isolasi-LOTO, blinding, atau defeat", control: "Implementasikan prosedur isolasi" },
                { hazard: "Depressurized, drain, purge, dan vent", control: "Pastikan tekanan sudah di-release" },
                { hazard: "Buang tekanan yang terjebak", control: "Perhatikan trapped pressure" },
                { hazard: "Hindari auto-refrigeration ketika depressurizing", control: "Monitor temperatur" },
                { hazard: "Antisipasi tekanan/cairan sisa", control: "Buang sisa tekanan/cairan dengan prosedur" },
                { hazard: "Amankan/ikat selang temporary", control: "Gunakan whip check" }
            ]
        },
        {
            category: "Peralatan Panas atau Dingin",
            hazards: [
                { hazard: "Panaskan atau dinginkan peralatan sebelum dimulai", control: "Lakukan pre-heating/cooling" },
                { hazard: "Pasang barriers/pelindung", control: "Pasang penghalang termal" },
                { hazard: "Siapkan penanda warna", control: "Gunakan label warna sesuai temperatur" },
                { hazard: "Pasang kontrol suhu dingin dan brittle failure", control: "Monitor temperatur" },
                { hazard: "Gunakan sarung tangan suhu panas/dingin", control: "Pakai PPE untuk thermal protection" }
            ]
        },
        {
            category: "Peralatan Angkat",
            hazards: [
                { hazard: "Pastikan kondisi dan sertifikasi alat angkat", control: "Verifikasi sertifikat dan kondisi" },
                { hazard: "Minta persetujuan untuk pengangkatan di atas peralatan proses", control: "Dapatkan permit khusus" },
                { hazard: "Miliki dokumen rencana pengangkatan/lift plan yang sudah disetujui", control: "Siapkan lift plan" }
            ]
        },
        {
            category: "Pengangkatan Manual",
            hazards: [
                { hazard: "Kaji pekerjaan manual handling", control: "Siapkan prosedur manual handling" },
                { hazard: "Batasi ukuran angkatan", control: "Tetapkan batas beban maksimum" },
                { hazard: "Jaga postur ergonomis", control: "Training postur kerja" },
                { hazard: "Konfirmasi stabilitas angkatan dan platform kerja", control: "Periksa stabilitas" },
                { hazard: "Cari bantuan atau alat bantu mekanik untuk menghindari titik jepit/pinch points", control: "Gunakan alat bantu" }
            ]
        },
        {
            category: "Benda Jatuh",
            hazards: [
                { hazard: "Pasang penanda dan barriers untuk mencegah akses di bawah pekerjaan pengangkatan", control: "Isolasi area dengan barrier" },
                { hazard: "Gunakan alat angkat untuk menaikkan perkakas menuju atau dari platform kerja", control: "Gunakan tool basket" },
                { hazard: "Amankan/secure perkakas (tie-off)", control: "Tie-off untuk tools" }
            ]
        },
        {
            category: "Material berbahaya",
            hazards: [
                { hazard: "Drain atau purging peralatan", control: "Lakukan prosedur purging" },
                { hazard: "Ikuti pengendalian di MSDS", control: "Review MSDS" },
                { hazard: "Terapkan pengendalian bahaya kesehatan (Timbal, Asbestos, H2S, Sulfur Dioksida, NORM)", control: "Ikuti prosedur khusus" },
                { hazard: "Uji dan analisis material", control: "Lakukan pengujian laboratorium" }
            ]
        },
        {
            category: "Potensi Tumpahan",
            hazards: [
                { hazard: "Drain peralatan", control: "Gunakan wadah penampung" },
                { hazard: "Sediakan peralatan spill containment", control: "Siapkan spill kit" },
                { hazard: "Siapkan peralatan dan material pembersihan tumpahan", control: "Sediakan material absorben" },
                { hazard: "Amankan/ikat kan isolasi selang jika tidak digunakan", control: "Gunakan penutup/plug" }
            ]
        },
        {
            category: "Pembuangan dan Pembersihan Limbah",
            hazards: [
                { hazard: "Terapkan praktik pengelolaan lingkungan", control: "Ikuti prosedur lingkungan" },
                { hazard: "Ikuti prosedur pembuangan limbah di lapangan", control: "Patuhi regulasi limbah" },
                { hazard: "Bersihkan peralatan dan material di lapangan", control: "Gunakan area dekontaminasi" },
                { hazard: "Optimasi pekerjan untuk meminimalisir limbah", control: "Kurangi limbah dari sumber" }
            ]
        },
        {
            category: "Terpleset, Tersandung, dan Jatuh",
            hazards: [
                { hazard: "Identifikasi dan tutupi permukaan yang tidak rata", control: "Pasang ramp atau cover" },
                { hazard: "Identifikasi dan lapisi permukaan yang tidak rata", control: "Gunakan anti-slip" },
                { hazard: "Amankan/tutupi kabel, tapi, atau tubing", control: "Gunakan cable protector" },
                { hazard: "Bersihkan cairan/tumpahan", control: "Segera bersihkan tumpahan" },
                { hazard: "Barikade atau pasang rantai/tali bukaan dan lubang", control: "Pasang guardrail" }
            ]
        }
    ];

    const handleSaveAndContinue = () => {
        // Process selected hazards and navigate back to L2SA
        navigate("/analysis");
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center mb-6">
                <button 
                    className="mr-4 p-2 rounded-full hover:bg-gray-100"
                    onClick={() => navigate("/analysis")}
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold">Task Hazard Assessment (THA)</h1>
                <span className="ml-auto text-gray-600">Referensi untuk L2SA</span>
            </div>
            
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="bg-yellow-50 p-3 mb-4 border-l-4 border-yellow-500">
                        <p className="font-medium">Tabel bahaya dan pengendalian berikut dapat membantu tim kaji risiko untuk mengelola risiko pekerjaan.</p>
                        <p className="font-bold">Tabel ini tidak mencakup semua bahaya yang mungkin ada di pekerjaan.</p>
                        <p>Tentukan bahaya yang ada pada langkah pekerjaan dan identifikasi langkah pengendalian yang akan dilakukan.</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">Bahaya yang Dipilih</h2>
                        {selectedHazards.length === 0 && customHazards.length === 0 ? (
                            <p className="text-gray-500 italic">Belum ada bahaya yang dipilih</p>
                        ) : (
                            <div className="border rounded-md divide-y">
                                {selectedHazards.map(key => {
                                    const [category, hazard, control] = key.split('-');
                                    return (
                                        <div key={key} className="p-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{hazard}</p>
                                                <p className="text-sm text-gray-600">Kategori: {category}</p>
                                                <p className="text-sm text-gray-600">Pengendalian: {control}</p>
                                            </div>
                                            <button 
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => toggleHazard(category, hazard, control)}
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    );
                                })}
                                
                                {customHazards.map(item => (
                                    <div key={item.id} className="p-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{item.hazard}</p>
                                            <p className="text-sm text-gray-600">Kategori: {item.category}</p>
                                            <p className="text-sm text-gray-600">Pengendalian: {item.control}</p>
                                        </div>
                                        <button 
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => removeCustomHazard(item.id)}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Custom Hazard Input */}
                    <div className="mb-6 p-4 border rounded-md bg-gray-50">
                        <h2 className="text-lg font-semibold mb-3">Tambah Bahaya Kustom</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Kategori</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={newCustomHazard.category}
                                    onChange={(e) => setNewCustomHazard({...newCustomHazard, category: e.target.value})}
                                    placeholder="Masukkan kategori"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Bahaya</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={newCustomHazard.hazard}
                                    onChange={(e) => setNewCustomHazard({...newCustomHazard, hazard: e.target.value})}
                                    placeholder="Masukkan bahaya"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Pengendalian</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={newCustomHazard.control}
                                    onChange={(e) => setNewCustomHazard({...newCustomHazard, control: e.target.value})}
                                    placeholder="Masukkan pengendalian"
                                />
                            </div>
                        </div>
                        <button
                            className="mt-3 flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={addCustomHazard}
                        >
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Tambah Bahaya
                        </button>
                    </div>

                    {/* Hazard Reference Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    {['Perkakas dan Peralatan', 'Peralatan atau Obyek Bergerak', 'Peralatan Bergetar', 
                                      'Peralatan Listrik Portable', 'Peralatan Bergerak/Mobile', 'Peralatan Bertekanan', 'Peralatan Panas atau Dingin'].map((header, index) => (
                                        <th key={index} className="border p-2 text-left bg-yellow-100">
                                            <div className="flex items-center">
                                                
                                                {header}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {hazardData.slice(0, 7).map((category, catIndex) => (
                                        <td key={catIndex} className="border p-0 align-top">
                                            <div className="p-2">
                                                {category.hazards.map((item, itemIndex) => (
                                                    <div key={itemIndex} className="mb-2">
                                                        <label className="flex items-start">
                                                            <input 
                                                                type="checkbox" 
                                                                className="mt-1 mr-2"
                                                                checked={selectedHazards.includes(`${category.category}-${item.hazard}-${item.control}`)}
                                                                onChange={() => toggleHazard(category.category, item.hazard, item.control)}
                                                            />
                                                            <span className="text-sm">{item.hazard}</span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>

                        <table className="w-full border-collapse mt-4">
                            <thead>
                                <tr className="bg-gray-100">
                                    {['Peralatan Angkat', 'Pengangkatan Manual', 'Benda Jatuh', 
                                      'Material berbahaya', 'Potensi Tumpahan', 'Pembuangan dan Pembersihan Limbah', 'Terpleset, Tersandung, dan Jatuh'].map((header, index) => (
                                        <th key={index} className="border p-2 text-left bg-yellow-100">
                                            <div className="flex items-center">
                                                
                                                {header}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {hazardData.slice(7).map((category, catIndex) => (
                                        <td key={catIndex} className="border p-0 align-top">
                                            <div className="p-2">
                                                {category.hazards.map((item, itemIndex) => (
                                                    <div key={itemIndex} className="mb-2">
                                                        <label className="flex items-start">
                                                            <input 
                                                                type="checkbox" 
                                                                className="mt-1 mr-2"
                                                                checked={selectedHazards.includes(`${category.category}-${item.hazard}-${item.control}`)}
                                                                onChange={() => toggleHazard(category.category, item.hazard, item.control)}
                                                            />
                                                            <span className="text-sm">{item.hazard}</span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button 
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                            onClick={() => navigate("/analysis")}
                        >
                            Kembali
                        </button>
                        <button 
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                            onClick={handleSaveAndContinue}
                        >
                            <Save className="h-4 w-4 mr-1" />
                            Simpan dan Lanjutkan
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TaskHazardAssessmentPage;