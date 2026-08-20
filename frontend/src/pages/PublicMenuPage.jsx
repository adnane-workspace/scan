import { useParams } from 'react-router-dom';
import PlaceholderPage from '../components/ui/PlaceholderPage.jsx';

export default function PublicMenuPage() {
  const { cafeId } = useParams();

  return (
    <PlaceholderPage
      title="Public menu"
      description="This public page will be the QR Code target. A cafe menu will be loaded from /menu/:cafeId."
    >
      <p className="rounded-xl border border-dashed border-stone-300 bg-white px-4 py-3 text-sm text-stone-600">
        Cafe ID: <span className="font-mono text-stone-900">{cafeId}</span>
      </p>
    </PlaceholderPage>
  );
}
