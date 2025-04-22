import React, { useState } from 'react';
import { GmailMessage } from '@pages/MailListPage';
import { Star, StarOff, Paperclip } from 'lucide-react';

interface Props {
  emails: GmailMessage[];
  onSelectMessage: (messageId: string | null)  => void;
  currentSize: number;
  onSizeChange: (newSize: number) => void;
}

const MailListPanel: React.FC<Props> = ({ emails, onSelectMessage, currentSize, onSizeChange }) => {
  

  return (
    <div className="h-full overflow-y-auto w-full bg-white">
      <div className="flex items-center justify-between text-xl font-semibold p-4 border-b">
        <span
          className="cursor-pointer hover:text-blue-600" // 간단한 호버 효과
          onClick={() => onSelectMessage(null)} // 클릭 시 상세 패널 초기화
        >
          Inbox
        </span>
        <select
          value={currentSize}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="text-sm font-normal border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          aria-label="Emails per page"
        >
          <option value={10}>10개씩 보기</option>
          <option value={25}>25개씩 보기</option>
          <option value={50}>50개씩 보기</option>
          <option value={100}>100개씩 보기</option>
        </select>
      </div>
      <ul>
        {emails.map((email) => (
          <li
            key={email.messageId}
            className={`cursor-pointer p-4 border-b hover:bg-gray-100 ${
              email.unread ? 'font-bold bg-blue-50' : ''
            }`}
            onClick={() => {
              onSelectMessage(email.messageId);
            }
          }>
            <p className="text-sm text-gray-600">{email.headers.from}</p>
            <p className="text-base">{email.headers.subject}</p>
            <p className="text-xs text-gray-500">{email.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MailListPanel;
