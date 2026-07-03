import VisitorStatsCard from '@/components/VisitorStatsCard';

const COPYRIGHT_YEAR = 2026;

export default function SiteFooter() {
  return (
    <footer className="portfolio-footer" aria-label="Site footer">
      <p className="portfolio-footer__line">
        <span className="portfolio-footer__item">&copy; {COPYRIGHT_YEAR} 유창민</span>
        <VisitorStatsCard />
      </p>
    </footer>
  );
}
