import '@testing-library/jest-dom';

// jest.setup.ts
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: 'http://localhost:3000',
        VITE_WORKER_ID: 'test-worker-id',
      },
    },
  },
});
