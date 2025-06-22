import { getFormattedImageTag, TagSettings, mergeSettings, shouldShowTagOptions } from '../src/utils';

describe('getFormattedImageTag', () => {
  it('returns minimal tag when settings.stripAttributes is true', () => {
    const img = { src: 'test.jpg', alt: '', outerHTML: '<img src="test.jpg">' } as HTMLImageElement;
    const settings: TagSettings = { stripAttributes: true, copyFormat: 'full', includeSize: false };
    expect(getFormattedImageTag(img, settings)).toBe('<img src="test.jpg">');
  });
  it('returns markdown when copyFormat is markdown', () => {
    const img = { src: 'test.jpg', alt: 'alt', outerHTML: '<img src="test.jpg">' } as HTMLImageElement;
    const settings: TagSettings = { stripAttributes: false, copyFormat: 'markdown', includeSize: false };
    expect(getFormattedImageTag(img, settings)).toBe('![alt](test.jpg)');
  });
  it('removes width/height when includeSize is false', () => {
    const img = { src: 'test.jpg', alt: '', outerHTML: '<img src="test.jpg" width="100" height="100">' } as HTMLImageElement;
    const settings: TagSettings = { stripAttributes: false, copyFormat: 'full', includeSize: false };
    expect(getFormattedImageTag(img, settings)).toBe('<img src="test.jpg">');
  });
  it('keeps width/height when includeSize is true', () => {
    const img = { src: 'test.jpg', alt: '', outerHTML: '<img src="test.jpg" width="100" height="100">' } as HTMLImageElement;
    const settings: TagSettings = { stripAttributes: false, copyFormat: 'full', includeSize: true };
    expect(getFormattedImageTag(img, settings)).toBe('<img src="test.jpg" width="100" height="100">');
  });
});

describe('mergeSettings', () => {
  it('merges overrides into defaults', () => {
    const defaults: TagSettings = { stripAttributes: false, copyFormat: 'full', includeSize: true };
    const overrides: Partial<TagSettings> = { copyFormat: 'markdown' };
    expect(mergeSettings(defaults, overrides)).toEqual({ stripAttributes: false, copyFormat: 'markdown', includeSize: true });
  });
});

describe('shouldShowTagOptions', () => {
  it('returns false for image mode', () => {
    expect(shouldShowTagOptions('image')).toBe(false);
  });
  it('returns true for tag mode', () => {
    expect(shouldShowTagOptions('tag')).toBe(true);
  });
  it('returns true for both mode', () => {
    expect(shouldShowTagOptions('both')).toBe(true);
  });
}); 