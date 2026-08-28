import { Link, Navigate, useLocation } from 'react-router-dom';
import AppLink from '../components/common/AppLink.jsx';
import DocumentHead from '../components/seo/DocumentHead.jsx';
import SeoBreadcrumbs from '../components/seo/SeoBreadcrumbs.jsx';
import SeoCta from '../components/seo/SeoCta.jsx';
import MarketingLayout from '../layouts/MarketingLayout.jsx';
import { resolveSeoPage } from '../content/seo/index.js';
import { useLocale } from '../hooks/useLocale.js';
import { isAppPath } from '../utils/hosts.js';
import { breadcrumbJsonLd, faqJsonLd, organizationJsonLd, softwareJsonLd } from '../utils/seoJsonLd.js';

function splitParagraphs(text) {
  return String(text || '')
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function SeoDocumentPage() {
  const location = useLocation();
  const { locale, t } = useLocale();
  const page = resolveSeoPage(location.pathname, locale);

  if (!page || page.type === 'hub') {
    return <Navigate to="/" replace />;
  }

  const jsonLd = [organizationJsonLd(), softwareJsonLd(page.description), breadcrumbJsonLd(page.breadcrumbs), faqJsonLd(page.faq)].filter(
    Boolean,
  );

  return (
    <MarketingLayout>
      <DocumentHead
        title={page.title}
        description={page.description}
        path={page.path}
        jsonLd={jsonLd}
        type={page.type === 'article' ? 'article' : 'website'}
      />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <SeoBreadcrumbs items={page.breadcrumbs} />
        <p className="text-label-md font-semibold tracking-[0.14em] text-primary uppercase">{t('landing.seoKicker')}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-on-surface sm:text-4xl">{page.h1}</h1>
        <p className="mt-6 text-lg leading-relaxed text-on-surface">{page.answer}</p>

        {page.sections.map((section) => (
          <section key={section.h2} className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-on-surface">{section.h2}</h2>
            {splitParagraphs(section.body).map((paragraph) => (
              <p key={paragraph} className="mt-3 leading-relaxed text-on-surface-variant">
                {paragraph}
              </p>
            ))}
            {section.items?.length ? (
              <ul className="mt-4 list-disc space-y-2 ps-5 text-on-surface-variant">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        {page.children.length ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-on-surface">{t('landing.seoChildren')}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {page.children.map((child) => (
                <li key={child.path}>
                  <Link
                    to={child.path}
                    className="block rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 font-medium text-on-surface hover:border-primary/40 hover:text-primary"
                  >
                    {child.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {page.faq.length ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-on-surface">{t('landing.seoFaq')}</h2>
            <div className="mt-4 divide-y divide-outline-variant/30 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest">
              {page.faq.map((item) => (
                <details key={item.q} className="group px-4 py-3 sm:px-5">
                  <summary className="cursor-pointer list-none font-semibold text-on-surface [&::-webkit-details-marker]:hidden">
                    {item.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {page.related.length ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-on-surface">{t('landing.seoRelated')}</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {page.related.map((item) => (
                <li key={item.path}>
                  {isAppPath(item.path) ? (
                    <AppLink to={item.path} className="font-medium text-primary hover:underline">
                      {item.title}
                    </AppLink>
                  ) : (
                    <Link to={item.path} className="font-medium text-primary hover:underline">
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <SeoCta title={page.ctaTitle} body={page.ctaBody} />
      </article>
    </MarketingLayout>
  );
}
