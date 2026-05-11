import { useState } from 'react';
import { ArrowRight, MoreHorizontal, Mountain, Layers, TreePine, Building2, ScanLine, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LandingPageProps {
  onEnterPortal: () => void;
}

const EMPTY_QUOTE = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  projectType: '',
  timeline: '',
  location: '',
  description: '',
};

const services = [
  {
    icon: Layers,
    title: 'Geotechnical Investigation',
    description:
      'Comprehensive soil and rock mechanics analysis to inform foundation design and structural integrity for large-scale developments.',
  },
  {
    icon: Mountain,
    title: 'Geohazard & Slope Stability Assessment',
    description:
      'Rigorous evaluation of terrain vulnerabilities to mitigate risks associated with landslides, erosion, and seismic activity.',
  },
  {
    icon: Building2,
    title: 'Civil Infrastructure Studies',
    description:
      'Technical surveys and material testing supporting the design and construction of roads, bridges, and critical public works.',
  },
  {
    icon: TreePine,
    title: 'Environmental Assessment',
    description:
      'Detailed environmental impact studies and monitoring to ensure regulatory compliance and sustainable development practices.',
  },
  {
    icon: ScanLine,
    title: 'Geoscience & Mapping',
    description:
      'Advanced geospatial data collection and topographic mapping for precise site planning and resource evaluation.',
  },
];

const stats = [
  { value: '18+', label: 'ACTIVE PROJECTS' },
  { value: '47', label: 'TECHNICAL EXPERTS' },
  { value: '10+', label: 'YEARS OF FIELD EXPERIENCE' },
];

const featuredProjects = [
  {
    name: 'MRT-7 Geotechnical Investigation',
    client: 'DOTr, Quezon City',
    type: 'GEOTECHNICAL',
    progress: 65,
    typeColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Cebu South Road Slope Stability Assessment',
    client: 'DPWH Region 7',
    type: 'GEOHAZARD',
    progress: 40,
    typeColor: 'bg-pink-100 text-pink-700',
  },
  {
    name: 'Manila Bay Flood Assessment Study',
    client: 'MMDA',
    type: 'CIVIL',
    progress: 100,
    typeColor: 'bg-orange-100 text-orange-700',
  },
];

const clients = ['DPWH', 'DOTr', 'MMDA', 'Suntrust', 'CDC', 'GNPower'];

const navLinks = ['SERVICES', 'PROJECTS', 'ABOUT US', 'INSIGHTS'];

export function LandingPage({ onEnterPortal }: LandingPageProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(EMPTY_QUOTE);

  const setField = <K extends keyof typeof EMPTY_QUOTE>(key: K, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setQuoteOpen(false);
    setTimeout(() => { setSubmitted(false); setForm(EMPTY_QUOTE); }, 300);
  };
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="GSI Logo" width={34} height={34} className="object-contain" />
            <span className="font-bold text-slate-800 text-base">Geoinnovative Inc.</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item, i) => (
              <button
                key={item}
                className={`text-xs font-semibold tracking-widest transition-colors ${
                  i === 0
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold tracking-widest px-5 rounded-md"
              onClick={onEnterPortal}
            >
              LOGIN
            </Button>
            <Button
              className="bg-[#0f172a] hover:bg-slate-700 text-white text-xs font-bold tracking-widest px-5 rounded-md"
              onClick={() => setQuoteOpen(true)}
            >
              REQUEST QUOTE
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[520px] flex items-center overflow-hidden bg-[#0f172a]">
        {/* Full background image */}
        <img
          src="/hero.jpg"
          alt="Geotechnical site survey"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-[#0f172a]/70" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5 max-w-2xl">
            Precision Geotechnical &<br />Geoscience Solutions
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-md">
            Delivering accurate ground investigations, slope stability assessments,
            and environmental studies across the Philippines.
          </p>
          <div className="flex gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-widest px-6">
              OUR SERVICES
            </Button>
            <Button
              variant="outline"
              className="border-white/50 text-white bg-transparent hover:bg-white/10 text-xs font-bold tracking-widest px-6"
              onClick={onEnterPortal}
            >
              CONTACT US
            </Button>
          </div>
        </div>
      </section>

      {/* ── Core Capabilities ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">Core Capabilities</h2>
            <div className="w-10 h-1 bg-orange-500 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <Icon className="w-6 h-6 text-blue-600 mb-4" strokeWidth={1.5} />
                  <h3 className="font-bold text-slate-800 mb-2 text-sm">{service.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-slate-200 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-slate-200">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center px-8">
                <p className="text-5xl font-bold text-blue-600 mb-2">{stat.value}</p>
                <p className="text-[10px] font-bold tracking-[3px] text-slate-400 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Projects ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-2">Featured Projects</h2>
              <div className="w-10 h-1 bg-orange-500 rounded-full" />
            </div>
            <button className="flex items-center gap-1 text-xs font-bold tracking-widest text-blue-600 hover:underline">
              VIEW ALL PROJECTS <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredProjects.map((project) => (
              <div
                key={project.name}
                className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge className={`${project.typeColor} text-[9px] font-bold tracking-widest uppercase border-0 px-2 py-0.5`}>
                    {project.type}
                  </Badge>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-snug mb-1">{project.name}</h3>
                <p className="text-xs text-slate-500 mb-6">{project.client}</p>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1.5">
                    <span>Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trusted By ── */}
      <section className="py-14 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold tracking-[4px] text-slate-400 uppercase mb-8">
            TRUSTED BY INDUSTRY LEADERS
          </p>
          <div className="flex flex-wrap justify-center gap-10 items-center">
            {clients.map((client) => (
              <span key={client} className="text-slate-500 font-semibold text-sm tracking-wide">
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0f172a] py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start your project?
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Our team of licensed engineers and geoscientists is ready to assist with your
            next major development.
          </p>
          <Button
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs tracking-widest px-8 py-3"
            onClick={onEnterPortal}
          >
            REQUEST A PROPOSAL
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0f172a] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.png" alt="GSI Logo" width={26} height={26} className="object-contain" />
                <span className="font-bold text-white text-sm">Geoinnovative Inc.</span>
              </div>
              <p className="text-slate-500 text-xs mb-1">Precision Engineering & Land Development.</p>
              <p className="text-slate-500 text-xs">Manila, Philippines</p>
            </div>
            <div className="flex gap-16">
              <div className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Environmental Policy'].map((link) => (
                  <p key={link} className="text-slate-400 text-xs hover:text-white cursor-pointer transition-colors">
                    {link}
                  </p>
                ))}
              </div>
              <div className="space-y-3">
                {['Careers', 'Contact Support'].map((link) => (
                  <p key={link} className="text-slate-400 text-xs hover:text-white cursor-pointer transition-colors">
                    {link}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 text-center">
            <p className="text-slate-600 text-xs">
              © 2024 Geoinnovative Inc. Precision Engineering & Land Development. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ── Request a Quote Dialog ── */}
      <Dialog open={quoteOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="GSI" width={24} height={24} className="object-contain" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">Geoinnovative Inc.</p>
                <DialogTitle className="text-xl font-bold text-slate-800 leading-tight">Request a Quote</DialogTitle>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Tell us about your project requirements and our engineering team will get back to you with a detailed proposal within 48 business hours.
            </p>
          </DialogHeader>

          {submitted ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">Request Submitted!</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Thank you! Our team will review your inquiry and reach out within 48 business hours.
              </p>
              <Button className="mt-2 bg-blue-600 hover:bg-blue-700" onClick={handleClose}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="q-name">Full Name <span className="text-red-500">*</span></Label>
                  <Input id="q-name" value={form.fullName} onChange={e => setField('fullName', e.target.value)} placeholder="e.g. Robert Jensen" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="q-company">Company / Organization</Label>
                  <Input id="q-company" value={form.company} onChange={e => setField('company', e.target.value)} placeholder="e.g. Infrastructure Corp." />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="q-email">Email Address <span className="text-red-500">*</span></Label>
                  <Input id="q-email" type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="robert@example.com" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="q-phone">Phone Number</Label>
                  <Input id="q-phone" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+63 917 000 0000" />
                </div>
                <div className="space-y-1.5">
                  <Label>Project Type <span className="text-red-500">*</span></Label>
                  <Select value={form.projectType} onValueChange={v => setField('projectType', v)} required>
                    <SelectTrigger><SelectValue placeholder="Select project type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Geotechnical Investigation">Geotechnical Investigation</SelectItem>
                      <SelectItem value="Geohazard Assessment">Geohazard Assessment</SelectItem>
                      <SelectItem value="Civil Infrastructure Study">Civil Infrastructure Study</SelectItem>
                      <SelectItem value="Environmental Assessment">Environmental Assessment</SelectItem>
                      <SelectItem value="Geoscience & Mapping">Geoscience & Mapping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Estimated Timeline</Label>
                  <Select value={form.timeline} onValueChange={v => setField('timeline', v)}>
                    <SelectTrigger><SelectValue placeholder="Select timeline" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Less than 1 month">Less than 1 month</SelectItem>
                      <SelectItem value="1-3 months">1–3 months</SelectItem>
                      <SelectItem value="3-6 months">3–6 months</SelectItem>
                      <SelectItem value="6+ months">6+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="q-location">Project Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="q-location" value={form.location} onChange={e => setField('location', e.target.value)} placeholder="Enter site address or coordinates" className="pl-9" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="q-desc">Project Description / Message <span className="text-red-500">*</span></Label>
                <Textarea
                  id="q-desc"
                  value={form.description}
                  onChange={e => setField('description', e.target.value)}
                  placeholder="Please provide specific technical requirements, soil conditions (if known), and scope of work..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" className="text-slate-600 font-bold tracking-wide" onClick={handleClose}>
                  CANCEL
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide px-6">
                  SUBMIT REQUEST
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
