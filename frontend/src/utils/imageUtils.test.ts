import test from 'node:test';
import assert from 'node:assert';
import imageUtils from './imageUtils.ts';

test('imageUtils.getImageUrl helper', async (t) => {
  await t.test('returns a placeholder data URL if path is invalid or empty', () => {
    const result = imageUtils.getImageUrl(null, 'project');
    assert.match(result, /^data:image\/svg\+xml;base64,/);
  });

  await t.test('returns the original URL if it starts with http', () => {
    const url = 'https://example.com/image.png';
    const result = imageUtils.getImageUrl(url);
    assert.strictEqual(result, url);
  });

  await t.test('returns the original URL if it starts with data:', () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAA';
    const result = imageUtils.getImageUrl(dataUrl);
    assert.strictEqual(result, dataUrl);
  });

  await t.test('returns relative path prepended with base URL (empty base URL case)', () => {
    const path = '/media/project.png';
    const result = imageUtils.getImageUrl(path);
    assert.strictEqual(result, '/media/project.png');
  });
});
