'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SentimentAnalysis {
  symbol: string;
  company_name: string;
  sentiment_analysis: string;
  news_count: number;
  analyzed_articles: number;
  period_days: number;
  sources: string[];
}

export default function SentimentPage() {
  const router = useRouter();
  const [symbol, setSymbol] = useState('');
  const [days, setDays] = useState('7');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) {
      setError('Please enter a stock symbol');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      // First check if the backend is available
      const healthCheck = await fetch('http://localhost:8001/health').catch(() => null);
      if (!healthCheck) {
        throw new Error('Backend server is not running. Please start the server and try again.');
      }

      const response = await fetch('http://localhost:8001/analyze/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          symbol: symbol.toUpperCase(),
          days: parseInt(days)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze sentiment');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Sentiment analysis error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to analyze sentiment. Please try again.';
      setError(errorMessage);

      // If the error is due to backend not running, show a more helpful message
      if (errorMessage.includes('Failed to fetch')) {
        setError('Unable to connect to the backend server. Please ensure it is running on port 8001.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError('');
    setAnalysis(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Market Sentiment Analysis</h1>

      <form onSubmit={handleAnalyze} className="mb-8">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Symbol
            </label>
            <input
              type="text"
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. AAPL"
              required
              pattern="[A-Za-z]+"
              title="Please enter a valid stock symbol (letters only)"
            />
          </div>
          <div className="w-48">
            <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
              Time Period (Days)
            </label>
            <select
              id="days"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">1 Week</option>
              <option value="14">2 Weeks</option>
              <option value="30">1 Month</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </div>
            ) : (
              'Analyze Sentiment'
            )}
          </button>
          {error && (
            <button
              type="button"
              onClick={handleRetry}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors duration-200"
            >
              Try Again
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              {error.includes('backend server') && (
                <p className="text-sm text-red-600 mt-2">
                  Please make sure the backend server is running using the command:
                  <code className="bg-red-100 px-2 py-1 rounded ml-2">
                    cd backend && uvicorn app.main:app --reload --port 8001
                  </code>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              Sentiment Analysis for {analysis.company_name} ({analysis.symbol})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Time Period</p>
                <p className="text-xl font-semibold">Last {analysis.period_days} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">News Articles Found</p>
                <p className="text-xl font-semibold">{analysis.news_count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Articles Analyzed</p>
                <p className="text-xl font-semibold">{analysis.analyzed_articles}</p>
              </div>
            </div>
          </div>

          {analysis.sources.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">News Sources</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.sources.map((source, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Sentiment Analysis</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{analysis.sentiment_analysis}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 