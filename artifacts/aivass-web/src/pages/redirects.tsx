import { useEffect } from "react";
import { useLocation, useParams } from "wouter";

const Redirecting = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center font-serif text-navy">
    Redirecting…
  </div>
);

export function HowItWorksRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("/solutions/individuals", { replace: true }); }, [navigate]);
  return <Redirecting />;
}

export function OnboardingRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("/contact", { replace: true }); }, [navigate]);
  return <Redirecting />;
}

export function ShopRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("/guides", { replace: true }); }, [navigate]);
  return <Redirecting />;
}

/** /articles → /insights/articles (canonical URL migration) */
export function ArticlesRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("/insights/articles", { replace: true }); }, [navigate]);
  return <Redirecting />;
}

/** /blog/:slug → /insights/articles/:slug */
export function BlogRedirect() {
  const params = useParams();
  const [, navigate] = useLocation();
  useEffect(() => {
    if (params.slug) {
      navigate(`/insights/articles/${params.slug}`, { replace: true });
    } else {
      navigate("/insights/articles", { replace: true });
    }
  }, [navigate, params.slug]);
  return <Redirecting />;
}

/** /articles/:slug → /insights/articles/:slug (canonical URL migration) */
export function ArticleRedirect() {
  const params = useParams();
  const [, navigate] = useLocation();
  useEffect(() => {
    if (params.slug) {
      navigate(`/insights/articles/${params.slug}`, { replace: true });
    } else {
      navigate("/insights/articles", { replace: true });
    }
  }, [navigate, params.slug]);
  return <Redirecting />;
}
