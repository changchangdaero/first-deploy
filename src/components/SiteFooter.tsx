import VisitorStatsCard from '@/components/VisitorStatsCard';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="portfolio-footer" aria-label="Site footer">
      <p className="portfolio-footer__line">
        <span className="portfolio-footer__item">&copy; {year} 유창민</span>
        <VisitorStatsCard />
      </p>
    </footer>
  );
}
