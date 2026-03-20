import React from 'react';

const LoveStoryViewer = ({ timeline = [] }) => {
  if (timeline.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Chưa Có Câu Chuyện Tình Yêu</h2>
        <p className="text-gray-600">Cặp đôi chưa chia sẻ câu chuyện tình yêu của họ.</p>
      </div>
    );
  }

  return (
    <div className="love-story-viewer max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Câu Chuyện Tình Yêu</h1>
      
      <div className="relative">
        {/* Timeline connector line */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-300"></div>
        
        <div className="space-y-8">
          {timeline
            .sort((a, b) => a.order - b.order)
            .map((item, index) => (
              <div key={item._id || index} className="timeline-item-wrapper">
                <TimelineItem item={item} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LoveStoryViewer;