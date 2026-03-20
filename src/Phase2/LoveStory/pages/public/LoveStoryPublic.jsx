import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoveStoryViewer from '../components/LoveStoryViewer';
import api from '../utils/api';

const LoveStoryPublic = () => {
  const { shareCode } = useParams();
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoveStory();
  }, [shareCode]);

  const fetchLoveStory = async () => {
    try {
      setLoading(true);
      // Note: In real implementation, you'd need to get albumId from shareCode
      // For now, assuming shareCode is the albumId for simplicity
      const response = await api.get(`/albums/${shareCode}/story/timeline`);
      setTimeline(response.data || []);
      setError('');
      
      // Initialize scroll animations
      setTimeout(() => {
        document.querySelectorAll('.timeline-item').forEach(item => {
          item.classList.add('opacity-100');
        });
      }, 100);
    } catch (err) {
      console.error('Error fetching love story:', err);
      setError('Không thể tải câu chuyện tình yêu');
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="love-story-public">
      <LoveStoryViewer timeline={timeline} />
    </div>
  );
};

export default LoveStoryPublic;