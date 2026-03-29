'use client';

export default function ShareLink({ shareCode }) {
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/album/${shareCode}`
    : `/album/${shareCode}`;

  const handleCopy = () => navigator.clipboard.writeText(shareUrl);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Share Your Wedding Album</h2>

      <div className="mb-6">
        <p className="text-gray-600 mb-2">Share this link with your guests:</p>
        <div className="flex items-center justify-center">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="px-3 py-2 border border-gray-300 rounded-l-md w-full max-w-md truncate"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-md focus:outline-none"
          >
            Copy
          </button>
        </div>
      </div>

      <div>
        <p className="text-gray-600 mb-2">Share code: <strong className="text-pink-600">{shareCode}</strong></p>
      </div>
    </div>
  );
}
