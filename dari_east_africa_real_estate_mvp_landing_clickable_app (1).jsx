import React, { useMemo, useState } from "react";

// ---------------------------------------------
// DARI — East Africa Real Estate MVP (Single-file React prototype)
// Includes: Landing page + Clickable App prototype
// Tech: React + TailwindCSS (no backend)
// Notes: This is a front-end prototype for market testing.
// You can replace mock data below and adjust brand colors in the CONFIG.
// ---------------------------------------------

// ====== CONFIG ======
const BRAND = {
  name: "Dari",
  // Premium palette: deep black + off-white base + gold accent
  colors: {
    primary: "#0B0B0C", // near-black
    background: "#F6F5F3", // warm off-white
    accent: "#C4A46B", // premium gold
    muted: "#8A8A8A",
  },
  cities: ["Nairobi", "Kigali", "Kampala"],
  categories: ["Apartments", "Houses", "Land", "Commercial"],
};

// ====== MOCK DATA ======
const MOCK_LISTINGS = [
  {
    id: "NAI-APT-001",
    title: "2BR Modern Apartment - Kileleshwa",
    city: "Nairobi",
    country: "Kenya",
    type: "Apartments",
    status: "Rent",
    priceUSD: 900,
    localPrice: "KES 120,000/mo",
    beds: 2,
    baths: 2,
    size: "110 sqm",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505692794403-34d4982f88aa?q=80&w=1600&auto=format&fit=crop",
    ],
    agent: { name: "Amani Estates", phone: "+254700000000", verified: true },
    features: ["Backup power", "Parking", "Gym", "Elevator"],
  },
  {
    id: "KGL-HSE-002",
    title: "3BR Townhouse - Kibagabaga",
    city: "Kigali",
    country: "Rwanda",
    type: "Houses",
    status: "Buy",
    priceUSD: 185000,
    localPrice: "RWF 240,000,000",
    beds: 3,
    baths: 3,
    size: "260 sqm",
    images: [
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1600&auto=format&fit=crop",
    ],
    agent: { name: "Kwetu Developers", phone: "+250788000000", verified: true },
    features: ["Title verified", "Garden", "City view"],
  },
  {
    id: "KLA-LND-003",
    title: "Half-Acre Plot - Kira",
    city: "Kampala",
    country: "Uganda",
    type: "Land",
    status: "Buy",
    priceUSD: 42000,
    localPrice: "UGX 160,000,000",
    beds: 0,
    baths: 0,
    size: "0.50 acre",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
    ],
    agent: { name: "Pearl Land Co.", phone: "+256770000000", verified: false },
    features: ["Ready for development", "Access road"],
  },
  {
    id: "NAI-COM-004",
    title: "Retail Space - Westlands (120 sqm)",
    city: "Nairobi",
    country: "Kenya",
    type: "Commercial",
    status: "Rent",
    priceUSD: 1600,
    localPrice: "KES 220,000/mo",
    beds: 0,
    baths: 1,
    size: "120 sqm",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop",
    ],
    agent: { name: "Arcadia Realtors", phone: "+254711111111", verified: true },
    features: ["High foot traffic", "Parking", "Security"],
  },
];

// ====== UTILS ======
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function WhatsAppLink(phone, text) {
  const encoded = encodeURIComponent(text || "Hello, I'm interested in your listing on Dari.");
  const clean = (phone || "").replace(/\s|\(|\)|-/g, "");
  return `https://wa.me/${clean.replace(/^\+/, "")}?text=${encoded}`;
}

// ====== SHARED UI ======
const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-[var(--accent)] px-3 py-1 text-xs tracking-wide" style={{
    // use CSS vars for brand colors so Tailwind + inline works nicely
    //@ts-ignore
    '--accent': BRAND.colors.accent,
  }}>
    {children}
  </span>
);

const Pill = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={cx(
      "rounded-full px-4 py-2 text-sm transition",
      active
        ? "bg-black text-white"
        : "bg-white text-black border border-black/10 hover:border-black/30"
    )}
  >
    {children}
  </button>
);

const CTAButton = ({ children, onClick, variant = "primary" }) => {
  const base = "px-5 py-3 rounded-2xl text-sm font-medium transition";
  const styles = {
    primary: "bg-black text-white hover:opacity-90",
    ghost: "bg-transparent text-black border border-black hover:bg-black hover:text-white",
  };
  return (
    <button onClick={onClick} className={cx(base, styles[variant])}>{children}</button>
  );
};

const SectionTitle = ({ kicker, title, right }) => (
  <div className="mb-6 flex items-end justify-between">
    <div>
      <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">{kicker}</div>
      <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
    </div>
    {right}
  </div>
);

const NavBar = ({ onNavigate, active }) => (
  <nav
    className="sticky top-0 z-20 border-b border-black/10 backdrop-blur bg-[var(--bg)]/85"
    style={{ '--bg': BRAND.colors.background }}
  >
    <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl" style={{ background: BRAND.colors.accent }} />
        <span className="text-lg font-semibold" style={{ color: BRAND.colors.primary }}>{BRAND.name}</span>
      </div>
      <div className="hidden md:flex items-center gap-2">
        {['Landing','App'].map((tab) => (
          <Pill key={tab} active={active===tab} onClick={() => onNavigate(tab)}>{tab}</Pill>
        ))}
      </div>
    </div>
  </nav>
);

// ====== LANDING PAGE ======
function Landing({ onStart, onList }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-[var(--bg)] min-h-screen" style={{ '--bg': BRAND.colors.background }}>
      <div className="mx-auto max-w-6xl px-4">
        {/* Hero */}
        <section className="pt-12 pb-10 md:pt-20 md:pb-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <Badge>East Africa Focus</Badge>
              <Badge>Verified Listings</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Find, rent, or sell property—
              <span className="block">built for Nairobi, Kigali & Kampala.</span>
            </h1>
            <p className="mt-4 text-neutral-700 max-w-prose">
              {BRAND.name} makes property search simple. Browse rentals and homes for sale, connect with verified agents & developers, and book viewings—fast.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <CTAButton onClick={onStart}>Browse Properties</CTAButton>
              <CTAButton variant="ghost" onClick={onList}>List a Property</CTAButton>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm text-neutral-600">
              <span>Featured cities:</span>
              {BRAND.cities.map((c) => (
                <span key={c} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: BRAND.colors.accent }} />
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl border border-black/10">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop"
                alt="City living"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden md:block">
              <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-lg w-72">
                <div className="text-xs uppercase tracking-widest text-neutral-500">How it works</div>
                <ul className="mt-2 text-sm space-y-2">
                  <li>• Search rentals & properties for sale</li>
                  <li>• Contact via WhatsApp or email</li>
                  <li>• Book a viewing in one click</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Featured listings */}
        <section className="py-8 md:py-12">
          <SectionTitle kicker="Featured" title="A quick look at what’s on Dari" right={<button className="text-sm underline" onClick={onStart}>See all</button>} />
          <ListingGrid listings={MOCK_LISTINGS.slice(0,3)} />
        </section>

        {/* Email capture */}
        <section className="py-10 md:py-16">
          <div className="rounded-3xl border border-black/10 bg-white p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold">Get early access</h3>
              <p className="text-neutral-700 max-w-prose">Join the waitlist for launch updates and early listings in Nairobi, Kigali, and Kampala.</p>
            </div>
            <div className="flex w-full md:w-auto items-center gap-3">
              <input
                placeholder="you@email.com"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full md:w-72 rounded-xl border border-black/20 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />
              <CTAButton onClick={()=>setSubmitted(true)}>Notify me</CTAButton>
            </div>
          </div>
          {submitted && (
            <div className="mt-3 text-sm text-green-700">Thanks! You’re on the list. (Prototype only — no email sent.)</div>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
}

// ====== APP (CLICKABLE) ======
function AppPrototype() {
  const [tab, setTab] = useState("Rent");
  const [city, setCity] = useState("All");
  const [type, setType] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showListModal, setShowListModal] = useState(false);

  const listings = useMemo(() => {
    return MOCK_LISTINGS.filter((l) => {
      const statusMatch = tab === "All" ? true : l.status === tab;
      const cityMatch = city === "All" ? true : l.city === city;
      const typeMatch = type === "All" ? true : l.type === type;
      return statusMatch && cityMatch && typeMatch;
    });
  }, [tab, city, type]);

  return (
    <div className="bg-[var(--bg)] min-h-screen" style={{ '--bg': BRAND.colors.background }}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Browse properties</h1>
            <p className="text-neutral-700">Search by status, city, and type. Click a card to see details.</p>
          </div>
          <div className="flex items-center gap-3">
            <CTAButton onClick={()=>setShowListModal(true)}>List a Property</CTAButton>
            <CTAButton variant="ghost" onClick={()=>alert('This would open an agent sign-up flow.')}>For Agents</CTAButton>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {['All','Rent','Buy'].map((t) => (
            <Pill key={t} active={tab===t} onClick={()=>setTab(t)}>{t}</Pill>
          ))}
          <div className="h-6 w-px bg-black/20 mx-1" />
          <Dropdown label="City" value={city} onChange={setCity} options={["All", ...BRAND.cities]} />
          <Dropdown label="Type" value={type} onChange={setType} options={["All", ...BRAND.categories]} />
        </div>

        {/* Results */}
        <div className="mt-6">
          {listings.length === 0 ? (
            <div className="rounded-xl border border-black/10 bg-white p-8 text-center text-neutral-600">
              No listings match your filters yet.
            </div>
          ) : (
            <ListingGrid listings={listings} onClick={(l)=>setSelected(l)} />
          )}
        </div>
      </div>

      {/* Modals */}
      {selected && <ListingModal item={selected} onClose={()=>setSelected(null)} />}
      {showListModal && <ListPropertyModal onClose={()=>setShowListModal(false)} />}
    </div>
  );
}

// ====== COMPONENTS ======
function Dropdown({ label, value, onChange, options }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-neutral-600">{label}</span>
      <select
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="rounded-xl border border-black/20 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}

function ListingGrid({ listings, onClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {listings.map((l) => (
        <ListingCard key={l.id} item={l} onClick={onClick} />
      ))}
    </div>
  );
}

function ListingCard({ item, onClick }) {
  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-3xl border border-black/10 bg-white transition hover:shadow-xl"
      onClick={() => onClick && onClick(item)}
    >
      <div className="aspect-video w-full overflow-hidden">
        <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
      </div>
      <div className="p-5 space-y-2">
        <div className="flex items-center justify-between">
          <Badge>{item.status}</Badge>
          {item.agent?.verified && <span className="text-xs text-green-700">Verified</span>}
        </div>
        <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
        <div className="text-sm text-neutral-600">{item.city}, {item.country}</div>
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm">
            <div className="font-semibold">${item.priceUSD.toLocaleString()} {item.status === 'Rent' ? '/mo' : ''}</div>
            <div className="text-neutral-600">{item.localPrice}</div>
          </div>
          <div className="text-xs text-neutral-600">{item.size}</div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 py-2 text-sm">
      <span className="text-neutral-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ListingModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-black/10 bg-white" onClick={(e)=>e.stopPropagation()}>
        <div className="grid md:grid-cols-2">
          <div className="h-64 md:h-full overflow-hidden">
            <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <button onClick={onClose} className="rounded-full border px-3 py-1 text-sm">Close</button>
            </div>
            <div className="text-sm text-neutral-600">{item.city}, {item.country}</div>
            <div className="mt-3">
              <InfoRow label="Price" value={`$${item.priceUSD.toLocaleString()}${item.status==='Rent' ? '/mo' : ''} • ${item.localPrice}`} />
              <InfoRow label="Type" value={`${item.type} (${item.status})`} />
              <InfoRow label="Size" value={item.size} />
              <InfoRow label="Bedrooms" value={item.beds} />
              <InfoRow label="Bathrooms" value={item.baths} />
            </div>
            <div className="mt-4">
              <div className="text-sm text-neutral-600">Features</div>
              <div className="mt-1 flex flex-wrap gap-2">
                {item.features.map((f) => (
                  <span key={f} className="rounded-full border border-black/10 px-3 py-1 text-xs">{f}</span>
                ))}
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-black/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-600">Agent</div>
                  <div className="font-medium">{item.agent?.name} {item.agent?.verified && <span className="ml-1 text-xs text-green-700">(Verified)</span>}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-xl border border-black/20 px-3 py-2 text-sm hover:bg-black hover:text-white"
                    onClick={() => window.open(WhatsAppLink(item.agent?.phone, `Hi ${item.agent?.name}, I'm interested in ${item.title} on Dari.`), '_blank')}
                  >
                    WhatsApp
                  </button>
                  <button
                    className="rounded-xl border border-black/20 px-3 py-2 text-sm hover:bg-black hover:text-white"
                    onClick={() => alert('This would open an email form in a real app.')}
                  >
                    Email
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button className="rounded-xl bg-black px-4 py-2 text-sm text-white" onClick={()=>alert('This would open a calendar in a real app.')}>Book a viewing</button>
              <button className="rounded-xl border border-black/20 px-4 py-2 text-sm" onClick={()=>alert('Saved! (Prototype only)')}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListPropertyModal({ onClose }) {
  const [form, setForm] = useState({
    status: "Rent",
    city: BRAND.cities[0],
    type: BRAND.categories[0],
    title: "",
    priceUSD: "",
    contact: "",
  });

  return (
    <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-black/10 bg-white" onClick={(e)=>e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">List a Property</h3>
            <button onClick={onClose} className="rounded-full border px-3 py-1 text-sm">Close</button>
          </div>
          <p className="mt-1 text-sm text-neutral-700">Prototype form to capture interest from owners, agents & developers.</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="text-neutral-600">Status</span>
              <select value={form.status} onChange={(e)=>setForm({...form, status:e.target.value})} className="mt-1 w-full rounded-xl border border-black/20 px-3 py-2">
                <option>Rent</option>
                <option>Buy</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="text-neutral-600">City</span>
              <select value={form.city} onChange={(e)=>setForm({...form, city:e.target.value})} className="mt-1 w-full rounded-xl border border-black/20 px-3 py-2">
                {BRAND.cities.map(c=> <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="text-sm">
              <span className="text-neutral-600">Type</span>
              <select value={form.type} onChange={(e)=>setForm({...form, type:e.target.value})} className="mt-1 w-full rounded-xl border border-black/20 px-3 py-2">
                {BRAND.categories.map(c=> <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="text-sm md:col-span-2">
              <span className="text-neutral-600">Title</span>
              <input value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} placeholder="e.g., 2BR Apartment in Kileleshwa" className="mt-1 w-full rounded-xl border border-black/20 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="text-neutral-600">Price (USD)</span>
              <input value={form.priceUSD} onChange={(e)=>setForm({...form, priceUSD:e.target.value})} placeholder="e.g., 900" className="mt-1 w-full rounded-xl border border-black/20 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="text-neutral-600">WhatsApp / Phone</span>
              <input value={form.contact} onChange={(e)=>setForm({...form, contact:e.target.value})} placeholder="e.g., +2547…" className="mt-1 w-full rounded-xl border border-black/20 px-3 py-2" />
            </label>
          </div>
          <div className="mt-5 flex items-center justify-end gap-3">
            <button className="rounded-xl border border-black/20 px-4 py-2 text-sm" onClick={onClose}>Cancel</button>
            <button className="rounded-xl bg-black px-4 py-2 text-sm text-white" onClick={()=>{ alert('Submitted! In production, this would POST to your backend / Airtable / Google Sheet.'); onClose(); }}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-12 text-sm text-neutral-600">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6">
        <div>
          <div className="text-base font-semibold" style={{ color: BRAND.colors.primary }}>{BRAND.name}</div>
          <p className="mt-2 max-w-xs">Property search and listing platform for East Africa. Built for speed, trust, and WhatsApp-first communication.</p>
        </div>
        <div>
          <div className="text-neutral-800 font-medium">Cities</div>
          <ul className="mt-2 space-y-1">
            {BRAND.cities.map(c => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <div>
          <div className="text-neutral-800 font-medium">Legal</div>
          <ul className="mt-2 space-y-1">
            <li>Terms</li>
            <li>Privacy</li>
            <li>Fraud & Safety</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 mt-8 border-t border-black/10 pt-6 flex items-center justify-between">
        <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
        <span className="text-xs">Prototype UI — no data is stored.</span>
      </div>
    </footer>
  );
}

// ====== ROOT (NAV BETWEEN LANDING / APP) ======
export default function DariPrototype() {
  const [route, setRoute] = useState("Landing");
  const [listOpen, setListOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ color: BRAND.colors.primary }}>
      <style>{`
        :root {
          --brand: ${BRAND.colors.primary};
          --accent: ${BRAND.colors.accent};
          --bg: ${BRAND.colors.background};
        }
        body { background: var(--bg); }
      `}</style>
      <NavBar active={route} onNavigate={(tab)=>setRoute(tab)} />
      {route === "Landing" ? (
        <Landing onStart={()=>setRoute("App")} onList={()=>setListOpen(true)} />
      ) : (
        <AppPrototype />
      )}

      {listOpen && <ListPropertyModal onClose={()=>setListOpen(false)} />}
    </div>
  );
}
