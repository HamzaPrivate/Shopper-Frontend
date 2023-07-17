import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import mockFetch from './mockFetch';
import ErrorFallback from '../ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { MemoryRouter } from 'react-router-dom';
import PageShopItem from '../PageShopItem';

test('Shopitem', async () => {
  //This line saves the original console.error function into the orgError variable
  //for later restoration.
  const orgError = console.error;
  mockFetch();
  try {
      //suppress any error messages that might occur during the rendering of the component
      console.error = () => { }

      render(<MemoryRouter initialEntries={["/shopitem/51"]}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
              <PageShopItem />
          </ErrorBoundary>
      </MemoryRouter>);


  } finally {
      console.error = orgError;
  }
  //wait until a certain condition is met
  await waitFor(() => {
      const title = screen.getAllByText(/400/i);
      expect(title.length).toBeGreaterThanOrEqual(1);
  },{timeout: 3000});
});