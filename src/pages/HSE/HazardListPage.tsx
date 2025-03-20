import React, { useState, useEffect } from 'react';
import categoryService, { Category } from '../../services/categoryService';
import hazardService, { Hazard } from '../../services/hazardService';

const HazardListPage: React.FC = () => {
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingHazardId, setEditingHazardId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // New hazard template
  const emptyHazard: Hazard = {
    id: '',
    category_id: '',
    description: '',
    health: false,
    safety: false,
    security: false,
    environment: false,
    social: false,
    sources: ''
  };
  
  const [newHazard, setNewHazard] = useState<Hazard>({ ...emptyHazard });

  // Fetch categories and hazards on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch categories
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
        
        // Fetch all hazards
        const hazardsData = await hazardService.getAllHazards();
        setHazards(hazardsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch hazards by category when filter changes
  useEffect(() => {
    const fetchHazardsByCategory = async () => {
      if (!filterCategory) {
        // If no filter, get all hazards
        try {
          setIsLoading(true);
          const hazardsData = await hazardService.getAllHazards();
          setHazards(hazardsData);
        } catch (err) {
          console.error('Error fetching all hazards:', err);
          setError('Failed to load hazards. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      } else {
        // If filter is set, get hazards for that category
        try {
          setIsLoading(true);
          const hazardsData = await hazardService.getHazardsByCategory(filterCategory);
          setHazards(hazardsData);
        } catch (err) {
          console.error(`Error fetching hazards for category ${filterCategory}:`, err);
          setError('Failed to load hazards for this category. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (categories.length > 0) {
      fetchHazardsByCategory();
    }
  }, [filterCategory, categories.length]);

  // Handle input change for form fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewHazard({
        ...newHazard,
        [name]: checked
      });
    } else if (name === 'category_id') {
      setNewHazard({
        ...newHazard,
        category_id: value
      });
    } else {
      setNewHazard({
        ...newHazard,
        [name]: value
      });
    }
  };

  // Generate the next ID for a hazard in a category
  const generateNextId = async (categoryId: string): Promise<string> => {
    try {
      // Get all hazards for this category to determine next ID
      const categoryHazards = await hazardService.getHazardsByCategory(categoryId);
      
      if (categoryHazards.length === 0) {
        return `${categoryId}.01`;
      }
      
      const maxIdNumber = Math.max(...categoryHazards.map(h => {
        const idParts = h.id.split('.');
        return parseInt(idParts[1]);
      }));
      
      return `${categoryId}.${String(maxIdNumber + 1).padStart(2, '0')}`;
    } catch (err) {
      console.error('Error generating next ID:', err);
      // Default fallback
      return `${categoryId}.01`;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editingHazardId) {
        // Update existing hazard
        await hazardService.updateHazard(editingHazardId, newHazard);
        
        // Refresh the hazards list
        if (filterCategory) {
          const updatedHazards = await hazardService.getHazardsByCategory(filterCategory);
          setHazards(updatedHazards);
        } else {
          const updatedHazards = await hazardService.getAllHazards();
          setHazards(updatedHazards);
        }
        
        setEditingHazardId(null);
      } else {
        // Add new hazard with generated ID if not provided
        const hazardToAdd = { ...newHazard };
        if (!hazardToAdd.id) {
          hazardToAdd.id = await generateNextId(hazardToAdd.category_id);
        }
        
        // Send to the API
        await hazardService.createHazard(hazardToAdd);
        
        // Refresh the hazards list
        if (filterCategory) {
          const updatedHazards = await hazardService.getHazardsByCategory(filterCategory);
          setHazards(updatedHazards);
        } else {
          const updatedHazards = await hazardService.getAllHazards();
          setHazards(updatedHazards);
        }
      }
      
      // Reset form
      setNewHazard({ ...emptyHazard });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error saving hazard:', err);
      setError('Failed to save hazard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing a hazard
  const handleEdit = async (id: string) => {
    try {
      setIsLoading(true);
      const hazardToEdit = await hazardService.getHazardById(id);
      
      setNewHazard(hazardToEdit);
      setEditingHazardId(id);
      setShowAddForm(true);
    } catch (err) {
      console.error(`Error fetching hazard ${id} for editing:`, err);
      setError('Failed to load hazard details for editing.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a hazard
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this hazard?')) {
      try {
        setIsLoading(true);
        await hazardService.deleteHazard(id);
        
        // Refresh the hazards list
        if (filterCategory) {
          const updatedHazards = await hazardService.getHazardsByCategory(filterCategory);
          setHazards(updatedHazards);
        } else {
          const updatedHazards = await hazardService.getAllHazards();
          setHazards(updatedHazards);
        }
      } catch (err) {
        console.error(`Error deleting hazard ${id}:`, err);
        setError('Failed to delete hazard.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Cancel form editing/adding
  const handleCancel = () => {
    setNewHazard({ ...emptyHazard });
    setEditingHazardId(null);
    setShowAddForm(false);
  };

  // Group hazards by category for display
  const groupedHazards: Record<string, Hazard[]> = {};
  hazards.forEach(hazard => {
    if (!groupedHazards[hazard.category_id]) {
      groupedHazards[hazard.category_id] = [];
    }
    groupedHazards[hazard.category_id].push(hazard);
  });
  
  // Get category name by ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(c => c.category_id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-900 p-4 text-white">
          <h1 className="text-xl font-bold text-center">Hazard List</h1>
        </div>
        
        {/* Error display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded relative">
            <span className="block sm:inline">{error}</span>
            <span 
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </span>
          </div>
        )}
        
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <div>
              <label className="mr-2 font-medium">Filter by Category:</label>
              <select 
                value={filterCategory} 
                onChange={e => setFilterCategory(e.target.value)}
                className="border rounded p-1"
                disabled={isLoading}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_id} - {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={() => {
                setNewHazard({ ...emptyHazard });
                setEditingHazardId(null);
                setShowAddForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              Add New Hazard
            </button>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          )}

          {/* Add/Edit Hazard Form */}
          {showAddForm && (
            <div className="bg-gray-50 p-4 mb-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-4">
                {editingHazardId ? 'Edit Hazard' : 'Add New Hazard'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hazard Category</label>
                    <select
                      name="category_id"
                      value={newHazard.category_id}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                      disabled={isLoading}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.category_id} value={category.category_id}>
                          {category.category_id} - {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Hazard ID</label>
                    <input
                      type="text"
                      name="id"
                      value={newHazard.id}
                      onChange={handleInputChange}
                      placeholder="Leave blank for auto-generation"
                      className="w-full p-2 border rounded"
                      disabled={!!editingHazardId || isLoading}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Hazard Description</label>
                  <input
                    type="text"
                    name="description"
                    value={newHazard.description}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Impact Categories</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="health"
                        name="health"
                        checked={newHazard.health}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <label htmlFor="health">Health</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="safety"
                        name="safety"
                        checked={newHazard.safety}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <label htmlFor="safety">Safety</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="security"
                        name="security"
                        checked={newHazard.security}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <label htmlFor="security">Security</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="environment"
                        name="environment"
                        checked={newHazard.environment}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <label htmlFor="environment">Environment</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="social"
                        name="social"
                        checked={newHazard.social}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <label htmlFor="social">Social</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Sources</label>
                  <textarea
                    name="sources"
                    value={newHazard.sources}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full p-2 border rounded"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {editingHazardId ? 'Update Hazard' : 'Add Hazard'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Hazard List Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-2 text-left">Hazard/Aspect/Threat Number</th>
                  <th className="border border-gray-200 p-2 text-left">Hazard/Aspect/Threat Description</th>
                  <th className="border border-gray-200 p-2 text-center w-16">Health</th>
                  <th className="border border-gray-200 p-2 text-center w-16">Safety</th>
                  <th className="border border-gray-200 p-2 text-center w-16">Security</th>
                  <th className="border border-gray-200 p-2 text-center w-16">Environment</th>
                  <th className="border border-gray-200 p-2 text-center w-16">Social</th>
                  <th className="border border-gray-200 p-2 text-left">Sources</th>
                  <th className="border border-gray-200 p-2 text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && Object.keys(groupedHazards).length > 0 && Object.keys(groupedHazards).map(category => {
                  return (
                    <React.Fragment key={category}>
                      <tr className="bg-gray-200">
                        <td className="border border-gray-300 p-2 font-bold">{category}</td>
                        <td className="border border-gray-300 p-2 font-bold" colSpan={8}>
                          {getCategoryName(category)}
                        </td>
                      </tr>
                      {groupedHazards[category].map(hazard => (
                        <tr key={hazard.id}>
                          <td className="border border-gray-300 p-2">{hazard.id}</td>
                          <td className="border border-gray-300 p-2">{hazard.description}</td>
                          <td className="border border-gray-300 p-2 text-center">
                            {hazard.health && <span className="text-lg">✓</span>}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {hazard.safety && <span className="text-lg">✓</span>}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {hazard.security && <span className="text-lg">✓</span>}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {hazard.environment && <span className="text-lg">✓</span>}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {hazard.social && <span className="text-lg">✓</span>}
                          </td>
                          <td className="border border-gray-300 p-2">{hazard.sources}</td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button 
                              onClick={() => handleEdit(hazard.id)}
                              className="text-blue-600 hover:text-blue-800 mr-2"
                              disabled={isLoading}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(hazard.id)}
                              className="text-red-600 hover:text-red-800"
                              disabled={isLoading}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
                
                {!isLoading && Object.keys(groupedHazards).length === 0 && (
                  <tr>
                    <td colSpan={9} className="border border-gray-300 p-4 text-center text-gray-500">
                      No hazards found. {filterCategory && 'Try changing the filter or '} Add a new hazard to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HazardListPage;