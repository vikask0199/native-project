/**
 * Function simulates a "sleep" function in javascript
 * @param ms time to sleep in (in milliseconds)
 * @returns
 */
export default (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
