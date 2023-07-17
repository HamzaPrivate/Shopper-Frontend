import React from 'react';
import { render, screen } from '@testing-library/react';
import PagePrefs from '../PagePrefs';

test('renders admin page correctly', () => {
    render(<PagePrefs />);

    // Assertions
    expect(screen.getByText(/PREFS PAGE/i)).toBeInTheDocument();
});

