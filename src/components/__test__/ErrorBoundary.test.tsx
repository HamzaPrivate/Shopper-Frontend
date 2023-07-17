import { act, render, screen } from "@testing-library/react";
import App from "../../App";
import Bomb from "./Bomb";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../ErrorFallback";


test('Catch error and show in ErrorFallback', async () => {
    const orgError = console.error;
    try {
        console.error = () => { } //leere lambda?
        act(() => {
            render(<ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Bomb />
                </ErrorBoundary>)
        })
    } finally {
        console.error = orgError;
    }
    // Eigentliche Tests:
    // expect(screen.getByText("Something went wrong:")).toBeInTheDocument();
});