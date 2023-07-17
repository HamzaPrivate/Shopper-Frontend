import React from 'react';
import { render, screen } from '@testing-library/react';
import PageAdmin from '../PageAdmin';

test('renders admin page correctly', () => {
    render(<PageAdmin />);

    // Assertions
    expect(screen.getByText(/ADMIN PAGE/i)).toBeInTheDocument();
});

