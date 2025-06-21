export async function correctText(text: string): Promise<any> {
  try {
    const response = await fetch('http://localhost:8001/correct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error calling correction API:', error);
    throw error;
  }
}
