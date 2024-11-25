import { refreshData } from "./refresh";

export async function withRetry(
  operation: () => Promise<any>,
  retries: number,
  delay: number,
  refreshLimit: number = 3 // Default refresh limit if retries exceed
): Promise<any> {
  let attempt = 0;
  let refreshAttempts = 0;

  while (attempt <= retries) {
    try {
      // Attempt the operation
      return await operation();
    } catch (error) {
      attempt++;

      if (attempt <= retries) {
        // Retry with delay
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      // If retry count exceeded and refresh limit is available, refresh request
      if (attempt > retries && refreshAttempts < refreshLimit) {
        refreshAttempts++;
        await refreshData(); // Use the local refreshData function
      }
    }
  }

  // Throw error after retries are exhausted
  throw new Error('Max retries exceeded. Operation failed.');
}
