import React from 'react';

const TimelineItem = ({ item, isEditing = false, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">{item.title}</h3>
          <p className="text-gray-600 mb-2">{formatDate(item.date)}</p>
          {item.description && <p className="text-gray-700 mb-2">{item.description}</p>}
          {item.photoUrl && (
            <img 
              src={item.photoUrl} 
              alt={item.title}
              className="w-full max-w-xs rounded mt-2"
            />
          )}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit && onEdit(item)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete && onDelete(item)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-item mb-8 opacity-0 animate-fade-in">
      <div className="flex">
        <div className="hidden md:block w-1/2 pr-8 text-right">
          {item.photoUrl && (
            <img 
              src={item.photoUrl} 
              alt={item.title}
              className="w-full max-w-xs mx-auto rounded shadow"
            />
          )}
        </div>
        <div className="w-full md:w-1/2 pl-0 md:pl-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-xl mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-3">{formatDate(item.date)}</p>
            {item.description && <p className="text-gray-700">{item.description}</p>}
            {item.photoUrl && (
              <div className="md:hidden mt-4">
                <img 
                  src={item.photoUrl} 
                  alt={item.title}
                  className="w-full rounded"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;