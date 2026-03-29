'use client';

export default function ShareLink({ shareCode }) {
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/album/${shareCode}`
      : `/album/${shareCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).catch(console.error);
  };

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
            className="px-3 py-2 border border-gray-300 rounded-l-md w-full max-w-md truncate bg-gray-50"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium rounded-r-md focus:outline-none transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      <div>
        <p className="text-gray-600 mb-2">
          Share code: <strong className="text-pink-600">{shareCode}</strong>
        </p>
      </div>
    </div>
  );
}
