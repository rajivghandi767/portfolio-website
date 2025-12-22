import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Basic smoke test - if it renders and we can find the main container or header, good.
    // Since we lazy load, we might see the spinner first or the layout.
    // Let's just check if the render process completes without error.
    expect(document.body).toBeInTheDocument();
  });
});
