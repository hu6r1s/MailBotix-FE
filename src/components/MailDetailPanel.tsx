import React from 'react';
import { GmailMessage } from '@pages/MailListPage';

interface Props {
  email: GmailMessage | null;
}

const MailDetailPanel: React.FC<Props> = ({ email }) => {
  if (!email) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-lg">
        메일을 선택해 주세요.
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h3 className="text-2xl font-bold mb-2">{email.headers.subject}</h3>
      <p className="text-sm text-gray-500 mb-4">{email.headers.from} · {email.date}</p>
      <hr className="mb-4" />
      <p className="text-base text-gray-800">
        ✉️ 이 영역은 메일 본문을 보여주는 공간입니다.<br />
        실제 메일 API 응답에 본문이 포함되면 여기에 표시할 수 있어요.
      </p>
    </div>
  );
};

export default MailDetailPanel;
