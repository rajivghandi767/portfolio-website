import { describe, test, expect } from 'vitest';
import imageUtils from './imageUtils';

describe('imageUtils.getImageUrl', () => {
  test('returns a placeholder data URL if path is invalid or empty', () => {
    const result = imageUtils.getImageUrl(null, 'project');
    expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  test('returns the original URL if it starts with http', () => {
    const url = 'https://example.com/image.png';
    const result = imageUtils.getImageUrl(url);
    expect(result).toBe(url);
  });

  test('returns the original URL if it starts with data:', () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAA';
    const result = imageUtils.getImageUrl(dataUrl);
    expect(result).toBe(dataUrl);
  });

  test('returns relative path prepended with base URL (empty base URL case)', () => {
    const path = '/media/project.png';
    const result = imageUtils.getImageUrl(path);
    expect(result).toBe('/media/project.png');
  });
});
