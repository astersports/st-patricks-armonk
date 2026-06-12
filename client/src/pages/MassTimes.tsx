import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Church, Cross } from "lucide-react";

export default function MassTimes() {
  return (
    <PageLayout>
      {/* Page Header */}
      <section className="bg-gradient-to-b from-primary/5 to-transparent py-16">
        <div className="container">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">Mass Times & Confession</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Join us in worship and prayer. All are welcome at St. Patrick Church.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekend Masses */}
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Church className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="font-serif text-2xl">Weekend Masses</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg">Saturday Vigil</h3>
                  <p className="text-2xl font-bold text-primary mt-1">5:30 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg">Sunday</h3>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="text-xl font-bold text-primary bg-primary/5 px-3 py-1 rounded-md">8:30 AM</span>
                    <span className="text-xl font-bold text-primary bg-primary/5 px-3 py-1 rounded-md">10:30 AM</span>
                    <span className="text-xl font-bold text-primary bg-primary/5 px-3 py-1 rounded-md">12:30 PM</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">12:30 PM Mass: October 5 – June</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekday Masses */}
          <Card className="border-t-4 border-t-accent">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <CardTitle className="font-serif text-2xl">Weekday Masses</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                <div key={day} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <span className="font-medium">{day}</span>
                  <span className="text-lg font-bold text-accent">8:30 AM</span>
                </div>
              ))}
              <p className="text-sm text-muted-foreground italic pt-2">
                No scheduled weekday Mass on Mondays.
              </p>
            </CardContent>
          </Card>

          {/* Confession */}
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Cross className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="font-serif text-2xl">Confession</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-secondary/50">
                <h3 className="font-semibold text-lg mb-2">Saturday</h3>
                <p className="text-2xl font-bold text-primary">4:30 PM – 5:15 PM</p>
                <p className="text-sm text-muted-foreground mt-2">Also available by appointment.</p>
              </div>
            </CardContent>
          </Card>

          {/* Holy Days */}
          <Card className="border-t-4 border-t-accent">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <Church className="w-5 h-5 text-accent" />
                </div>
                <CardTitle className="font-serif text-2xl">Holy Days of Obligation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Mass times for Holy Days of Obligation are announced in the weekly bulletin and on the News & Events page. 
                Please check back for upcoming Holy Day schedules.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
