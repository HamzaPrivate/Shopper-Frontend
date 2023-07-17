import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import mockFetch from './mockFetch';


import { ErrorBoundary, withErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../ErrorFallback';


//1000 is the default anyway
const MAX_TIMEOUT_FOR_FETCH_TESTS = Number.parseInt(process.env.MAX_TIMEOUT_FOR_FETCH_TESTS || "1000");

function waitForLonger(callback: () => void | Promise<void>) {
    return waitFor(callback, { timeout: MAX_TIMEOUT_FOR_FETCH_TESTS });
}

const AppWithErrorBoundary = withErrorBoundary(App, {
    onError: (err, info) => { throw err; },
    fallback: <div />
});

test('Shopper', async () => {
    //This line saves the original console.error function into the orgError variable
    //for later restoration.
    const orgError = console.error;
    mockFetch();
    try {
        //suppress any error messages that might occur during the rendering of the component
        console.error = () => { }

        render(<MemoryRouter initialEntries={["/"]}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <AppWithErrorBoundary />
            </ErrorBoundary>
        </MemoryRouter>);


    } finally {
        console.error = orgError;
    }
    //wait until a certain condition is met
    await waitForLonger(() => {
        const title = screen.getAllByText(/Store/i);
        expect(title.length).toBeGreaterThanOrEqual(2);
    });

    const title = await screen.findAllByText(/Creator/i);
    // const title = await screen.findAllByText(/Channel [12]/i);
    expect(title.length).toBeGreaterThanOrEqual(2);
});

test('Shoplist with id 123456', async () => {
    //This line saves the original console.error function into the orgError variable
    //for later restoration.
    const orgError = console.error;
    mockFetch();
    try {
        //suppress any error messages that might occur during the rendering of the component
        console.error = () => { }

        render(<MemoryRouter initialEntries={["/shoplist/123456"]}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <AppWithErrorBoundary />
            </ErrorBoundary>
        </MemoryRouter>);


    } finally {
        console.error = orgError;
    }
    //wait until a certain condition is met
    await waitForLonger(() => {
        const title = screen.getAllByText(/Store/i);
        expect(title.length).toBeGreaterThanOrEqual(2);
    });

    const title = await screen.findAllByText(/Creator/i);
    //const title = await screen.findAllByText(/Channel [12]/i);
    expect(title.length).toBeGreaterThanOrEqual(2);
});

test('Shoplist with id 51, negative', async () => {
    //This line saves the original console.error function into the orgError variable
    //for later restoration.
    const orgError = console.error;
    mockFetch();
    try {
        //suppress any error messages that might occur during the rendering of the component
        console.error = () => { }

        render(<MemoryRouter initialEntries={["/shoplist/51"]}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <AppWithErrorBoundary />
            </ErrorBoundary>
        </MemoryRouter>);


    } finally {
        console.error = orgError;
    }
    //wait until a certain condition is met
    await waitForLonger(() => {
        const title = screen.getAllByText(/404/i);
        expect(title.length).toBeGreaterThanOrEqual(1);
    });
});

test('Shoplist with id abc, negative', async () => {
    //This line saves the original console.error function into the orgError variable
    //for later restoration.
    const orgError = console.error;
    mockFetch();
    try {
        //suppress any error messages that might occur during the rendering of the component
        console.error = () => { }

        render(<MemoryRouter initialEntries={["/shoplist/abc"]}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <AppWithErrorBoundary />
            </ErrorBoundary>
        </MemoryRouter>);


    } finally {
        console.error = orgError;
    }
    //wait until a certain condition is met
    await waitForLonger(() => {
        const title = screen.getAllByText(/400/i);
        expect(title.length).toBeGreaterThanOrEqual(1);
    });
});



//Testen Sie mal folgende Routen (in initialEntries):
//shoplist/123456"
//shopitem/51"
//shopitem/91"
//shopitem/abc"

