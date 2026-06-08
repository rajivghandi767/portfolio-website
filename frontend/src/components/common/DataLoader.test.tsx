import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DataLoader from './DataLoader';

describe('DataLoader Component', () => {
  test('renders spinner when isLoading is true', () => {
    const { container } = render(
      <DataLoader isLoading={true} error={null} data={null}>
        {(data: unknown[]) => <div>{String(data[0])}</div>}
      </DataLoader>
    );
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).not.toBeNull();
  });

  test('renders error message when error is present', () => {
    const errorMsg = 'Failed to load portfolio items';
    render(
      <DataLoader isLoading={false} error={errorMsg} data={null}>
        {(data: unknown[]) => <div>{String(data[0])}</div>}
      </DataLoader>
    );
    expect(screen.getByText(errorMsg)).toBeDefined();
  });

  test('renders empty message when data is empty or null', () => {
    render(
      <DataLoader isLoading={false} error={null} data={[]}>
        {(data: unknown[]) => <div>{String(data[0])}</div>}
      </DataLoader>
    );
    expect(screen.getByText('No items available at this time.')).toBeDefined();
  });

  test('renders child elements when data is loaded successfully', () => {
    const items = ['Project A', 'Project B'];
    render(
      <DataLoader isLoading={false} error={null} data={items}>
        {(data: string[]) => (
          <ul>
            {data.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </DataLoader>
    );
    expect(screen.getByText('Project A')).toBeDefined();
    expect(screen.getByText('Project B')).toBeDefined();
  });
});
