import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Droplets, Cross, Heart, Church, FileText, Download, ExternalLink } from "lucide-react";

function DocumentList({ category }: { category: string }) {
  const { data: docs, isLoading } = trpc.documents.byCategory.useQuery({ category });

  if (isLoading) return <div className="text-sm text-muted-foreground py-2">Loading documents...</div>;
  if (!docs || docs.length === 0) return null;

  return (
    <div className="mt-6">
      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" />
        Forms & Documents
      </h4>
      <div className="space-y-2">
        {docs.map((doc) => (
          <a
            key={doc.id}
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
          >
            <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
              {doc.description && <p className="text-xs text-muted-foreground truncate">{doc.description}</p>}
            </div>
            <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Sacraments() {
  return (
    <PageLayout>
      {/* Page Header */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 border-b border-primary/10">
        <div className="container max-w-5xl">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">Sacraments</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            The sacraments are encounters with Christ that transform our lives. Learn about each sacrament and how to prepare.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-5xl">
          <Tabs defaultValue="baptism" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-1 bg-muted/50 p-1">
              <TabsTrigger value="baptism" className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Droplets className="w-4 h-4" />
                <span className="hidden sm:inline">Baptism</span>
                <span className="sm:hidden text-xs">Baptism</span>
              </TabsTrigger>
              <TabsTrigger value="confirmation" className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Cross className="w-4 h-4" />
                <span className="hidden sm:inline">Confirmation</span>
                <span className="sm:hidden text-xs">Confirm.</span>
              </TabsTrigger>
              <TabsTrigger value="marriage" className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Marriage</span>
                <span className="sm:hidden text-xs">Marriage</span>
              </TabsTrigger>
              <TabsTrigger value="funeral" className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Church className="w-4 h-4" />
                <span className="hidden sm:inline">Funerals</span>
                <span className="sm:hidden text-xs">Funerals</span>
              </TabsTrigger>
            </TabsList>

            {/* BAPTISM */}
            <TabsContent value="baptism" className="mt-8">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl text-foreground">Baptism</h2>
                    <p className="text-sm text-muted-foreground">The gateway to life in the Spirit</p>
                  </div>
                </div>

                <div className="prose prose-green max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    Baptism is the first sacrament of initiation into the Catholic Church. Through Baptism, we are freed from sin and reborn as children of God. At St. Patrick's, we celebrate Baptisms on select Sundays after the 12:30 PM Mass.
                  </p>

                  <h3 className="font-serif text-lg text-foreground mt-6 mb-3">Requirements</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Parents must be registered parishioners of St. Patrick's Church</li>
                    <li>Parents must attend a Baptism preparation class (held monthly)</li>
                    <li>At least one godparent must be a confirmed, practicing Catholic</li>
                    <li>Complete the Baptismal Registration Form</li>
                    <li>Provide a copy of the child's birth certificate</li>
                  </ul>

                  <h3 className="font-serif text-lg text-foreground mt-6 mb-3">How to Schedule</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Contact the parish office at <a href="tel:9142739724" className="text-primary hover:underline">(914) 273-9724</a> to schedule your child's Baptism. Please call at least two months in advance to allow time for preparation.
                  </p>
                </div>

                <DocumentList category="baptism" />
              </Card>
            </TabsContent>

            {/* CONFIRMATION */}
            <TabsContent value="confirmation" className="mt-8">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Cross className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl text-foreground">Confirmation</h2>
                    <p className="text-sm text-muted-foreground">Sealed with the gift of the Holy Spirit</p>
                  </div>
                </div>

                <div className="prose prose-green max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    Confirmation completes the grace of Baptism and strengthens us to be witnesses of Christ. At St. Patrick's, Confirmation preparation is part of our 8th-grade CCD program, though older teens and adults may also prepare for this sacrament.
                  </p>

                  <h3 className="font-serif text-lg text-foreground mt-6 mb-3">Preparation Program</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Two-year preparation through CCD (7th and 8th grade)</li>
                    <li>Community service hours requirement</li>
                    <li>Selection of a Confirmation name (a saint's name)</li>
                    <li>Selection of a sponsor who is a confirmed, practicing Catholic</li>
                    <li>Retreat experience</li>
                    <li>Interview with a priest or deacon</li>
                  </ul>

                  <h3 className="font-serif text-lg text-foreground mt-6 mb-3">Important Dates</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Confirmation is typically celebrated in the spring. Specific dates and details are communicated through the CCD program. Check the <a href="/ccd-calendar" className="text-primary hover:underline">CCD Calendar</a> for the latest schedule.
                  </p>
                </div>

                <DocumentList category="confirmation" />
              </Card>
            </TabsContent>

            {/* MARRIAGE */}
            <TabsContent value="marriage" className="mt-8">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl text-foreground">Marriage</h2>
                    <p className="text-sm text-muted-foreground">A covenant of love and fidelity</p>
                  </div>
                </div>

                <div className="prose prose-green max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    The Sacrament of Marriage is a covenant between a man and a woman, blessed by God. St. Patrick's Church is a beautiful setting for your wedding celebration.
                  </p>

                  <h3 className="font-serif text-lg text-foreground mt-6 mb-3">For Parishioners</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Contact the parish office at least six months before your desired wedding date</li>
                    <li>Meet with the priest or deacon for marriage preparation</li>
                    <li>Complete the Pre-Cana or Engaged Encounter program</li>
                    <li>Provide baptismal certificates (issued within the last six months)</li>
                    <li>Obtain a civil marriage license</li>
                  </ul>

                  <h3 className="font-serif text-lg text-foreground mt-6 mb-3">For Non-Parishioners</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Non-parishioners may request to be married at St. Patrick's. Additional guidelines and fees apply. Please contact the parish office for details and availability.
                  </p>

                  <h3 className="font-serif text-lg text-foreground mt-6 mb-3">Contact</h3>
                  <p className="text-muted-foreground">
                    Call the parish office at <a href="tel:9142739724" className="text-primary hover:underline">(914) 273-9724</a> to begin your marriage preparation journey.
                  </p>
                </div>

                <DocumentList category="marriage" />
              </Card>
            </TabsContent>

            {/* FUNERALS */}
            <TabsContent value="funeral" className="mt-8">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Church className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl text-foreground">Funerals</h2>
                    <p className="text-sm text-muted-foreground">Commending our loved ones to God's mercy</p>
                  </div>
                </div>

                <div className="prose prose-green max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    The Church's funeral liturgy offers worship, praise, and thanksgiving to God for the gift of life. At St. Patrick's, we walk with families through their time of grief with compassion and prayer.
                  </p>

                  <h3 className="font-serif text-lg text-foreground mt-6 mb-3">Funeral Arrangements</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Contact the parish office as soon as possible after a death</li>
                    <li>The priest will meet with the family to plan the liturgy</li>
                    <li>Options include a Funeral Mass, memorial Mass, or graveside service</li>
                    <li>Music ministry is available for the liturgy</li>
                    <li>The parish bereavement ministry can assist with receptions</li>
                  </ul>

                  <h3 className="font-serif text-lg text-foreground mt-6 mb-3">Mass of Christian Burial</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The Mass of Christian Burial is the central liturgical celebration of the Christian funeral. It includes readings from Scripture, prayers of intercession, the Eucharist, and the final commendation. Family members are welcome to participate as readers or gift bearers.
                  </p>

                  <h3 className="font-serif text-lg text-foreground mt-6 mb-3">Pre-Planning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We encourage parishioners to pre-plan their funeral liturgy. The Funeral Preparation Form allows you to select readings, hymns, and other preferences in advance, easing the burden on your family during a difficult time.
                  </p>
                </div>

                <DocumentList category="funeral" />
              </Card>
            </TabsContent>
          </Tabs>

          {/* General Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-serif text-lg text-foreground mb-3">Reconciliation (Confession)</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                The Sacrament of Reconciliation is available every Saturday from 4:00 PM to 5:00 PM, or by appointment with a priest.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/mass-times">View Full Schedule</a>
              </Button>
            </Card>
            <Card className="p-6">
              <h3 className="font-serif text-lg text-foreground mb-3">Anointing of the Sick</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                If you or a loved one is seriously ill, hospitalized, or preparing for surgery, please contact the parish office to arrange for the Sacrament of the Anointing of the Sick.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/contact">Contact Parish Office</a>
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
