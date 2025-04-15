import React from 'react';

const SkeletonListItem = () => (
  <div className="p-3 border-b border-gray-200">
    <div className="flex items-center space-x-3">
      <div className="h-4 w-4 bg-gray-300 rounded"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 w-2/5 bg-gray-300 rounded"></div>
        <div className="h-3 w-4/5 bg-gray-300 rounded"></div>
      </div>
      <div className="h-3 w-1/6 bg-gray-300 rounded"></div>
    </div>
  </div>
);

const MailListSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 10 }).map((_, index) => (
        <SkeletonListItem key={index} />
      ))}
    </div>
  );
};

export default MailListSkeleton;