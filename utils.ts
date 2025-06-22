export interface TagSettings {
  stripAttributes: boolean;
  copyFormat: 'full' | 'minimal' | 'markdown';
  includeSize: boolean;
}

export function getFormattedImageTag(img: HTMLImageElement, settings: TagSettings): string {
  if (settings.stripAttributes) {
    return `<img src="${img.src}">`;
  }
  switch (settings.copyFormat) {
    case 'minimal':
      return `<img src="${img.src}">`;
    case 'markdown':
      const altText = img.alt || 'image';
      return `![${altText}](${img.src})`;
    case 'full':
    default:
      let tag = img.outerHTML;
      if (!settings.includeSize) {
        tag = tag.replace(/ width="[^"]*"/, '').replace(/ height="[^"]*"/, '');
      }
      return tag;
  }
} 