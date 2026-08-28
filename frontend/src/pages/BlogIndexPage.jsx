import { Link } from 'react-router-dom';
import DocumentHead from '../components/seo/DocumentHead.jsx';
import SeoBreadcrumbs from '../components/seo/SeoBreadcrumbs.jsx';
import SeoCta from '../components/seo/SeoCta.jsx';
import MarketingLayout from '../layouts/MarketingLayout.jsx';
import { getBlogArticles, resolveSeoPage } from '../content/seo/index.js';
import { useLocale } from '../hooks/useLocale.js';
import { pick } from '../content/seo/helpers.js';
import { breadcrumbJsonLd, organizationJsonLd, softwareJsonLd } from '../utils/seoJsonLd.js';

export default function BlogIndexPage() {
  const { locale, t } = useLocale();
  const articles = getBlogArticles();
  const title = t('landing.blogIndexTitle');
  const description = t('landing.blogIndexDescription');
  const breadcrumbs = [
    { path: '/', name: t('landing.navHome') },
    { path: '/blog', name: t('landing.navBlog') },
  ];

  return (
    <MarketingLayout>
      <DocumentHead
        title={title}
        description={description}
        path="/blog"
        jsonLd={[organizationJsonLd(), softwareJsonLd(description), breadcrumbJsonLd(breadcrumbs)]}
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <SeoBreadcrumbs items={breadcrumbs} />
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t('landing.navBlog')}</h1>
        <p className="mt-4 text-lg text-on-surface-variant">{description}</p>
        <ul className="mt-10 space-y-4">
          {articles.map((article) => {
            const resolved = resolveSeoPage(article.path, locale);
            return (
              <li key={article.path}>
                <Link
                  to={article.path}
                  className="block rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 hover:border-primary/40"
                >
                  <h2 className="font-display text-xl font-semibold text-on-surface">{resolved.h1}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{pick(article.description, locale)}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        <SeoCta title={t('landing.ctaStart')} body={t('landing.bottomBody')} />
      </div>
    </MarketingLayout>
  );
}
