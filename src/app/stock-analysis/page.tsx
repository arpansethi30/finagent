'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface StockAnalysis {
  symbol: string;
  company_name: string;
  sector: string;
  industry: string;
  current_price: number;
  price_change: number;
  market_cap: number;
  pe_ratio: number | null;
  fifty_two_week: {
    high: number;
    low: number;
  };
  technical_indicators: {
    trend: string;
    rsi: number;
    macd: number;
    sma20: number;
    sma50: number;
    volatility: number;
    average_volume: number;
  };
  analysis: string;
}

export default function StockAnalysisPage() {
  const [symbol, setSymbol] = useState('');
  const [period, setPeriod] = useState('1y');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate symbol
    if (!symbol) {
      setError('Please enter a stock symbol');
      return;
    }

    // Clean up the symbol (remove spaces, convert to uppercase)
    const cleanSymbol = symbol.trim().toUpperCase();
    if (!/^[A-Z]{1,5}$/.test(cleanSymbol)) {
      setError('Please enter a valid stock symbol (1-5 letters)');
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

      const response = await fetch('http://localhost:8001/analyze/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          symbol: cleanSymbol,
          period: period
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.detail?.includes('No data found for symbol')) {
          throw new Error(`No data found for symbol "${cleanSymbol}". Please verify the stock symbol is correct.`);
        }
        throw new Error(data.detail || 'Failed to analyze stock');
      }

      setAnalysis(data);
      toast.success('Analysis completed successfully');
    } catch (err) {
      console.error('Stock analysis error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to analyze stock. Please try again.';
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

  const commonStocks = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'META', name: 'Meta' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Stock Analysis</h1>

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
              maxLength={5}
              pattern="[A-Za-z]+"
              title="Please enter a valid stock symbol (1-5 letters)"
            />
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Common stocks:</p>
              <div className="flex flex-wrap gap-2">
                {commonStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    type="button"
                    onClick={() => setSymbol(stock.symbol)}
                    className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    {stock.symbol} ({stock.name})
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="w-48">
            <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
              Time Period
            </label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1mo">1 Month</option>
              <option value="3mo">3 Months</option>
              <option value="6mo">6 Months</option>
              <option value="1y">1 Year</option>
              <option value="2y">2 Years</option>
              <option value="5y">5 Years</option>
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
              'Analyze Stock'
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
              {analysis.company_name} ({analysis.symbol})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Current Price</p>
                <p className="text-xl font-semibold">${analysis.current_price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price Change</p>
                <p className={`text-xl font-semibold ${analysis.price_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analysis.price_change >= 0 ? '+' : ''}{analysis.price_change.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sector</p>
                <p className="text-xl font-semibold">{analysis.sector}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Industry</p>
                <p className="text-xl font-semibold">{analysis.industry}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Technical Indicators</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Trend</p>
                <p className={`text-lg font-semibold ${analysis.technical_indicators.trend === 'Bullish' ? 'text-green-600' : 'text-red-600'}`}>
                  {analysis.technical_indicators.trend}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">RSI</p>
                <p className="text-lg font-semibold">{analysis.technical_indicators.rsi.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">MACD</p>
                <p className="text-lg font-semibold">{analysis.technical_indicators.macd.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Volatility</p>
                <p className="text-lg font-semibold">{(analysis.technical_indicators.volatility * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">20-day SMA</p>
                <p className="text-lg font-semibold">${analysis.technical_indicators.sma20.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">50-day SMA</p>
                <p className="text-lg font-semibold">${analysis.technical_indicators.sma50.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Volume</p>
                <p className="text-lg font-semibold">{analysis.technical_indicators.average_volume.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Market Cap</p>
                <p className="text-lg font-semibold">${(analysis.market_cap / 1e9).toFixed(2)}B</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{analysis.analysis}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 