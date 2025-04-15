import React from 'react';

const MailDetailSkeleton: React.FC = () => {
  return (
    <div className="p-6 animate-pulse h-full">
      <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 w-1/2 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-1/3 bg-gray-300 rounded mb-6"></div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 w-11/12 bg-gray-300 rounded"></div>
        <div className="h-3 w-4/5 bg-gray-300 rounded"></div>
        <div className="h-3 w-10/12 bg-gray-300 rounded"></div>
        <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-300 rounded"></div>
      </div>
       <div className="mt-8 border-t pt-4 space-y-3">
         <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
         <div className="h-20 w-full bg-gray-300 rounded"></div>
       </div>
    </div>
  );
};

export default MailDetailSkeleton;