import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">Welcome to Financial AI Agent</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Stock Analysis</h2>
            <p className="text-gray-600 mb-4">
              Get detailed analysis of stocks using advanced AI and technical indicators.
            </p>
            <a
              href="/stock-analysis"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Analyze Stocks
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Portfolio Recommendations</h2>
            <p className="text-gray-600 mb-4">
              Receive personalized portfolio recommendations based on your profile and goals.
            </p>
            <a
              href="/portfolio"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Get Recommendations
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Sentiment Analysis</h2>
            <p className="text-gray-600 mb-4">
              Analyze market sentiment using news and social media data.
            </p>
            <a
              href="/sentiment"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Check Sentiment
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Real-time stock data analysis</li>
              <li>AI-powered insights</li>
              <li>Technical indicators</li>
              <li>News sentiment analysis</li>
              <li>Personalized portfolio recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
