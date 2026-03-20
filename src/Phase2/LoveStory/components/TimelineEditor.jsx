import React, { useState } from 'react';
import StoryForm from './StoryForm';

const TimelineEditor = ({ timeline = [], onSave }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('Bạn có chắc muốn xóa mốc thời gian này?')) {
      const updatedTimeline = timeline.filter(t => t._id !== item._id);
      await onSave(updatedTimeline);
    }
  };

  const handleFormSubmit = async (formData) => {
    let updatedTimeline;
    
    if (editingItem) {
      // Update existing item
      updatedTimeline = timeline.map(item => 
        item._id === editingItem._id ? { ...item, ...formData } : item
      );
    } else {
      // Add new item
      const newItem = {
        ...formData,
        _id: Date.now().toString(), // Temporary ID for client-side
        order: timeline.length
      };
      updatedTimeline = [...timeline, newItem];
    }
    
    await onSave(updatedTimeline);
    setShowForm(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="timeline-editor">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Câu Chuyện Tình Yêu</h2>
        <button 
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Thêm Mốc Thời Gian
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <StoryForm 
            initialData={editingItem || {}}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="space-y-4">
        {timeline
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <TimelineItem
              key={item._id}
              item={item}
              isEditing={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
      </div>

      {timeline.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-500">
          Chưa có mốc thời gian nào. Hãy thêm mốc thời gian đầu tiên!
        </div>
      )}
    </div>
  );
};

export default TimelineEditor;