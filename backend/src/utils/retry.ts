interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
  errorType: string;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError;
  
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;
      if (attempt === options.maxAttempts) break;
      await new Promise(resolve => setTimeout(resolve, options.delayMs));
    }
  }
  
  throw new Error(`${options.errorType}: Max retries reached. ${lastError.message}`);
}