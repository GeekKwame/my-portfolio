import { useEffect } from 'react';
import { SITE_URL } from '../config/constants';

function setMeta(selector, attribute, value) {
  document.querySelector(selector)?.setAttribute(attribute, value);
}

/** Per-page title, description, and canonical URL for the client-rendered routes. */
export default function useDocumentMeta({ title, description, path }) {
  useEffect(() => {
    const url = new URL(path, SITE_URL).href;
    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', url);
  }, [title, description, path]);
}
