import { NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEWS_API_KEY!;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;

async function summarizeNews(article: { title: string; description: string }) {
  const prompt = `Summarize this news article in one sentence:\n\nTitle: ${article.title}\n\n${article.description}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'openrouter/cypher-alpha:free',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const result = await response.json();
  return result.choices?.[0]?.message?.content || 'No summary available.';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'general';

    const newsRes = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${NEWS_API_KEY}`
    );
    const newsData = await newsRes.json();

    const articles = newsData.articles.slice(0, 5);

    const summarizedArticles = await Promise.all(
      articles.map(async (article: any) => {
        const summary = await summarizeNews(article);
        return {
          title: article.title,
          url: article.url,
          summary,
        };
      })
    );

    return NextResponse.json({ articles: summarizedArticles });
  } catch (error) {
    console.error('Error fetching or summarizing news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch or summarize news.' },
      { status: 500 }
    );
  }
}
