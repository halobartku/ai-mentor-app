export function useChat() {
  const sendMessage = useCallback(async (content: string) => {
    setLoading(true);
    addMessage({ role: 'user', content, timestamp: new Date() });

    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content })
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        
        await handleStreamingResponse(response);
        break;

      } catch (error) {
        retryCount++;
        if (retryCount === maxRetries) {
          addMessage({
            role: 'system',
            content: 'Failed to process message. Please try again.',
            error: true,
            timestamp: new Date()
          });
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
      }
    }
    
    setLoading(false);
  }, []);

  return { messages, sendMessage };
}