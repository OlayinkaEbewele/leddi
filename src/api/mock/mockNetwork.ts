/** Magic acquire ID that always triggers a simulated API failure. PRD §7.3 */
export const FAILURE_ACQUIRE_ID = 'ACQ-FAIL-000';

const MIN_DELAY_MS = 300;
const MAX_DELAY_MS = 800;

function randomDelay(): number {
  return Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
}

export async function withMockNetwork<T>(fn: () => T | Promise<T>): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, randomDelay()));
  return fn();
}

export async function withMockNetworkForAcquireId<T>(
  acquireId: string,
  fn: () => T | Promise<T>,
): Promise<T> {
  if (acquireId === FAILURE_ACQUIRE_ID) {
    await new Promise((resolve) => setTimeout(resolve, randomDelay()));
    throw new Error(`Simulated failure for acquire ID ${FAILURE_ACQUIRE_ID}`);
  }
  return withMockNetwork(fn);
}
