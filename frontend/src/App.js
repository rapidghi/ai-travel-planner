import React, { useState } from 'react';

const Spinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
);

function App() {
  const [destination, setDestination] = useState('Paris');
  const [days, setDays] = useState('3');
  const [interests, setInterests] = useState('art and history');
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateItinerary = async () => {
    setLoading(true);
    setError('');
    setItinerary('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, days, interests }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setItinerary(data.itinerary);

    } catch (e) {
      console.error("Failed to generate itinerary:", e);
      setError('Failed to generate itinerary. The AI service might be warming up. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800">AI Travel Planner 🌍</h1>
          <p className="text-gray-600">Your personal trip curator, powered by local AI.</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Plan Your Next Adventure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., Tokyo"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Number of Days</label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Interests</label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., food, technology, temples"
              />
            </div>
          </div>
          <button
            onClick={generateItinerary}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 flex items-center justify-center"
          >
            {loading ? <Spinner /> : 'Generate Itinerary'}
          </button>
        </div>

        {error && <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">{error}</div>}

        {itinerary && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Your Custom Itinerary</h3>
            <pre className="whitespace-pre-wrap font-sans bg-gray-50 p-4 rounded-md">{itinerary}</pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
