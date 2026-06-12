import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MassTimes from "./pages/MassTimes";
import NewsEvents from "./pages/NewsEvents";
import Bulletins from "./pages/Bulletins";
import FaithFormation from "./pages/FaithFormation";
import Ministries from "./pages/Ministries";
import Giving from "./pages/Giving";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Unsubscribe from "./pages/Unsubscribe";
import CcdCalendar from "./pages/CcdCalendar";
import CyoBasketball from "./pages/CyoBasketball";
import CcdRegistration from "./pages/CcdRegistration";
import Volunteer from "./pages/Volunteer";
import CcdUnsubscribe from "./pages/CcdUnsubscribe";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/mass-times" component={MassTimes} />
      <Route path="/news-events" component={NewsEvents} />
      <Route path="/bulletins" component={Bulletins} />
      <Route path="/faith-formation" component={FaithFormation} />
      <Route path="/ccd-calendar" component={CcdCalendar} />
      <Route path="/ccd-registration" component={CcdRegistration} />
      <Route path="/cyo-basketball" component={CyoBasketball} />
      <Route path="/ministries" component={Ministries} />
      <Route path="/volunteer" component={Volunteer} />
      <Route path="/giving" component={Giving} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route path="/unsubscribe/:token" component={Unsubscribe} />
      <Route path="/ccd-unsubscribe" component={CcdUnsubscribe} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
