'use client';

import { useParams, useRouter } from 'next/navigation';
import MessageThread from '@/components/MessageThread';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const handleBack = () => {
    router.push('/dashboard/traveler/messages');
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-hidden">
        <MessageThread
          bookingId={bookingId}
          onBack={handleBack}
          showHeader={true}
        />
      </div>
    </div>
  );
}