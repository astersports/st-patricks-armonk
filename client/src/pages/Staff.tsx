import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useReveal } from "@/hooks/useReveal";
import { Phone, Mail, Users } from "lucide-react";

interface StaffMember {
  name: string;
  role: string;
  phone?: string;
  email?: string;
  category: "clergy" | "staff" | "leadership";
}

const staffMembers: StaffMember[] = [
  // Clergy
  { name: "Father Thadeus Aravindathu", role: "Pastor", phone: "(914) 531-1760", category: "clergy" },
  // Staff
  { name: "Linda Maffia", role: "Office Manager", phone: "(914) 273-9724", category: "staff" },
  { name: "Sarah Aliotta", role: "Religious Education Coordinator", phone: "(914) 531-1759", category: "staff" },
  { name: "Jo Golden", role: "1st & 2nd Grade Religious Ed Coordinator", category: "staff" },
  { name: "John Erickson", role: "Religious Ed Assistant", phone: "(914) 531-1760", category: "staff" },
  { name: "Maureen McNamara", role: "Bulletin Editor", phone: "(914) 531-1760", category: "staff" },
  { name: "John Failla", role: "Music Director", category: "staff" },
  { name: "Gwen Torre", role: "Teen Life Ministry Coordinator", category: "staff" },
  { name: "Jetta Magrone", role: "Rectory Coordinator", category: "staff" },
  { name: "Tania DeLuca", role: "Bookkeeper", phone: "(914) 273-9724", category: "staff" },
  { name: "Lori Schiliro", role: "Project Embrace", category: "staff" },
  // Leadership
  { name: "Charles Stafford", role: "Parish Council President", category: "leadership" },
  { name: "Colin McBride", role: "Trustee", category: "leadership" },
  { name: "Maria Tedesco", role: "Trustee", category: "leadership" },
  { name: "John Di Capua", role: "Finance Committee Chairman", category: "leadership" },
  { name: "Elaine Runne", role: "Parish Council Secretary", category: "leadership" },
];

function StaffCard({ member }: { member: StaffMember }) {
  return (
    <Card className="hover-glow transition-all duration-200">
      <CardContent className="p-3 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-serif font-bold text-sm sm:text-lg">
              {member.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">{member.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{member.role}</p>
            {member.phone && (
              <a
                href={`tel:${member.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-2"
              >
                <Phone className="w-3.5 h-3.5" />
                {member.phone}
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Staff() {
  const revealRef = useReveal();

  const clergy = staffMembers.filter(m => m.category === "clergy");
  const staff = staffMembers.filter(m => m.category === "staff");
  const leadership = staffMembers.filter(m => m.category === "leadership");

  return (
    <PageLayout>
      {/* Page Header */}
      <section className="relative py-10 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-gold font-medium tracking-widest uppercase text-xs sm:text-sm mb-2 sm:mb-3 animate-fade-in">Our Team</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 animate-fade-in">
              Staff & Leadership
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground animate-fade-up">
              The dedicated people who serve our parish community every day.
            </p>
          </div>
        </div>
      </section>

      <div ref={revealRef}>
        <section className="container py-8 sm:py-12 md:py-16">
          {/* Pastor */}
          <div className="reveal mb-8 sm:mb-12">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="font-serif text-2xl font-bold text-foreground">Pastor</h2>
            </div>
            <div className="max-w-md">
              <Card className="border-t-4 border-t-primary shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-serif font-bold text-xl">Fr</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{clergy[0].name}</h3>
                      <p className="text-muted-foreground">{clergy[0].role}</p>
                      {clergy[0].phone && (
                        <a
                          href={`tel:${clergy[0].phone.replace(/[^\d+]/g, "")}`}
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-2"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {clergy[0].phone}
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Parish Staff */}
          <div className="reveal mb-8 sm:mb-12">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-1 h-5 sm:h-6 bg-accent rounded-full" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">Parish Staff</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {staff.map((member) => (
                <StaffCard key={member.name} member={member} />
              ))}
            </div>
          </div>

          {/* Parish Leadership */}
          <div className="reveal">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-1 h-5 sm:h-6 bg-primary rounded-full" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">Parish Leadership</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {leadership.map((member) => (
                <StaffCard key={member.name} member={member} />
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="reveal mt-12">
            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Parish Office</p>
                      <a href="tel:9142739724" className="font-semibold text-foreground hover:text-primary">(914) 273-9724</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Religious Education</p>
                      <a href="tel:9145311759" className="font-semibold text-foreground hover:text-primary">(914) 531-1759</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Office Hours</p>
                      <p className="font-semibold text-foreground">Mon–Thu, 10am–5pm</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
