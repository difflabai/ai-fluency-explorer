
/**
 * Generates a random date within the configured range
 */
export const generateDate = (
  startDate: Date,
  endDate: Date
): string => {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  
  return new Date(randomTime).toISOString();
};
