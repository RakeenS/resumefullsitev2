/**
 * Client-side function to optimize text using the server API route
 */
export async function optimizeText(text: string, prompt: string): Promise<string> {
  try {
    const response = await fetch('/api/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to optimize text');
    }

    const data = await response.json();
    return data.optimizedText;
  } catch (error) {
    console.error('Error optimizing text:', error);
    throw error;
  }
}
