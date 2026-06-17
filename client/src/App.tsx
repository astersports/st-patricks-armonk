import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Suspense } from "react";
import { PageLoader } from "./components/PageLoader";
import { ParishAssistant } from "./components/ParishAssistant";

// Eager load: Home (most visited)
import Home from "./pages/Home";

// Lazy load: all other pages
import {
  MassTimes,
  NewsEvents,
  Bulletins,
  FaithFormation,
  Ministries,
  Giving,
  Contact,
  Unsubscribe,
  CcdRegistration,
  Volunteer,
  CcdUnsubscribe,
  Sacraments,
  AllCalendars,
  FormsDocuments,
  BaptismForm,
  SponsorForm,
  MarriageForm,
  FuneralForm,
  About,
  Staff,
  ParishRegistration,
  CcdPermissions,
  NewHere,
  PhotoGallery,
  Prayers,
  VolunteerNeeds,
  MyParish,
  SacramentProgress,
  HomilyArchive,
  AdminRouter,
} from "./lazyPages";

function Router() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
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
          <Route path="/teen-life"><Redirect to="/faith-formation" /></Route>
          <Route path="/ministries" component={Ministries} />
          <Route path="/gallery" component={PhotoGallery} />
          <Route path="/volunteer" component={Volunteer} />
        <Route path="/volunteer-needs" component={VolunteerNeeds} />
          <Route path="/my-parish" component={MyParish} />
          <Route path="/forms" component={FormsDocuments} />
          <Route path="/baptism-form" component={BaptismForm} />
          <Route path="/sponsor-form" component={SponsorForm} />
          <Route path="/marriage-form" component={MarriageForm} />
          <Route path="/funeral-form" component={FuneralForm} />
          <Route path="/sacrament-preparation" component={SacramentProgress} />
          <Route path="/homilies" component={HomilyArchive} />
          <Route path="/prayers" component={Prayers} />
          <Route path="/giving" component={Giving} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin" component={AdminRouter} nest />
          <Route path="/unsubscribe/:token" component={Unsubscribe} />
          <Route path="/ccd-unsubscribe" component={CcdUnsubscribe} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
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
          <ParishAssistant />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
