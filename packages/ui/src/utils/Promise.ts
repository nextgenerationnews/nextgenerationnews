export async function retryPromise<T>(promiseFactory: () => Promise<T>, times: number): Promise<T> {
  try {
    return promiseFactory();
  } catch (e) {
    if (times > 0) {
      return retryPromise(promiseFactory, times - 1);
    }

    throw e;
  }
}
