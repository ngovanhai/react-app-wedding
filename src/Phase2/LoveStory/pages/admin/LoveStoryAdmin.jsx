import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TimelineEditor from '../components/TimelineEditor';
import api from '../utils/api';

const LoveStoryAdmin = () => {
  const { id } = useParams();
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoveStory();
  }, [id]);

  const fetchLoveStory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/albums/${id}/story/timeline`);
      setTimeline(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching love story:', err);
      setError('Không thể tải câu chuyện tình yêu');
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTimeline = async (updatedTimeline) => {
    try {
      // Prepare data for API
      const storyData = {
        timeline: updatedTimeline.map((item, index) => ({
          ...item,
          order: index
        }))
      };
      
      await api.post(`/albums/${id}/story`, storyData);
      setTimeline(updatedTimeline);
    } catch (err) {
      console.error('Error saving love story:', err);
      alert('Lỗi khi lưu câu chuyện tình yêu. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <button 
          onClick={fetchLoveStory}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="love-story-admin p-6">
      <TimelineEditor 
        timeline={timeline} 
        onSave={handleSaveTimeline}
      />
    </div>
  );
};

export default LoveStoryAdmin;