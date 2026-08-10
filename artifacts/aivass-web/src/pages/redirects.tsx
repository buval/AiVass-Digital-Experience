import { useEffect } from "react";
import { useLocation, useParams } from "wouter";

export function HowItWorksRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("/solutions/individuals", { replace: true }); }, [navigate]);
  return <div className="min-h-screen bg-cream flex items-center justify-center font-serif text-navy">Redirecting...</div>;
}

export function OnboardingRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("/contact", { replace: true }); }, [navigate]);
  return <div className="min-h-screen bg-cream flex items-center justify-center font-serif text-navy">Redirecting...</div>;
}

export function ShopRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("/guides", { replace: true }); }, [navigate]);
  return <div className="min-h-screen bg-cream flex items-center justify-center font-serif text-navy">Redirecting...</div>;
}

export function BlogRedirect() {
  const params = useParams();
  const [, navigate] = useLocation();
  useEffect(() => { 
    if (params.slug) {
      navigate(`/articles/${params.slug}`, { replace: true }); 
    } else {
      navigate("/articles", { replace: true }); 
    }
  }, [navigate, params.slug]);
  return <div className="min-h-screen bg-cream flex items-center justify-center font-serif text-navy">Redirecting...</div>;
}
