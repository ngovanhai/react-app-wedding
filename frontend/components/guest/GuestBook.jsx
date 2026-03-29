export default function GuestBook({ messages, onDelete }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No guest messages yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message._id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-gray-800">{message.guestName}</h4>
            {onDelete && (
              <button
                onClick={() => onDelete(message._id)}
                className="text-red-500 hover:text-red-700 text-sm"
                aria-label="Delete message"
              >
                Delete
              </button>
            )}
          </div>
          <p className="text-gray-600">{message.message}</p>
          {message.photoUrl && (
            <div className="mt-3">
              <img src={message.photoUrl} alt={`${message.guestName}'s photo`} className="w-16 h-16 object-cover rounded-full" />
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">
            {new Date(message.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>
      ))}
    </div>
  );
}
