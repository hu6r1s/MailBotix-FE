import React, { useState } from 'react';
import apiClient from '@apis/axiosConfig';
import { Wand2 } from 'lucide-react';

interface ReplyGeneratorProps {
  emailBody: string;
  onReplyGenerated: (text: string) => void;
}

const ReplyGenerator: React.FC<ReplyGeneratorProps> = ({ emailBody, onReplyGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReply = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/reply', {
        emailContent: emailBody,
        tone: 'polite',
      });
      onReplyGenerated(response.data.reply);
    } catch (err: any) {
      console.error('Reply generation failed:', err);
      setError('답장 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <button 
        onClick={generateReply}
        disabled={loading || !emailBody}
        className="flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        <Wand2 size={16} className="mr-1" />
        {loading ? '생성 중...' : 'AI로 답장 생성'}
      </button>
      {error && <span className="text-red-500 text-sm ml-2">{error}</span>}
    </div>
  );
};

export default ReplyGenerator;