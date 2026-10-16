import { render } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import App from './App';

describe('App Component', () => {
  test('renders without crashing and scrolls to top on initial render', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
    scrollToSpy.mockRestore();
  });
});
