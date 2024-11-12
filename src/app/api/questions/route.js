export async function GET() {
  try {
    const response = await fetch('https://xyz.ag3nts.org/', {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    const regex = /<[^>]*id="human-question"[^>]*>(.*?)<\/[^>]*>/;
    const match = html.match(regex);

    if (!match) {
      throw new Error('Element with id human-question not found');
    }

    const cleanContent = match[1].replace(/Question:<br\s*\/>/, '');
    return new Response(JSON.stringify({ content: cleanContent }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    return new Response(JSON.stringify({ 
      error: 'An error occurred while fetching content',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
