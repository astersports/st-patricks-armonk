import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useReveal } from "@/hooks/useReveal";
import { Phone, Mail, Users, Cross, BookOpen, Heart } from "lucide-react";

interface StaffMember {
  name: string;
  role: string;
  phone?: string;
  email?: string;
}

interface DepartmentContact {
  department: string;
  phone?: string;
  email?: string;
}

const clergy: StaffMember[] = [
  { name: "Father Thadeus Aravindathu", role: "Pastor", phone: "(914) 531-1760", email: "Pastor.stpats@outlook.com" },
];

const staff: StaffMember[] = [
  { name: "Linda Maffia", role: "Office Manager", phone: "(914) 273-9724", email: "office@stpatrickinarmonk.org" },
  { name: "Sarah Aliotta", role: "Religious Education Coordinator", phone: "(914) 531-1759", email: "reled@stpatrickinarmonk.org" },
  { name: "Jo Golden", role: "1st & 2nd Grade Religious Ed Coordinator" },
  { name: "John Erickson", role: "Religious Ed Assistant", phone: "(914) 531-1760", email: "john.erickson@stpatrickinarmonk.org" },
  { name: "Maureen McNamara", role: "Bulletin Editor", phone: "(914) 531-1760", email: "bulletin.editor@stpatrickinarmonk.org" },
  { name: "John Failla", role: "Music Director", email: "MusicAtStPats@gmail.com" },
  { name: "Gwen Torre", role: "Teen Life Ministry Coordinator", email: "teenlife@stpatrickinarmonk.org" },
  { name: "Jetta Magrone", role: "Rectory Coordinator" },
  { name: "Tania DeLuca", role: "Bookkeeper", phone: "(914) 273-9724", email: "tania@stpatrickinarmonk.org" },
  { name: "Lori Schiliro", role: "Project Embrace", email: "projectembrace@parishmail.com" },
];

const leadership: StaffMember[] = [
  { name: "Charles Stafford", role: "Parish Council President", email: "ParishCouncilPresident@stpatrickinarmonk.org" },
  { name: "Colin McBride", role: "Trustee" },
  { name: "Maria Tedesco", role: "Trustee" },
  { name: "John Di Capua", role: "Finance Chairman" },
  { name: "Elaine Runne", role: "Parish Council Secretary", email: "ParishCouncilSecretary@stpatrickinarmonk.org" },
];

const ministryLeaders: StaffMember[] = [
  { name: "Ann Silvestri", role: "Lector Coordinator" },
  { name: "Joan Zaborowsky", role: "Extraordinary Minister of Holy Communion Coordinator" },
  { name: "Gwen Torre", role: "Altar Server Coordinator" },
  { name: "Vanessa Flores & Lina Kingston", role: "Food Pantry", email: "FoodPantry@stpatrickinarmonk.org" },
  { name: "Mike Corelli", role: "St. Francis Hall Scheduling", phone: "(914) 468-5938", email: "gym@stpatrickinarmonk.org" },
  { name: "Elvis Grgurovic", role: "CYO Basketball Coordinator", email: "gym@stpatrickinarmonk.org" },
  { name: "Kevin Mannix", role: "CYO Basketball Coordinator", email: "gym@stpatrickinarmonk.org" },
  { name: "Margaret Poppo & Tania DeLuca", role: "Walking with Purpose", phone: "(914) 273-9483" },
  { name: "Gina Shea", role: "Contemplative Prayer", phone: "(914) 767-9096", email: "ContemplativePrayer@stpatrickinarmonk.org" },
  { name: "Lori Schiliro", role: "Project Embrace", email: "projectembrace@parishmail.com" },
];

const emeritusStaff: StaffMember[] = [
  { name: "Sr. Mary Rose Golden", role: "Mentor Emeritus, R.I.P." },
  { name: "Sr. Barbara Heil", role: "Mentor, R.I.P." },
  { name: "Ann P. O'Sullivan", role: "Dir. of Religious Education, R.I.P." },
  { name: "Rev. Msgr. John J. Wallace", role: "Founding Pastor, R.I.P." },
  { name: "Rev. Thomas Tolentino", role: "Associate Pastor, R.I.P." },
  { name: "Rev. Msgr. Walter L. Schroeder", role: "Pastor, R.I.P." },
  { name: "Rev. Msgr. Daniel Brady", role: "Resident, R.I.P." },
  { name: "Rev. John F. Quinn", role: "Pastor, R.I.P." },
  { name: "Rev. John Christ", role: "In Memory of, R.I.P." },
];

const departmentContacts: DepartmentContact[] = [
  { department: "Parish Office", phone: "(914) 273-9724", email: "office@stpatrickinarmonk.org" },
  { department: "Pastor", phone: "(914) 531-1760", email: "Pastor.stpats@outlook.com" },
  { department: "Deacon", phone: "(914) 531-1760", email: "john.erickson@stpatrickinarmonk.org" },
  { department: "Religious Education", phone: "(914) 531-1759", email: "reled@stpatrickinarmonk.org" },
  { department: "Bulletin", phone: "(914) 531-1760", email: "bulletin.editor@stpatrickinarmonk.org" },
  { department: "Music Ministry", email: "MusicAtStPats@gmail.com" },
  { department: "Youth Ministry (Teen Life)", email: "teenlife@stpatrickinarmonk.org" },
  { department: "Parish Council", email: "ParishCouncilPresident@stpatrickinarmonk.org" },
  { department: "Food Pantry", email: "FoodPantry@stpatrickinarmonk.org" },
  { department: "St. Francis Hall / Gym", phone: "(914) 468-5938", email: "gym@stpatrickinarmonk.org" },
  { department: "Walking with Purpose", phone: "(914) 273-9483" },
  { department: "Contemplative Prayer", phone: "(914) 767-9096", email: "ContemplativePrayer@stpatrickinarmonk.org" },
  { department: "Project Embrace", email: "projectembrace@parishmail.com" },
];

function StaffRow({ member }: { member: StaffMember }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b border-border/50 last:border-b-0">
      <div className="flex items-center gap-3 min-w-0 sm:flex-1">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-primary font-serif font-bold text-xs">
            {member.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground">{member.name}</p>
          <p className="text-xs text-muted-foreground">{member.role}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 ml-11 sm:ml-0">
        {member.phone && (
          <a href={`tel:${member.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
            <Phone className="w-3 h-3" />
            {member.phone}
          </a>
        )}
        {member.email && (
          <a href={`mailto:${member.email}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
            <Mail className="w-3 h-3" />
            <span className="break-all">{member.email}</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default function Staff() {
  const revealRef = useReveal();

  return (
    <PageLayout>
      {/* Page Header */}
      <section className="relative py-10 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-gold font-medium tracking-widest uppercase text-xs sm:text-sm mb-2 sm:mb-3 animate-fade-in">Our Team</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 animate-fade-in">
              Staff & Directory
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground animate-fade-up">
              The dedicated people who serve our parish community every day.
            </p>
          </div>
        </div>
      </section>

      <div ref={revealRef}>
        <section className="container py-8 sm:py-12 md:py-16 max-w-4xl">
          <Accordion type="multiple" defaultValue={[]} className="space-y-3">
            {/* Clergy */}
            <AccordionItem value="clergy" className="reveal border rounded-lg px-4 sm:px-6 bg-card shadow-sm">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Cross className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-serif text-lg font-bold text-foreground">Clergy</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                {clergy.map((member) => (
                  <StaffRow key={member.name} member={member} />
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Parish Staff */}
            <AccordionItem value="staff" className="reveal border rounded-lg px-4 sm:px-6 bg-card shadow-sm">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-accent" />
                  </div>
                  <span className="font-serif text-lg font-bold text-foreground">Parish Staff</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{staff.length}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                {staff.map((member) => (
                  <StaffRow key={member.name} member={member} />
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Parish Leadership */}
            <AccordionItem value="leadership" className="reveal border rounded-lg px-4 sm:px-6 bg-card shadow-sm">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-serif text-lg font-bold text-foreground">Parish Leadership</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{leadership.length}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                {leadership.map((member) => (
                  <StaffRow key={member.name} member={member} />
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Ministry Leaders */}
            <AccordionItem value="ministry" className="reveal border rounded-lg px-4 sm:px-6 bg-card shadow-sm">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-gold" />
                  </div>
                  <span className="font-serif text-lg font-bold text-foreground">Ministry Leaders</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{ministryLeaders.length}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                {ministryLeaders.map((member, i) => (
                  <StaffRow key={`${member.name}-${i}`} member={member} />
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Emeritus Staff */}
            <AccordionItem value="emeritus" className="reveal border rounded-lg px-4 sm:px-6 bg-card shadow-sm">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="font-serif text-lg font-bold text-foreground">Emeritus Staff</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">In Memoriam</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-2">
                  {emeritusStaff.map((member) => (
                    <div key={member.name} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-b-0">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground italic">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Department Directory */}
            <AccordionItem value="directory" className="reveal border-2 border-primary/20 rounded-lg px-4 sm:px-6 bg-primary/5 shadow-sm">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-serif text-lg font-bold text-foreground">Department Directory</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-sm text-muted-foreground mb-4">Quick reference for all parish department contacts.</p>
                <div className="space-y-0">
                  {departmentContacts.map((dept) => (
                    <div key={dept.department} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b border-border/50 last:border-b-0">
                      <p className="font-medium text-sm text-foreground sm:w-48 shrink-0">{dept.department}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {dept.phone && (
                          <a href={`tel:${dept.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                            <Phone className="w-3 h-3" />
                            {dept.phone}
                          </a>
                        )}
                        {dept.email && (
                          <a href={`mailto:${dept.email}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                            <Mail className="w-3 h-3" />
                            <span className="break-all">{dept.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Office Hours Banner */}
          <div className="reveal mt-8">
            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-foreground">Office Hours</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <p className="text-sm text-muted-foreground">Monday – Thursday, 10:00 AM – 5:00 PM | Friday: Closed</p>
                  <a href="tel:9142739724" className="text-sm font-medium text-primary hover:underline sm:ml-auto">
                    (914) 273-9724
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
