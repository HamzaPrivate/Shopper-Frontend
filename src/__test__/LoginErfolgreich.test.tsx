import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { withErrorBoundary } from 'react-error-boundary';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import mockFetch from './mockFetch';


const AppWithErrorBoundary = withErrorBoundary(App, {
    onError: (err, info) => { throw err; },
    fallback: <div />
  });
  
test('Login-Dialog schließt sich bei erfolgreichem Login', async () => {
    mockFetch();
    const orgError = console.error;
    try {
        console.error = () => { }

        render(<MemoryRouter initialEntries={["/"]}>
            <AppWithErrorBoundary />
        </MemoryRouter>);


    } finally {
        console.error = orgError;
    }

    // Initiale Shop-Listen sollte geladen sein
    await waitFor(() => { 
        const title = screen.getAllByText(/Store/i);
        expect(title.length).toBeGreaterThanOrEqual(2);
    });

    // Login-Button im Menü sollte vorhanden sein
    const loginMenu = await screen.findAllByText(/Login/i);
    expect(loginMenu.length).toBe(1);
    loginMenu[0].click();
    
    // Login-Dialog sollte jetzt sichtbar sein
    await waitFor(() => { 
        screen.getByLabelText(/E-Mail/i);
        screen.getByLabelText(/Passwort/i);
        screen.getByText("Cancel");
        screen.getByText("OK");
    });
    
    // Login-Dialog ausfüllen und OK klicken
    const email = screen.getByLabelText(/E-Mail/i);
    const password = screen.getByLabelText(/Passwort/i);
    const ok = screen.getByText("OK");
    fireEvent.change(email, { target: { value: "john@some-host.de" } });
    fireEvent.change(password, { target: { value: "12abcAB!" } });
    fireEvent.click(ok);

    await waitFor(() => { // Login-Dialog sollte jetzt geschlossen sein
        const emailFields = screen.queryAllByLabelText(/E-Mail/i);
        expect(emailFields.length).toBe(0);
    });

});
