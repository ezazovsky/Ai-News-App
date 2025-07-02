'use client';

import { useState } from 'react';

type Article = {
  title: string;
  summary: string;
  url: string;
};

const categories = ['general', 'technology', 'sports', 'business'];

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<string>('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndDisplayNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/news?category=${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (err) {
      setError((err as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1>AI News Summarizer</h1>

      <label htmlFor="category" style={{ marginRight: '8px', fontWeight: 'bold' }}>
        Select Category:
      </label>
      <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: '6px 12px', fontSize: '16px', marginBottom: '16px' }}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>

      <br />

      <button onClick={fetchAndDisplayNews} disabled={loading}>
        {loading ? 'Loading...' : 'Get Latest News'}
      </button>

      {error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>
          Error: {error}
        </p>
      )}

      <div style={{ maxWidth: 600, margin: '20px auto', textAlign: 'left' }}>
        {articles.map((article, index) => (
          <div
            key={index}
            className="news-item"
            style={{
              marginBottom: '20px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              backgroundColor: '#fafafa',
            }}
          >
            <h2 style={{ margin: '0 0 8px 0' }}>{article.title}</h2>
            <p style={{ margin: '0 0 12px 0' }}>
              <strong>Summary:</strong> {article.summary}
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              Read Full Article
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
