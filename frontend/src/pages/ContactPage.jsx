import { useState } from 'react';
import DocumentHead from '../components/seo/DocumentHead.jsx';
import SeoBreadcrumbs from '../components/seo/SeoBreadcrumbs.jsx';
import SeoCta from '../components/seo/SeoCta.jsx';
import MarketingLayout from '../layouts/MarketingLayout.jsx';
import { resolveSeoPage } from '../content/seo/index.js';
import { useLocale } from '../hooks/useLocale.js';
import { DEVELOPER_URL } from '../utils/constants.js';
import { breadcrumbJsonLd, faqJsonLd, organizationJsonLd, softwareJsonLd } from '../utils/seoJsonLd.js';

export default function ContactPage() {
  const { locale, t } = useLocale();
  const page = resolveSeoPage('/contact', locale);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const jsonLd = [organizationJsonLd(), softwareJsonLd(page.description), breadcrumbJsonLd(page.breadcrumbs), faqJsonLd(page.faq)].filter(
    Boolean,
  );

  function handleSubmit(event) {
    event.preventDefault();
    const subject = encodeURIComponent(`Scanosh — ${name || t('landing.navContact')}`);
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:hello@scanosh.com?subject=${subject}&body=${body}`;
  }

  return (
    <MarketingLayout>
      <DocumentHead title={page.title} description={page.description} path="/contact" jsonLd={jsonLd} />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <SeoBreadcrumbs items={page.breadcrumbs} />
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{page.h1}</h1>
        <p className="mt-6 text-lg leading-relaxed text-on-surface">{page.answer}</p>

        <form className="mt-10 grid gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6" onSubmit={handleSubmit}>
          <label className="grid gap-1 text-sm font-medium">
            {t('auth.yourName')}
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-xl border border-outline-variant/40 bg-surface px-3 py-2.5 text-base font-normal"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {t('auth.email')}
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-xl border border-outline-variant/40 bg-surface px-3 py-2.5 text-base font-normal"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            {t('landing.contactMessage')}
            <textarea
              required
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="rounded-xl border border-outline-variant/40 bg-surface px-3 py-2.5 text-base font-normal"
            />
          </label>
          <button type="submit" className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-on-primary hover:bg-primary-hover">
            {t('landing.contactSend')}
          </button>
          <p className="text-sm text-on-surface-variant">
            {t('landing.contactAlt')}{' '}
            <a href={DEVELOPER_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {t('landing.contactMe')}
            </a>
          </p>
        </form>

        {page.sections.map((section) => (
          <section key={section.h2} className="mt-10">
            <h2 className="font-display text-2xl font-semibold">{section.h2}</h2>
            <p className="mt-3 leading-relaxed text-on-surface-variant">{section.body}</p>
          </section>
        ))}

        <SeoCta title={page.ctaTitle} body={page.ctaBody} />
      </article>
    </MarketingLayout>
  );
}
