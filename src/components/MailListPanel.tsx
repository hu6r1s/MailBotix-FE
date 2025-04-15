import React from 'react';
import { GmailMessage } from '@pages/MailListPage';
import { Star, StarOff, Paperclip } from 'lucide-react';

interface Props {
  emails: GmailMessage[];
  onSelect: (email: GmailMessage | null) => void;
}

const MailListPanel: React.FC<Props> = ({ emails, onSelect }) => {
  return (
    <div className="h-full overflow-y-auto w-full bg-white">
      <div
        className="text-xl font-semibold p-4 border-b cursor-pointer hover:bg-gray-50"
        onClick={() => onSelect(null)}
      >Inbox</div>
      <ul>
        {emails.map((email) => (
          <li
            key={email.messageId}
            className={`cursor-pointer p-4 border-b hover:bg-gray-100 ${
              email.unread ? 'font-bold bg-blue-50' : ''
            }`}
            onClick={() => onSelect(email)}
          >
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
