import React, { useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import { resolveMediaUrl } from '../../lib/api';

/**
 * 3-Tier Dynamic Metadata Resolver & Schema.org Generator
 * Tier 1: Item-specific SEO object (item.seo)
 * Tier 2: Item fields (item.title, item.excerpt / shortDescription, item.featuredImage)
 * Tier 3: Global Site Settings SEO Defaults (settings.seoDefaults)
 */
export default function SEOHead({
  title,
  description,
  image,
  canonicalUrl,
  type = 'website',
  schema,
  seoData,
}) {
  const { settings } = useCms();

  useEffect(() => {
    const defaults = settings?.seoDefaults || {};
    const siteName = settings?.siteName || 'NEXUS DEVS';

    // Tier resolution
    const resolvedTitle =
      seoData?.title ||
      title ||
      defaults.metaTitle ||
      `${siteName} — IT, AI, Web Development & Digital Growth`;

    const resolvedDescription =
      seoData?.metaDescription ||
      description ||
      defaults.metaDescription ||
      settings?.siteTagline ||
      'Personal IT Officer, Full-Stack Developer & Digital Marketing Studio.';

    const resolvedRobots = seoData?.robots || defaults.robots || 'index, follow';

    const rawImage = seoData?.ogImage || image || defaults.ogImage || settings?.logo;
    const resolvedImage = rawImage ? resolveMediaUrl(rawImage) : '';

    const resolvedCanonical =
      seoData?.canonicalUrl || canonicalUrl || window.location.href;

    // 1. Title
    document.title = resolvedTitle;

    // Helper to update or create meta tags
    const setMeta = (name, content, isProperty = false) => {
      if (!content) return;
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta
    setMeta('description', resolvedDescription);
    setMeta('robots', resolvedRobots);

    // 3. Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', resolvedCanonical);

    // 4. Open Graph
    setMeta('og:site_name', siteName, true);
    setMeta('og:title', resolvedTitle, true);
    setMeta('og:description', resolvedDescription, true);
    setMeta('og:type', type, true);
    setMeta('og:url', resolvedCanonical, true);
    if (resolvedImage) {
      setMeta('og:image', resolvedImage, true);
    }

    // 5. Twitter Card
    setMeta('twitter:card', resolvedImage ? 'summary_large_image' : 'summary');
    setMeta('twitter:title', resolvedTitle);
    setMeta('twitter:description', resolvedDescription);
    if (resolvedImage) {
      setMeta('twitter:image', resolvedImage);
    }

    // 6. Schema.org JSON-LD
    let scriptTag = document.getElementById('schema-jsonld');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'schema-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: siteName,
        description: resolvedDescription,
        url: window.location.origin,
        telephone: settings?.contactPhone || '',
        email: settings?.contactEmail || '',
        address: settings?.address || '',
      });
    }
  }, [title, description, image, canonicalUrl, type, schema, seoData, settings]);

  return null;
}
