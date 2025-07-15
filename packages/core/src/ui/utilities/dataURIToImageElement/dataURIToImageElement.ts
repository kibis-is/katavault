import DOMPurify from 'dompurify';
import { h, type VNode } from 'preact';
import type { SVGAttributes } from 'preact/compat';

// types
import type { Parameters } from './types';

/**
 * Converts a `image/svg+xml` data URI into an element.
 * @param {Parameters} params - The `image/svg+xml` data URI and optional parameters.
 * @param {string} params.className - [optional] An optional class name to pass to the prop.
 * @param {string} params.dataURI - The data URI.
 * @returns {VNode | null} The parsed `image/svg+xml` data URI or null if it failed to parse the data URI.
 */
export default function dataURIToImageElement({ className, dataURI, title }: Parameters): VNode<SVGAttributes> | null {
  let data: string | undefined;
  let document: Document;
  let element: SVGElement | null;
  let parser: DOMParser;
  let svg: string;

  if (dataURI.indexOf('data:') !== 0) {
    return null;
  }

  if (dataURI.indexOf(',') < 0) {
    return null;
  }

  data = dataURI.split(',').pop();

  if (!data) {
    return null;
  }

  const [mimeType, encoding] = dataURI.substring('data:'.length, dataURI.indexOf(',')).split(';');

  if (mimeType !== 'image/svg+xml') {
    return null;
  }

  if (encoding === 'base64') {
    data = window.atob(data);
  }

  parser = new DOMParser();
  svg = decodeURIComponent(data);
  document = parser.parseFromString(
    DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } }),
    mimeType
  ); // sanitize for any nastiness
  element = document.getElementsByTagName('svg').item(0);

  if (!element) {
    return null;
  }

  return h<SVGAttributes>(element.tagName.toLowerCase(), {
    ...Array.from(element.attributes).reduce(
      (props, attr) => ({
        ...props,
        [attr.name]: attr.value,
      }),
      {}
    ),
    className,
    dangerouslySetInnerHTML: {
      __html: title ? `<title>${title}</title>${element.innerHTML}` : element.innerHTML,
    },
  });
}
