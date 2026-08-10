import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

import { Shell } from '@/components/layout/Shell';
import Home from '@/pages/home';
import Solutions from '@/pages/solutions';
import Individuals from '@/pages/solutions/individuals';
import Businesses from '@/pages/solutions/businesses';
import Organizations from '@/pages/solutions/organizations';
import Guides from '@/pages/guides';
import Insights from '@/pages/insights';
import Articles from '@/pages/articles';
import ArticleDetail from '@/pages/article-detail';
import About from '@/pages/about';
import Contact from '@/pages/contact';
import Legal from '@/pages/legal';
import Privacy from '@/pages/privacy';
import OrderSuccess from '@/pages/order-success';
import OrderCancel from '@/pages/order-cancel';
import { HowItWorksRedirect, OnboardingRedirect, ShopRedirect, BlogRedirect } from '@/pages/redirects';

const queryClient = new QueryClient();

function Router() {
  return (
    <Shell>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={Home} />
          
          <Route path="/solutions" component={Solutions} />
          <Route path="/solutions/individuals" component={Individuals} />
          <Route path="/solutions/businesses" component={Businesses} />
          <Route path="/solutions/organizations" component={Organizations} />
          
          <Route path="/guides" component={Guides} />
          <Route path="/insights" component={Insights} />
          
          <Route path="/articles" component={Articles} />
          <Route path="/articles/:slug" component={ArticleDetail} />
          <Route path="/insights/articles" component={Articles} />
          
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/legal" component={Legal} />
          <Route path="/privacy" component={Privacy} />
          
          <Route path="/order-success" component={OrderSuccess} />
          <Route path="/order-cancel" component={OrderCancel} />
          
          {/* Redirects */}
          <Route path="/how-it-works" component={HowItWorksRedirect} />
          <Route path="/onboarding" component={OnboardingRedirect} />
          <Route path="/shop" component={ShopRedirect} />
          <Route path="/blog/:slug" component={BlogRedirect} />

          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </Shell>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
