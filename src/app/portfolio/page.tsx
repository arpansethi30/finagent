'use client';

import { useState } from 'react';

interface PortfolioRecommendation {
  profile: {
    age: number;
    income: number;
    risk_appetite: string;
    investment_period: number;
  };
  recommendation: string;
}

export default function PortfolioPage() {
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    risk_appetite: 'medium',
    investment_period: '',
  });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<PortfolioRecommendation | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendation(null);

    try {
      const response = await fetch('http://localhost:8001/portfolio/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: parseInt(formData.age),
          income: parseFloat(formData.income),
          risk_appetite: formData.risk_appetite,
          investment_period: parseInt(formData.investment_period),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get portfolio recommendation');
      }

      const data = await response.json();
      setRecommendation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get portfolio recommendation. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Portfolio Recommendation</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter your age"
              required
              min="18"
              max="120"
            />
          </div>

          <div>
            <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">
              Annual Income ($)
            </label>
            <input
              type="number"
              id="income"
              name="income"
              value={formData.income}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter your annual income"
              required
              min="0"
              step="1000"
            />
          </div>

          <div>
            <label htmlFor="risk_appetite" className="block text-sm font-medium text-gray-700 mb-1">
              Risk Appetite
            </label>
            <select
              id="risk_appetite"
              name="risk_appetite"
              value={formData.risk_appetite}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>

          <div>
            <label htmlFor="investment_period" className="block text-sm font-medium text-gray-700 mb-1">
              Investment Period (Years)
            </label>
            <input
              type="number"
              id="investment_period"
              name="investment_period"
              value={formData.investment_period}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter investment period"
              required
              min="1"
              max="50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Generating Recommendation...' : 'Get Portfolio Recommendation'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {recommendation && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Your Personalized Portfolio Recommendation</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Profile Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded">
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-semibold">{recommendation.profile.age} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Income</p>
                <p className="font-semibold">${recommendation.profile.income.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Risk Level</p>
                <p className="font-semibold capitalize">{recommendation.profile.risk_appetite}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Investment Period</p>
                <p className="font-semibold">{recommendation.profile.investment_period} years</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Recommendation</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-700 whitespace-pre-line">{recommendation.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 