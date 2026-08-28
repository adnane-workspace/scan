import DocumentHead from './DocumentHead.jsx';
import { useLocale } from '../../hooks/useLocale.js';
import { APP_NAME } from '../../utils/constants.js';
import { organizationJsonLd, softwareJsonLd } from '../../utils/seoJsonLd.js';

export default function LandingSeo() {
  const { t } = useLocale();
  const title = t('landing.seoHomeTitle', { name: APP_NAME });
  const description = t('landing.seoHomeDescription');

  return (
    <DocumentHead
      title={title}
      description={description}
      path="/"
      jsonLd={[organizationJsonLd(), softwareJsonLd(description)]}
    />
  );
}
