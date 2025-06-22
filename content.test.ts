import { getFormattedImageTag, TagSettings } from './utils';

describe('getFormattedImageTag', () => {
  it('returns minimal tag when settings.stripAttributes is true', () => {
    const img = { src: 'test.jpg', alt: '', outerHTML: '<img src="test.jpg">' } as HTMLImageElement;
    const settings: TagSettings = { stripAttributes: true, copyFormat: 'full', includeSize: false };
    expect(getFormattedImageTag(img, settings)).toBe('<img src="test.jpg">');
  });
}); 