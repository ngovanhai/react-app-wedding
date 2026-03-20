import React, { useState } from 'react';

const StoryForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
    description: initialData.description || '',
    photoUrl: initialData.photoUrl || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.date) {
      alert('Vui lòng điền đầy đủ tiêu đề và ngày tháng');
      return;
    }
    
    // Convert date to ISO string for API
    const submitData = {
      ...formData,
      date: new Date(formData.date).toISOString()
    };
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tiêu đề *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Ví dụ: Lần đầu gặp mặt"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Ngày tháng *</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          placeholder="Chia sẻ chi tiết về mốc thời gian này..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">URL Hình ảnh</label>
        <input
          type="url"
          name="photoUrl"
          value={formData.photoUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div className="flex space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {initialData._id ? 'Cập nhật' : 'Thêm'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default StoryForm;