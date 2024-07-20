import Bottleneck from "bottleneck";

export const authEndpointsLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 60000, // 10 min
  reservoir: 50,
  reservoirRefreshAmount: 50,
  reservoirRefreshInterval: 24 * 60 * 60 * 1000, // 1 day
});

export const genericReadEndpointsLimiter = new Bottleneck({
  maxConcurrent: 10, // Process one request at a time
  minTime: 20, // Minimum time between requests (20ms per request)
  reservoir: 25, // Initial reservoir capacity
  reservoirRefreshAmount: 25, // Number of requests added each refresh
  reservoirRefreshInterval: 1000, // Interval to refresh the reservoir (1 second)
});

export const genericWriteEndpointsLimiter = new Bottleneck({
  maxConcurrent: 2, // Process one request at a time
  minTime: 50, // Minimum time between requests (50ms per request)
  reservoir: 5, // Initial reservoir capacity
  reservoirRefreshAmount: 5, // Number of requests added each refresh
  reservoirRefreshInterval: 1000, // Interval to refresh the reservoir (1 second)
});

export const archiveEndpointsLimiter = new Bottleneck({
  maxConcurrent: 2, // Process one request at a time
  minTime: 50, // Minimum time between requests (50ms per request)
  reservoir: 2, // Initial reservoir capacity
  reservoirRefreshAmount: 2, // Number of requests added each refresh
  reservoirRefreshInterval: 1000, // Interval to refresh the reservoir (1 second)
});

export const createFeasibilityEndpointLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
  reservoir: 1,
  reservoirRefreshAmount: 1,
  reservoirRefreshInterval: 1000,
});

// CREATE TASK ENDPOINT LIMITER STARTS HERE

// By hour limiter
const createTaskByHourLimiter = new Bottleneck({
  maxConcurrent: 1,
  reservoir: 120,
  reservoirRefreshAmount: 120,
  reservoirRefreshInterval: 60 * 60 * 1000, // Refresh every 60 minutes
});

// By second limiter
const createTaskBySecondLimiter = new Bottleneck({
  maxConcurrent: 1, // Process one request at a time
  minTime: 200, // Minimum time between requests (50ms per request)
  reservoir: 2, // Initial reservoir capacity
  reservoirRefreshAmount: 2, // Number of requests added each refresh
  reservoirRefreshInterval: 1000, // Interval to refresh the reservoir (1 second),
});

// Chaining both of them
export const createTaskEndpointLimiter = createTaskBySecondLimiter.chain(
  createTaskByHourLimiter
);

// CREATE TASK ENDPOINT LIMITER ENDS HERE

// CANCEL TASK ENDPOINT LIMITER STARTS HERE

// Rate limiter for 1 request per second
const cancelTaskPerSecondLimiter = new Bottleneck({
  maxConcurrent: 1, // Only one request at a time
  minTime: 1000, // Minimum time between requests: 1 second
  reservoir: 1, // Start with 1 token in the reservoir
  reservoirRefreshAmount: 1, // Add 1 token per second
  reservoirRefreshInterval: 1000, // Refresh every 1 second
});

// Rate limiter for 10 requests per minute
const cancelTaskPerMinuteLimiter = new Bottleneck({
  maxConcurrent: 2,
  reservoir: 10,
  reservoirRefreshAmount: 10,
  reservoirRefreshInterval: 60 * 1000, // Refresh every 60 seconds
});

// Rate limiter for 30 requests per hour
const cancelTaskPerHourLimiter = new Bottleneck({
  maxConcurrent: 2,
  reservoir: 30,
  reservoirRefreshAmount: 30,
  reservoirRefreshInterval: 60 * 60 * 1000, // Refresh every 60 minutes
});

// Chaining all of them
export const cancelTaskEndpointRateLimiter = cancelTaskPerSecondLimiter
  .chain(cancelTaskPerMinuteLimiter)
  .chain(cancelTaskPerHourLimiter);

// CANCEL TASK ENDPOINT LIMITER ENDS HERE
