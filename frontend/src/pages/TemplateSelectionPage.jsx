import React, { useState } from 'react';

const TemplateSelectionPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('template1');

  const templates = [
    {
      id: 'template1',
      name: 'Classic Elegant',
      description: 'Simple and elegant design with focus on photos',
      preview: 'https://placehold.co/300x400/e2e8f0/64748b?text=Classic+Elegant'
    },
    {
      id: 'template2',
      name: 'Modern Minimal',
      description: 'Clean lines and modern layout',
      preview: 'https://placehold.co/300x400/fef3c7/d97706?text=Modern+Minimal'
    },
    {
      id: 'template3',
      name: 'Romantic Floral',
      description: 'Floral accents and romantic touches',
      preview: 'https://placehold.co/300x400/fce7f3/be185d?text=Romantic+Floral'
    },
    {
      id: 'template4',
      name: 'Vintage Charm',
      description: 'Vintage style with sepia tones',
      preview: 'https://placehold.co/300x400/fdf2f8/db2777?text=Vintage+Charm'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store selected template in localStorage or state
    localStorage.setItem('selectedTemplate', selectedTemplate);
    // Navigate to next step
    window.location.href = '/info-form';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Choose Your Template</h1>
      <p className="text-center text-gray-600 mb-8">Select a beautiful template for your wedding album</p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {templates.map((template) => (
            <div 
              key={template.id}
              className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedTemplate === template.id 
                  ? 'border-pink-500 ring-2 ring-pink-200' 
                  : 'border-gray-200 hover:border-pink-300'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="p-4 bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={template.id}
                    name="template"
                    value={template.id}
                    checked={selectedTemplate === template.id}
                    onChange={() => setSelectedTemplate(template.id)}
                    className="mr-3 h-4 w-4 text-pink-600"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <img 
                  src={template.preview} 
                  alt={template.name} 
                  className="w-full h-64 object-cover rounded"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
          >
            Continue to Album Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateSelectionPage;