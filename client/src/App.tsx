import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
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
// Old calendar pages removed - now redirected to /calendar with filters
import CcdRegistration from "./pages/CcdRegistration";
import Volunteer from "./pages/Volunteer";
import CcdUnsubscribe from "./pages/CcdUnsubscribe";
import Sacraments from "./pages/Sacraments";
import AllCalendars from "./pages/AllCalendars";
import TeenLife from "./pages/TeenLife";
import FormsDocuments from "./pages/FormsDocuments";
import BaptismForm from "./pages/BaptismForm";
import SponsorForm from "./pages/SponsorForm";
import MarriageForm from "./pages/MarriageForm";
import FuneralForm from "./pages/FuneralForm";
import About from "./pages/About";
import Staff from "./pages/Staff";
import ParishRegistration from "./pages/ParishRegistration";
import CcdPermissions from "./pages/CcdPermissions";
import NewHere from "./pages/NewHere";
// KeyDates is now integrated into AllCalendars page

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/staff" component={Staff} />
        <Route path="/parish-registration" component={ParishRegistration} />
        <Route path="/new-here" component={NewHere} />
        <Route path="/key-dates"><Redirect to="/calendar?filter=key-dates" /></Route>
        <Route path="/mass-times" component={MassTimes} />
        <Route path="/sacraments" component={Sacraments} />
        <Route path="/news" component={NewsEvents} />
        <Route path="/news-events"><Redirect to="/news" /></Route>
        <Route path="/bulletins" component={Bulletins} />
        <Route path="/calendar" component={AllCalendars} />
        <Route path="/parish-calendar"><Redirect to="/calendar?filter=parish" /></Route>
        <Route path="/faith-formation" component={FaithFormation} />
        <Route path="/ccd-calendar"><Redirect to="/calendar?filter=ccd" /></Route>
        <Route path="/ccd-registration" component={CcdRegistration} />
        <Route path="/ccd-permissions" component={CcdPermissions} />
        <Route path="/cyo-basketball"><Redirect to="/calendar?filter=cyo" /></Route>
        <Route path="/teen-life" component={TeenLife} />
        <Route path="/ministries" component={Ministries} />
        <Route path="/volunteer" component={Volunteer} />
        <Route path="/forms" component={FormsDocuments} />
        <Route path="/baptism-form" component={BaptismForm} />
        <Route path="/sponsor-form" component={SponsorForm} />
        <Route path="/marriage-form" component={MarriageForm} />
        <Route path="/funeral-form" component={FuneralForm} />
        <Route path="/giving" component={Giving} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin" component={Admin} />
        <Route path="/unsubscribe/:token" component={Unsubscribe} />
        <Route path="/ccd-unsubscribe" component={CcdUnsubscribe} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
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
