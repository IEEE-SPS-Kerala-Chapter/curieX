import { useEffect, useRef, useState } from 'react';
import CuriexLogo from './components/CuriexLogo.jsx';
import RegisterModal from './components/RegisterModal.jsx';
import MobileNavDrawer from './components/MobileNavDrawer.jsx';

const SPS_LOGO_ONLINE = 'https://www.ieeespskc.in/img/logo/sps%20kc%20png.png';

const PILLARS = [
  {
    num: 'I',
    title: 'Learn from Experts',
    body: 'Interactive keynotes and technical masterclasses led by pioneering women researchers, IEEE SPS distinguished voices, and industry DSP architects.',
    tag: 'Keynotes & Fireside Dialogues',
  },
  {
    num: 'II',
    title: 'Explore New Technologies',
    body: 'Dive hands-on into biomedical signal filtering, audio & speech ML, radar/RF sensing, and real-time embedded DSP pipelines.',
    tag: 'Guided Technical Labs',
  },
  {
    num: 'III',
    title: 'Connect with Peers',
    body: 'Build an enduring sisterhood in tech through curated networking circles, mentorship roundtables, and cross-campus peer cohorts.',
    tag: 'WISP Community Circles',
  },
  {
    num: 'IV',
    title: 'Work on Practical Ideas',
    body: 'Form multidisciplinary teams during the Buildathon to tackle real-world problem statements and present functional solutions to our jury.',
    tag: 'Day 2 Buildathon Sprint',
  },
];

const SCHEDULE_DAYS = {
  day1: {
    id: 'day1',
    label: 'DAY 01',
    sub: 'Signals, Workshops & Peer Circles',
    items: [
      {
        time: '09:00 AM',
        title: 'Inauguration & WISP Opening Keynote',
        desc: 'Welcome address by IEEE SPS Kerala Chapter & WISP leadership, setting the stage for women in signal processing.',
      },
      {
        time: '10:30 AM',
        title: 'Signal Processing Deep-Dive Masterclass',
        desc: 'Spectral analysis, adaptive filtering, and modern AI-assisted signal representation with real industrial case studies.',
      },
      {
        time: '01:30 PM',
        title: 'Hands-On DSP & Edge AI Workshop',
        desc: 'Guided lab building live audio, biomedical, and sensor feature extraction pipelines using Python and embedded toolkits.',
      },
      {
        time: '03:45 PM',
        title: 'Fireside Chat & Peer Networking Circle',
        desc: 'Candid conversations on research careers, fellowships, and cross-college collaboration across Kerala.',
      },
      {
        time: '05:00 PM',
        title: 'Problem Statement Reveal & Team Formation',
        desc: 'Unveiling of the four Buildathon arenas, mentor pairing, and team matchmaking before Day 2 sprint kickoff.',
      },
    ],
  },
  day2: {
    id: 'day2',
    label: 'DAY 02',
    sub: 'The Curie X Buildathon & Grand Pitch',
    items: [
      {
        time: '08:30 AM',
        title: 'Buildathon Kickoff & Architecture Sprint',
        desc: 'Teams lock in their selected challenge, map signal acquisition or dataset strategies, and begin rapid prototyping.',
      },
      {
        time: '11:30 AM',
        title: 'Mentor Checkpoints & DSP Tuning',
        desc: 'One-on-one technical reviews with domain mentors to validate SNR performance, algorithm feasibility, and edge constraints.',
      },
      {
        time: '02:30 PM',
        title: 'Integration & Working Prototype Freeze',
        desc: 'Teams finalize demos, prepare visual signal plots, and refine real-world impact narratives.',
      },
      {
        time: '03:30 PM',
        title: 'Final Signal Demos & Jury Evaluation',
        desc: 'Live hardware/software demonstrations before an expert jury of IEEE SPS academics and industry engineers.',
      },
      {
        time: '05:30 PM',
        title: 'Valedictory & Queen’s Crown Recognition',
        desc: 'Announcement of Buildathon winners, special jury honors, and closing reflections from WISP Kerala.',
      },
    ],
  },
};

const RUBRIC_ITEMS = [
  {
    label: 'Signal Processing Depth',
    pct: '30%',
    num: 30,
    code: 'DSP-01',
    detail: 'Evaluates spectral analysis, noise suppression, feature extraction rigor, and algorithmic fidelity.',
  },
  {
    label: 'Innovation & Originality',
    pct: '30%',
    num: 30,
    code: 'INV-02',
    detail: 'Rewards creative problem framing, novel sensor/signal combinations, and non-trivial engineering.',
  },
  {
    label: 'Practical Viability',
    pct: '25%',
    num: 25,
    code: 'IMP-03',
    detail: 'Measures real-world deployability, latency constraints, and human impact for target communities.',
  },
  {
    label: 'Live Demo & Pitch',
    pct: '15%',
    num: 15,
    code: 'PIT-04',
    detail: 'Judges clarity of live signal visualization, working prototype demonstration, and Q&A defense.',
  },
];

const CHECKER_MESSAGES = {
  solo: 'Register individually—you will be matched into a balanced 3–4 member squad during the Day 1 Team Formation Mixer.',
  team: 'Teams of 3–4 women can register with a shared Team Name and select their problem arena together.',
  beginner: 'No prior mastery needed—Day 1 guided labs and starter Python kits prepare you before the Buildathon begins.',
};

const TRACKS = [
  {
    id: 'biomed',
    code: 'TRACK 01',
    title: 'Assistive & Biomedical Signals',
    body: 'Design wearable vital-sign motion-artifact removal, non-invasive EEG/EMG gesture interfaces, or maternal health signal analytics.',
    tag: 'ECG / EEG / PPG',
  },
  {
    id: 'acoustic',
    code: 'TRACK 02',
    title: 'Acoustic & Speech Intelligence',
    body: 'Build noise-resilient emergency keyword detection, real-time assistive hearing enhancement, or regional low-resource speech processing.',
    tag: 'Audio DSP & ML',
  },
  {
    id: 'iot',
    code: 'TRACK 03',
    title: 'Smart Sensing & Edge IoT',
    body: 'Engineer structural vibration anomaly detectors, environmental sensor-fusion nodes, or ultra-low-power safety telemetry systems.',
    tag: 'Sensor Fusion',
  },
  {
    id: 'vision',
    code: 'TRACK 04',
    title: 'Open Innovation in DSP & Vision',
    body: 'Tackle real-time image restoration, medical scan denoising, or millimeter-wave radar human-activity sensing.',
    tag: 'Imaging & RF',
  },
];

const FAQS = [
  {
    q: 'Who is eligible to participate in Curie X?',
    a: 'Curie X is a women-only program open to women undergraduate and postgraduate students, researchers, and early-career engineers passionate about Signal Processing, technology, and hands-on innovation.',
    defaultOpen: true,
  },
  {
    q: 'Do I need to form a team before registering?',
    a: 'No! You can register individually or with an existing team of 3–4 women. Solo participants will be matched into balanced interdisciplinary teams during Day 1’s Team Formation session.',
  },
  {
    q: 'What level of Signal Processing experience is required?',
    a: 'All skill levels are welcome. Day 1 features foundational masterclasses and guided hands-on workshops designed to equip every participant before the Day 2 Buildathon begins.',
  },
  {
    q: 'What should participants bring for the Buildathon?',
    a: 'Bring your laptop, charger, college or IEEE membership ID, and curiosity. Sample datasets, starter DSP notebooks, and mentor support will be provided on-site.',
  },
  {
    q: 'Do I need to be an IEEE member to attend?',
    a: 'Both IEEE / IEEE Signal Processing Society members and non-members are welcome to apply. IEEE SPS members receive priority verification during seat confirmation.',
  },
];

export default function App() {
  const registerModalRef = useRef(null);
  const mobileDrawerRef = useRef(null);
  const buildathonBannerRef = useRef(null);
  const tabRefs = useRef([]);

  const [activeDay, setActiveDay] = useState('day1');
  const [checkerMode, setCheckerMode] = useState('solo');
  const [activeRubricIdx, setActiveRubricIdx] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Interactive spotlight pointer coordinates on the Buildathon banner
  useEffect(() => {
    const container = buildathonBannerRef.current;
    if (!container) return undefined;

    let rect = container.getBoundingClientRect();
    const resizeObserver = new ResizeObserver(() => {
      rect = container.getBoundingClientRect();
    });
    resizeObserver.observe(container);

    const handlePointerMove = (e) => {
      if (rect.width <= 0 || rect.height <= 0) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      container.style.setProperty('--mouse-x', `${x}%`);
      container.style.setProperty('--mouse-y', `${y}%`);
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  // Fallback for browsers without native <details name> exclusive accordion support
  useEffect(() => {
    if (Object.hasOwn(HTMLDetailsElement.prototype, 'name')) return undefined;
    const handleToggle = (event) => {
      const details = event.target;
      if (!(details instanceof HTMLDetailsElement) || !details.open || !details.hasAttribute('name')) {
        return;
      }
      const name = CSS.escape(details.getAttribute('name'));
      for (const other of document.querySelectorAll(`details[name="${name}"]`)) {
        if (other !== details) other.open = false;
      }
    };
    document.addEventListener('toggle', handleToggle, { capture: true });
    return () => document.removeEventListener('toggle', handleToggle, { capture: true });
  }, []);

  // IntersectionObserver fallback for browsers lacking CSS scroll-driven view() timelines
  useEffect(() => {
    const supportsScrollDriven =
      typeof CSS !== 'undefined' &&
      CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = document.querySelectorAll('.reveal-card');

    if (supportsScrollDriven || prefersReduced) {
      cards.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -24px 0px' }
    );

    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const openRegistration = () => {
    registerModalRef.current?.open();
  };

  const openMobileDrawer = () => {
    mobileDrawerRef.current?.open();
  };

  const handleTabKeyDown = (event, index) => {
    const dayKeys = ['day1', 'day2'];
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const dir = event.key === 'ArrowRight' ? 1 : -1;
      const nextIdx = (index + dir + dayKeys.length) % dayKeys.length;
      setActiveDay(dayKeys[nextIdx]);
      tabRefs.current[nextIdx]?.focus();
    }
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {/* SINGLE-TIER ARCHITECTURAL EDITORIAL NAVBAR */}
      <header className="site-header">
        <div className="container nav-inner">
          <div className="nav-brand-cluster">
            <a href="#hero" className="brand-link" aria-label="CURIEX Home">
              <CuriexLogo variant="nav" />
            </a>
            <span className="nav-hairline" aria-hidden="true"></span>
            <a
              href="https://signalprocessingsociety.org/community-involvement/women-signal-processing"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-wisp-logo"
              aria-label="IEEE SPS Kerala Chapter WISP — Women in Signal Processing"
            >
              <img
                src="/assets/logos/wisp-kerala.png"
                alt="IEEE SPS Kerala Chapter WISP — Women in Signal Processing"
                width="92"
                height="43"
              />
            </a>
          </div>

          <nav className="primary-nav" aria-label="Primary">
            <ul className="nav-list">
              <li><a href="#about">Overview</a></li>
              <li><a href="#pillars">Pillars</a></li>
              <li><a href="#schedule">Itinerary</a></li>
              <li><a href="#buildathon">Buildathon</a></li>
              <li><a href="#tracks">Tracks</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li className="nav-ext-item">
                <a
                  href="https://www.ieeespskc.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-ext-link"
                >
                  <span>SPS Kerala</span>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </li>
              <li className="nav-ext-item">
                <a
                  href="https://signalprocessingsociety.org/community-involvement/women-signal-processing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-ext-link"
                >
                  <span>WISP</span>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <a
              href="https://www.ieeespskc.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-sps-logo"
              aria-label="IEEE Signal Processing Society Kerala Chapter Website"
            >
              <img
                src={SPS_LOGO_ONLINE}
                alt="IEEE Signal Processing Society Kerala Chapter"
                width="68"
                height="46"
                onError={(e) => {
                  e.currentTarget.src = '/assets/logos/ieee-sps-kerala.png';
                }}
              />
            </a>

            <span className="nav-hairline nav-hairline--actions" aria-hidden="true"></span>

            <button
              type="button"
              className="nav-register-btn"
              id="open-register-btn"
              onClick={openRegistration}
            >
              <span className="nav-register-btn__gem" aria-hidden="true"></span>
              <span>Register Now</span>
              <svg className="nav-register-btn__arrow" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8H13M9.5 4.5L13 8L9.5 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              className="mobile-menu-btn"
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              onClick={openMobileDrawer}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 7H20M4 12H20M4 17H14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* HERO SECTION */}
        <section id="hero" className="hero" aria-labelledby="hero-title">
          <svg className="perspective-grid" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
            <line x1="80" y1="0" x2="170" y2="900" stroke="#7F122D" strokeWidth="1.2" opacity="0.55" />
            <line x1="1360" y1="0" x2="1270" y2="900" stroke="#7F122D" strokeWidth="1.2" opacity="0.55" />
            <line x1="0" y1="240" x2="1440" y2="335" stroke="#7F122D" strokeWidth="1.2" opacity="0.5" />
            <line x1="0" y1="735" x2="1440" y2="635" stroke="#7F122D" strokeWidth="1.2" opacity="0.5" />
            <line x1="210" y1="0" x2="210" y2="900" stroke="#65162B" strokeWidth="0.75" opacity="0.3" />
            <line x1="1230" y1="0" x2="1230" y2="900" stroke="#65162B" strokeWidth="0.75" opacity="0.3" />
          </svg>

          <div className="hero-statue-layer" aria-hidden="true">
            <img
              src="/assets/hero-statue.png"
              alt=""
              className="hero-statue-img"
              width="1200"
              height="675"
              fetchPriority="high"
            />
            <div className="hero-vignette"></div>
          </div>

          <div className="container hero-content">
            <div className="hero-wordmark-wrap hero-stagger" style={{ '--stagger': 1 }}>
              <CuriexLogo variant="hero" />
            </div>

            <div className="headline-orbit-stage hero-stagger" style={{ '--stagger': 2 }}>
              <svg className="orbital-rings" viewBox="0 0 820 340" aria-hidden="true">
                <ellipse
                  cx="410"
                  cy="170"
                  rx="370"
                  ry="124"
                  transform="rotate(-11 410 170)"
                  fill="none"
                  stroke="#B3928D"
                  strokeWidth="1"
                  opacity="0.52"
                />
                <ellipse
                  cx="410"
                  cy="170"
                  rx="382"
                  ry="132"
                  transform="rotate(-11 410 170)"
                  fill="none"
                  stroke="#603D41"
                  strokeWidth="0.9"
                  opacity="0.7"
                />
              </svg>

              <svg className="asterisk-emblem" viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
                <g fill="#B3928D">
                  <ellipse cx="32" cy="16" rx="5" ry="13" />
                  <ellipse cx="32" cy="16" rx="5" ry="13" transform="rotate(60 32 32)" />
                  <ellipse cx="32" cy="16" rx="5" ry="13" transform="rotate(120 32 32)" />
                  <ellipse cx="32" cy="16" rx="5" ry="13" transform="rotate(180 32 32)" />
                  <ellipse cx="32" cy="16" rx="5" ry="13" transform="rotate(240 32 32)" />
                  <ellipse cx="32" cy="16" rx="5" ry="13" transform="rotate(300 32 32)" />
                </g>
              </svg>

              <h1 id="hero-title" className="hero-display">
                <span className="hero-display__line">WHERE SIGNALS</span>
                <span className="hero-display__line">SPARK STRATEGY.</span>
              </h1>
            </div>

            <div className="hero-divider hero-stagger" style={{ '--stagger': 3 }} aria-hidden="true"></div>

            <p className="hero-tagline hero-stagger" style={{ '--stagger': 3 }}>
              BORN FROM CURIOSITY. BUILT FOR WHAT’S NEXT.
            </p>

            <p className="hero-lead hero-stagger" style={{ '--stagger': 4 }}>
              A two-day, women-only program curated by{' '}
              <a href="https://www.ieeespskc.in/" target="_blank" rel="noopener noreferrer" className="inline-link">
                IEEE Signal Processing Society Kerala Chapter
              </a>{' '}
              (WISP). Learn directly from domain experts, explore emerging Signal Processing technologies, connect with peers, and collaborate in teams to build working prototypes in our culminating Buildathon.
            </p>

            <div className="hero-actions hero-stagger" style={{ '--stagger': 5 }}>
              <button
                type="button"
                className="btn btn--primary"
                id="hero-register-btn"
                onClick={openRegistration}
              >
                Register Your Spot
              </button>
              <a href="#buildathon" className="btn btn--secondary">
                Explore the Buildathon
              </a>
            </div>
          </div>
        </section>

        {/* ABOUT & MANIFESTO */}
        <section id="about" className="section section--about" aria-labelledby="about-heading">
          <div className="container">
            <div className="editorial-split">
              <div className="editorial-lead reveal-card">
                <p className="eyebrow">01 / THE VISION</p>
                <h2 id="about-heading" className="section-title">
                  Curiosity Meets Tactical Precision.
                </h2>
                <p className="lead-copy">
                  Named in tribute to scientific trailblazer Marie Curie and anchored by the Queen’s crown in our emblem,{' '}
                  <strong>CURIΣX</strong> empowers women technologists, researchers, and engineers across Kerala and beyond to take command of the signal processing frontier.
                </p>
                <p className="body-copy">
                  Every modern breakthrough—from wearable diagnostics and assistive speech AI to radar sensing and edge intelligence—begins with decoding raw signals. Over two focused days, participants step out of passive lectures into active mentorship, experimental labs, and high-stakes collaborative engineering.
                </p>
              </div>

              <aside className="editorial-manifesto reveal-card" aria-label="Program Highlights">
                <div className="manifesto-frame">
                  <p className="manifesto-quote">
                    “Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.”
                  </p>
                  <p className="manifesto-attribution">— Marie Skłodowska-Curie</p>
                  <dl className="metrics-grid">
                    <div className="metric-item">
                      <dt>Duration</dt>
                      <dd>2 Days</dd>
                    </div>
                    <div className="metric-item">
                      <dt>Cohort</dt>
                      <dd>100% Women-Only</dd>
                    </div>
                    <div className="metric-item">
                      <dt>Sessions</dt>
                      <dd>4+ Keynotes &amp; Labs</dd>
                    </div>
                    <div className="metric-item">
                      <dt>Culmination</dt>
                      <dd>12-Hr Buildathon</dd>
                    </div>
                  </dl>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* FOUR CORE PILLARS (SUBGRID) */}
        <section id="pillars" className="section section--pillars" aria-labelledby="pillars-heading">
          <div className="container">
            <header className="section-header">
              <p className="eyebrow">02 / FOUR PILLARS OF CURIΣX</p>
              <h2 id="pillars-heading" className="section-title">
                From Deep Theory to Working Solutions
              </h2>
              <p className="section-subtitle">
                Designed as an end-to-end journey from foundational signal mastery to live prototyping.
              </p>
            </header>

            <div className="pillars-grid">
              {PILLARS.map((pillar, idx) => (
                <article
                  key={pillar.num}
                  className="pillar-card reveal-card"
                  style={{ '--card-idx': idx }}
                >
                  <header className="pillar-card__head">
                    <span className="pillar-num">{pillar.num}</span>
                    <h3>{pillar.title}</h3>
                  </header>
                  <p className="pillar-card__body">{pillar.body}</p>
                  <footer className="pillar-card__foot">
                    <span className="pillar-tag">{pillar.tag}</span>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TWO-DAY SCHEDULE TABS */}
        <section id="schedule" className="section section--schedule" aria-labelledby="schedule-heading">
          <div className="container">
            <header className="section-header">
              <p className="eyebrow">03 / TWO-DAY ITINERARY</p>
              <h2 id="schedule-heading" className="section-title">
                Designed for Discovery &amp; Execution
              </h2>
            </header>

            <div className="schedule-tabs-wrapper">
              <div className="tablist" role="tablist" aria-label="Program days">
                {(['day1', 'day2']).map((dayKey, index) => {
                  const day = SCHEDULE_DAYS[dayKey];
                  const selected = activeDay === dayKey;
                  return (
                    <button
                      key={dayKey}
                      ref={(el) => {
                        tabRefs.current[index] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`tab-${dayKey}`}
                      aria-selected={selected}
                      aria-controls={`panel-${dayKey}`}
                      tabIndex={selected ? 0 : -1}
                      className={`tab-btn ${selected ? 'is-active' : ''}`}
                      onClick={() => setActiveDay(dayKey)}
                      onKeyDown={(e) => handleTabKeyDown(e, index)}
                    >
                      <span className="tab-day">{day.label}</span>
                      <span className="tab-sub">{day.sub}</span>
                    </button>
                  );
                })}
              </div>

              {(['day1', 'day2']).map((dayKey) => {
                const day = SCHEDULE_DAYS[dayKey];
                const isSelected = activeDay === dayKey;
                return (
                  <div
                    key={`${dayKey}-${isSelected ? 'active' : 'idle'}`}
                    id={`panel-${dayKey}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${dayKey}`}
                    className={`tab-panel ${isSelected ? 'panel-enter' : ''}`}
                    hidden={!isSelected}
                  >
                    <ol className="timeline-list">
                      {day.items.map((item) => (
                        <li key={item.time} className="timeline-item">
                          <span className="timeline-time">{item.time}</span>
                          <div className="timeline-content">
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BUILDATHON SHOWCASE */}
        <section id="buildathon" className="section section--buildathon" aria-labelledby="buildathon-heading">
          <div className="container">
            <div className="buildathon-banner-wrap">
              <div ref={buildathonBannerRef} className="buildathon-banner reveal-card">
                <div className="buildathon-reveal-layer" aria-hidden="true">
                  <svg className="buildathon-lattice-svg" viewBox="0 0 1100 380" preserveAspectRatio="none">
                    <defs>
                      <pattern id="buildathon-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                        <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(184, 138, 59, 0.34)" strokeWidth="0.7" />
                      </pattern>
                    </defs>
                    <rect width="1100" height="380" fill="url(#buildathon-grid)" />
                    <path
                      d="M0 245 Q 140 165, 280 245 T 560 245 T 840 245 T 1100 245"
                      fill="none"
                      stroke="#B88A3B"
                      strokeWidth="1.4"
                      opacity="0.75"
                    />
                  </svg>
                </div>

                <svg
                  className="buildathon-ambient-wave"
                  viewBox="0 0 1200 110"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    className="ambient-wave-path ambient-wave-path--primary"
                    d="M0 55 C 75 15, 150 95, 225 55 S 375 15, 450 55 S 600 95, 675 55 S 825 15, 900 55 S 1050 95, 1125 55 S 1275 15, 1350 55"
                    fill="none"
                    stroke="rgba(184, 138, 59, 0.28)"
                    strokeWidth="1.5"
                  />
                  <path
                    className="ambient-wave-path ambient-wave-path--secondary"
                    d="M0 55 C 60 88, 120 22, 180 55 S 300 88, 360 55 S 480 22, 540 55 S 660 88, 720 55 S 840 22, 900 55 S 1020 88, 1080 55 S 1200 22, 1260 55"
                    fill="none"
                    stroke="rgba(127, 18, 45, 0.42)"
                    strokeWidth="1.2"
                  />
                </svg>

                <div className="buildathon-crown-stage" aria-hidden="true">
                  <div className="crown-aura"></div>
                  <svg className="crown-orbit crown-orbit--outer" viewBox="0 0 140 140" width="136" height="136">
                    <circle
                      cx="70"
                      cy="70"
                      r="62"
                      fill="none"
                      stroke="rgba(184, 138, 59, 0.52)"
                      strokeWidth="1"
                      strokeDasharray="6 6"
                    />
                    <circle cx="70" cy="8" r="2.8" fill="#B88A3B" />
                  </svg>
                  <svg className="crown-orbit crown-orbit--inner" viewBox="0 0 140 140" width="136" height="136">
                    <circle
                      cx="70"
                      cy="70"
                      r="49"
                      fill="none"
                      stroke="rgba(127, 18, 45, 0.72)"
                      strokeWidth="1.2"
                      strokeDasharray="24 14 8 14"
                    />
                  </svg>
                  <div className="buildathon-crown">
                    <svg viewBox="0 0 64 96" width="60" height="90">
                      <defs>
                        <linearGradient id="crownGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C3B3AD" />
                          <stop offset="45%" stopColor="#B88A3B" />
                          <stop offset="100%" stopColor="#603D41" />
                        </linearGradient>
                      </defs>
                      <circle cx="32" cy="10" r="5" fill="url(#crownGoldGrad)" />
                      <path d="M10 18L19 33L26 15L32 33L38 15L45 33L54 18L47 42H17L10 18Z" fill="url(#crownGoldGrad)" />
                      <rect x="15" y="44" width="34" height="5" rx="2" fill="url(#crownGoldGrad)" />
                      <path d="M20 51C22 65 17 77 10 86H54C47 77 42 65 44 51H20Z" fill="url(#crownGoldGrad)" />
                      <rect x="7" y="88" width="50" height="7" rx="3" fill="url(#crownGoldGrad)" />
                    </svg>
                  </div>
                </div>

                <div className="buildathon-intro">
                  <div className="buildathon-eyebrow-row">
                    <p className="eyebrow eyebrow--gold">04 / THE ENDGAME — CULMINATING BUILDATHON</p>
                    <span className="sprint-status-badge">
                      <span className="live-beacon" aria-hidden="true"></span>
                      <span>12-HOUR PROTOTYPE SPRINT</span>
                    </span>
                  </div>
                  <h2 id="buildathon-heading" className="section-title">
                    Form Teams. Decode Problems. Build What’s Next.
                  </h2>
                  <p className="lead-copy">
                    The climax of Curie X is an intensive practical Buildathon where participants form teams of{' '}
                    <strong>3 to 4 women</strong>, receive curated real-world challenges, and engineer working prototypes guided by IEEE SPS mentors.
                  </p>
                  <div className="buildathon-highlights">
                    <div className="highlight-pill">Teams of 3–4 Participants</div>
                    <div className="highlight-pill">Individual Matchmaking Available</div>
                    <div className="highlight-pill">Live Hardware &amp; Software Tracks</div>
                    <div className="highlight-pill highlight-pill--gold">Grand Crown Awards &amp; Mentorship</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rubric-grid">
              <div className="rubric-card reveal-card">
                <div className="rubric-card__head">
                  <h3>Judging Rubric</h3>
                  <span className="rubric-weight-badge">100 PTS TOTAL</span>
                </div>
                <ul className="rubric-list">
                  {RUBRIC_ITEMS.map((item, idx) => {
                    const isActive = activeRubricIdx === idx;
                    return (
                      <li key={item.code}>
                        <button
                          type="button"
                          className={`rubric-item ${isActive ? 'is-active' : ''}`}
                          onMouseEnter={() => setActiveRubricIdx(idx)}
                          onFocus={() => setActiveRubricIdx(idx)}
                          onClick={() => setActiveRubricIdx(idx)}
                          aria-pressed={isActive}
                        >
                          <div className="rubric-row">
                            <span className="rubric-item__label">
                              <span className="rubric-item__code">{item.code}</span>
                              {item.label}
                            </span>
                            <strong className="rubric-item__pct">{item.pct}</strong>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div key={activeRubricIdx} className="rubric-spotlight-box panel-enter" aria-live="polite">
                  <div className="rubric-spotlight-meta">
                    <span className="rubric-spotlight-code">{RUBRIC_ITEMS[activeRubricIdx].code}</span>
                    <span className="rubric-spotlight-pct">{RUBRIC_ITEMS[activeRubricIdx].pct} WEIGHT</span>
                  </div>
                  <p className="rubric-spotlight-desc">{RUBRIC_ITEMS[activeRubricIdx].detail}</p>
                </div>
              </div>

              <div className="rubric-card reveal-card">
                <div className="rubric-card__head">
                  <h3>Team &amp; Eligibility Check</h3>
                </div>
                <p className="body-copy">Not sure if you need a team beforehand? Check your readiness:</p>
                <div className="checker-controls" role="group" aria-label="Team status check">
                  {[
                    { id: 'solo', label: 'Joining Solo' },
                    { id: 'team', label: 'Bringing a Team' },
                    { id: 'beginner', label: 'New to DSP' },
                  ].map((option) => {
                    const isSelected = checkerMode === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`chip ${isSelected ? 'is-active' : ''}`}
                        onClick={() => setCheckerMode(option.id)}
                      >
                        {isSelected && <span className="chip-beacon" aria-hidden="true"></span>}
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div key={checkerMode} className="checker-stage panel-enter" aria-live="polite">
                  <p className="checker-output">{CHECKER_MESSAGES[checkerMode]}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BUILDATHON PROBLEM TRACKS (SUBGRID) */}
        <section id="tracks" className="section section--tracks" aria-labelledby="tracks-heading">
          <div className="container">
            <header className="section-header">
              <p className="eyebrow">05 / BUILDATHON PROBLEM ARENAS</p>
              <h2 id="tracks-heading" className="section-title">
                Four Domains of Signal Innovation
              </h2>
            </header>

            <div className="tracks-grid">
              {TRACKS.map((track, idx) => (
                <article
                  key={track.id}
                  className="track-card reveal-card"
                  style={{ '--card-idx': idx }}
                >
                  <header className="track-card__head">
                    <span className="track-code">{track.code}</span>
                    <h3>{track.title}</h3>
                  </header>
                  <p className="track-card__body">{track.body}</p>
                  <footer className="track-card__foot">
                    <span className="track-tag">{track.tag}</span>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section id="faq" className="section section--faq" aria-labelledby="faq-heading">
          <div className="container faq-container">
            <header className="section-header">
              <p className="eyebrow">06 / FREQUENTLY ASKED QUESTIONS</p>
              <h2 id="faq-heading" className="section-title">
                Everything You Need to Know
              </h2>
            </header>

            <div className="faq-list">
              {FAQS.map((item) => (
                <details key={item.q} name="curiex-faq" open={item.defaultOpen}>
                  <summary>
                    <span>{item.q}</span>
                    <svg className="faq-chevron" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path className="faq-bar-h" d="M3.5 9H14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path className="faq-bar-v" d="M9 3.5V14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </summary>
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logos">
                <a href="https://www.ieeespskc.in/" target="_blank" rel="noopener noreferrer" aria-label="IEEE SPS Kerala Chapter">
                  <img
                    src={SPS_LOGO_ONLINE}
                    alt="IEEE Signal Processing Society Kerala Chapter"
                    width="88"
                    height="60"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/logos/ieee-sps-kerala.png';
                    }}
                  />
                </a>
                <a
                  href="https://signalprocessingsociety.org/community-involvement/women-signal-processing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-wisp-logo"
                  aria-label="IEEE SPS Kerala Chapter WISP — Women in Signal Processing"
                >
                  <img
                    src="/assets/logos/wisp-kerala.png"
                    alt="IEEE SPS Kerala Chapter WISP — Women in Signal Processing"
                    width="96"
                    height="45"
                  />
                </a>
              </div>
              <p className="footer-tagline">BORN FROM CURIOSITY. BUILT FOR WHAT’S NEXT.</p>
              <p className="footer-org">
                Organized by{' '}
                <a href="https://www.ieeespskc.in/" target="_blank" rel="noopener noreferrer" className="inline-link">
                  IEEE Signal Processing Society Kerala Chapter
                </a>{' '}
                &amp;{' '}
                <a
                  href="https://signalprocessingsociety.org/community-involvement/women-signal-processing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-link"
                >
                  WISP (Women in Signal Processing)
                </a>
                .
              </p>
              <ul className="footer-ext-links">
                <li><a href="https://signalprocessingsociety.org/" target="_blank" rel="noopener noreferrer">IEEE Signal Processing Society</a></li>
                <li><a href="https://ieeekerala.org/" target="_blank" rel="noopener noreferrer">IEEE Kerala Section</a></li>
                <li>
                  <a
                    href="https://www.ieee.org/membership-catalog/productdetail/showProductDetailPage.html?product=MEMSP001&refProd=MEMSP001"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join IEEE SPS
                  </a>
                </li>
                <li><a href="https://dub.sh/Denoised" target="_blank" rel="noopener noreferrer">Denoised Newsletter</a></li>
                <li><a href="mailto:ieeespskerala@gmail.com">ieeespskerala@gmail.com</a></li>
              </ul>
            </div>
            <div className="footer-cta">
              <button
                type="button"
                className="btn btn--primary"
                id="footer-register-btn"
                onClick={openRegistration}
              >
                Claim Your Seat
              </button>
            </div>
          </div>

          <div className="footer-bottom">
            <a
              className="footer-site-link"
              href="https://www.ieeespskc.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.ieeespskc.in
            </a>

            <div className="footer-socials">
              <span className="socials-label">follow us on</span>
              <ul className="social-list">
                <li>
                  <a href="https://whatsapp.com/channel/0029VaUBEMQKQuJFMXYUhJ0U" target="_blank" rel="noopener noreferrer" aria-label="IEEE SPS Kerala WhatsApp Channel">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-2-.1-.5-.2-1.1-.4-1.9-.7-3.3-1.4-5.4-4.8-5.6-5-.2-.3-1.3-1.8-1.3-3.4s.8-2.4 1.1-2.7c.3-.3.7-.4.9-.4h.7c.2 0 .5-.1.8.6.3.7 1 2.4 1.1 2.6.1.2.1.4 0 .6-.1.2-.2.4-.4.6-.2.2-.4.4-.5.6-.2.2-.4.4-.2.7.2.3.9 1.5 2 2.4 1.4 1.2 2.5 1.6 2.9 1.8.3.1.5.1.7-.1.2-.2.9-1 1.1-1.4.2-.3.5-.3.8-.2.3.1 2 .9 2.3 1.1.3.2.6.3.7.4.1.2.1.8-.1 1.5Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/ieeespskerala" target="_blank" rel="noopener noreferrer" aria-label="IEEE SPS Kerala Instagram">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm10.5 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/ieee-sps-kerala-chapter" target="_blank" rel="noopener noreferrer" aria-label="IEEE SPS Kerala LinkedIn">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.1a4.2 4.2 0 0 1 3.8-2.1c4 0 4.8 2.6 4.8 6.1V21h-4v-5.5c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21h-4V9Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/ieeespskerala" target="_blank" rel="noopener noreferrer" aria-label="IEEE SPS Kerala Facebook">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.6V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H7.6v3h2.7v8h3.2Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://x.com/ieeespskerala" target="_blank" rel="noopener noreferrer" aria-label="IEEE SPS Kerala on X">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <MobileNavDrawer
        ref={mobileDrawerRef}
        onOpenRegister={openRegistration}
        onOpenChange={setDrawerOpen}
      />
      <RegisterModal ref={registerModalRef} />
    </div>
  );
}
