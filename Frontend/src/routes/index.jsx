import { createFileRoute, Link } from "@tanstack/react-router";
import { useSession } from "@/lib/session";
import { fmtDate } from "@/lib/format";
import { KpiTile } from "@/components/dashboard/kpi-tile";
import { Sparkline } from "@/components/dashboard/delivery-pulse-chart";
import { ActiveProjectsTable } from "@/components/dashboard/active-projects-table";
import { TeamPerformanceGrid } from "@/components/dashboard/team-performance-grid";
import { MilestoneTimeline } from "@/components/dashboard/milestone-timeline";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Hexagon,
  ArrowRight,
  ShieldCheck,
  Layers,
  UsersRound,
  FolderKanban,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: ({ data }) => ({
    meta: [
      { title: "NeuroForge Nexus — Enterprise SDLC Platform" },
      {
        name: "description",
        content: "Plan, ship, and operate software at scale from a single integrated cockpit.",
      },
    ],
  }),
  component: RootIndex,
});

function RootIndex() {
  const { user } = useSession();
  if (user) {
    return <Dashboard />;
  }
  return <LandingPage />;
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/30">
      {/* Navbar */}
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <Hexagon className="size-4" />
            </div>
            <span className="text-lg font-semibold text-foreground">NeuroForge Nexus</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-28 w-full">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl text-center mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-primary-soft text-primary border border-primary/20">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Enterprise-Grade Software Development Lifecycle Platform
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.08]">
              Enterprise SDLC Cockpit. <br />
              <span className="text-muted-foreground italic">Build at Scale.</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Plan sprints, track milestone deliveries, manage secure role-based directories, and
              trace build lifecycles in a single platform.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link to="/register">
                  Register Account <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign in to workspace</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating background blobs */}
        <div className="pointer-events-none absolute -left-20 top-20 size-[350px] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-40 size-[450px] rounded-full bg-primary/15 blur-3xl" />
      </section>

      {/* Features grid */}
      <section id="features" className="py-16 border-t border-border/30 bg-muted/20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center max-w-lg mx-auto mb-12">
            <h2 className="font-display text-3xl font-semibold">Comprehensive SDLC Integration</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Engineered to trace quality, compliance, and velocity across your software lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 italic">
            <FeatureCard
              icon={FolderKanban}
              title="Project Services"
              description="Coordinate delivery portfolios, status parameters, and lead allocations."
            />
            <FeatureCard
              icon={UsersRound}
              title="Team Directories"
              description="Define cross-functional units, assign leads, and configure user memberships."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="RBAC Security"
              description="Configure robust role maps (Admin, PM, Developer, Tester, DevOps) with Keycloak IAM."
            />
            <FeatureCard
              icon={Layers}
              title="Agile Sprints"
              description="Plan iterations, align milestones, and monitor velocity thresholds."
            />
          </div>
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section id="stack" className="py-16 border-t border-border/30">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                <Cpu className="size-3.5" /> High Performance Architecture
              </div>
              <h2 className="font-display text-4xl font-bold">Cutting-Edge Tech Stack</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                NeuroForge Nexus is architected on high-performance cloud frameworks to ensure
                sub-millisecond response latency and absolute data consistency.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StackTile label="Frontend" value="React / Vite" />
              <StackTile label="Backend" value="Java 25 / Spring Boot 4" />
              <StackTile label="Database" value="PostgreSQL / Neon" />
              <StackTile label="Security & IAM" value="Keycloak" />
              <StackTile label="Messaging" value="Apache Kafka" />
              <StackTile label="Uptime" value="99.99% Target" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 bg-muted/40">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Hexagon className="size-4 text-primary" />
            <span>© 2026 NeuroForge Nexus. All rights reserved.</span>
          </div>
          <div>Built with React, Java 25 & Spring Boot 4</div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-xl border border-border/40 bg-card p-6 space-y-4 hover:border-primary/25 transition-all">
      <div className="size-10 grid place-items-center rounded-lg bg-primary-soft text-primary">
        <Icon className="size-5" />
      </div>
      <h3 className="font-display font-semibold text-lg">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function StackTile({ label, value }) {
  return (
    <div className="rounded-lg border border-border/30 bg-muted/10 p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground mt-1">{value}</div>
    </div>
  );
}

function Dashboard() {
  const { user } = useSession();
  const [counts, setCounts] = useState({
    projects: 0,
    users: 0,
    teams: 0,
    milestones: 0,
    sprints: 0,
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [projRes, userRes, teamRes, milRes, sprRes] = await Promise.all([
          api.get("/api/projects?size=1"),
          api.get("/api/users?size=1"),
          api.get("/api/teams?size=1"),
          api.get("/api/milestones?size=1"),
          api.get("/api/sprints?size=1"),
        ]);
        setCounts({
          projects: projRes.totalElements || 0,
          users: userRes.totalElements || 0,
          teams: teamRes.totalElements || 0,
          milestones: milRes.totalElements || 0,
          sprints: sprRes.totalElements || 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      }
    };
    fetchCounts();
  }, []);

  const userFirstName = user && user.name ? user.name.split(" ")[0] : "Priya";

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Greeting strip */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Acme Corp · Platform Engineering
          </div>
          <h1 className="font-display text-4xl mt-1.5">
            {greeting}, <span className="italic">{userFirstName}</span>.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground tnum">
            {fmtDate(new Date(), "EEEE, d MMMM yyyy")}
          </p>
        </div>
        <QuickActions />
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <KpiTile
          index={0}
          label="Active projects"
          value={counts.projects}
          spark={<Sparkline data={[0, 1, 2, counts.projects]} />}
        />
        <KpiTile
          index={1}
          label="Users"
          value={counts.users}
          spark={<Sparkline data={[0, 1, 2, counts.users]} color="var(--color-chart-2)" />}
        />
        <KpiTile
          index={2}
          label="Teams"
          value={counts.teams}
          spark={<Sparkline data={[0, 1, 2, counts.teams]} color="var(--color-chart-3)" />}
        />
        <KpiTile
          index={3}
          label="Milestones"
          value={counts.milestones}
          spark={<Sparkline data={[0, 1, 2, counts.milestones]} color="var(--color-chart-4)" />}
        />
        <KpiTile
          index={4}
          label="Sprints"
          value={counts.sprints}
          spark={<Sparkline data={[0, 1, 2, counts.sprints]} color="var(--color-chart-5)" />}
        />
      </div>

      {/* Projects table */}
      <div className="grid grid-cols-1 gap-4">
        <ActiveProjectsTable />
      </div>

      {/* Team performance */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-semibold">Team performance</h2>
        </div>
        <TeamPerformanceGrid />
      </section>

      {/* Milestones timeline */}
      <div className="grid grid-cols-1 gap-4">
        <MilestoneTimeline />
      </div>

      <footer className="pt-6 pb-2 text-center text-[11px] text-muted-foreground">
        NeuroForge Nexus · v4.2.0 · region us-east-1
      </footer>
    </div>
  );
}
