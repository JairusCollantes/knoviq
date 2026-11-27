import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BrainCog, Check, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './Landing.css';

const STEPS = [
  {
    n: '01',
    title: 'Name it',
    body: 'Type any topic — the Krebs cycle, Bayes\u2019 theorem, useEffect cleanup. Knoviq drafts a lesson with a beginning, a middle, and an end.',
    meta: '~15 sec',
  },
  {
    n: '02',
    title: 'Read once',
    body: 'Short prose, one idea per screen. Definitions and examples sit where you need them, not buried in a 4,000-word wall.',
    meta: '4 min',
  },
  {
    n: '03',
    title: 'Answer',
    body: 'Mixed recall: multiple choice, fill-in, explain-it-back. A wrong answer gets an explanation, not a red X.',
    meta: '3 min',
  },
  {
    n: '04',
    title: 'Keep it',
    body: 'Your answers become a record. See what is solid, what is shaky, and what to revisit before it fades.',
    meta: 'ongoing',
  },
];

const LEDGER = [
  { topic: 'Java', lesson: 'OOP Basics', when: '2 hours ago', pct: 80, state: 'Solid' },
  { topic: 'C++', lesson: 'Pointers', when: 'Yesterday', pct: 60, state: 'Shaky' },
  { topic: 'Calculus', lesson: 'Limits & continuity', when: '3 days ago', pct: 50, state: 'Shaky' },
  { topic: 'Java', lesson: 'Interfaces', when: 'Last week', pct: 70, state: 'Solid' },
];

const FAQS = [
  {
    q: 'Is this just ChatGPT with a quiz?',
    a: 'No. A chat window waits for you to ask something. Knoviq runs a fixed loop: it writes the lesson, asks the questions, marks them, and keeps the record. You do not have to prompt your way into a study session.',
  },
  {
    q: 'What topics work?',
    a: 'Anything with an explanation inside it: cell biology, linear algebra, the French Revolution, a React hook. Very broad prompts (\u201chistory\u201d) produce vague lessons, so narrow it \u2014 \u201cthe Congress of Vienna\u201d beats \u201cEurope\u201d.',
  },
  {
    q: 'Do I need an account?',
    a: 'Not to try. You get three lessons before signing up. An account keeps your attempts, scores, and library together across devices.',
  },
  {
    q: 'How long is a lesson?',
    a: 'Four to six minutes to read, three to answer. Short enough to finish on a coffee break, long enough to actually cover something.',
  },
  {
    q: 'Can I export anything?',
    a: 'Not yet. Markdown lessons and a CSV of your attempts are the next things on the list. Nothing you write is locked in.',
  },
  {
    q: 'Where does my data go?',
    a: 'Attempts are stored against your account in Supabase, and lesson text is generated through the model API. Nothing is sold, and deleting your account removes its attempts.',
  },
];

const EXAMPLES = ['the Krebs cycle', 'Bayes\u2019 theorem', 'useEffect cleanup'];

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function Reveal({ as: Tag = 'div', className = '', index = 0, stagger = 60, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion()) {
      el.dataset.reveal = 'in';
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.dataset.reveal = 'in';
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal=""
      style={{ '--i': index, '--d': `${index * stagger}ms` }}
    >
      {children}
    </Tag>
  );
}

function QuizCard({
  topic,
  index,
  total,
  question,
  options,
  answer,
  explanation,
  revealOnView = false,
  label = 'Sample quiz question',
}) {
  const [selected, setSelected] = useState(() =>
    revealOnView && prefersReducedMotion() ? answer : null
  );
  const [checked, setChecked] = useState(() => revealOnView && prefersReducedMotion());
  const cardRef = useRef(null);

  useEffect(() => {
    if (!revealOnView || prefersReducedMotion()) return undefined;
    const el = cardRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        setSelected((current) => current ?? answer);
        setChecked(true);
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [answer, revealOnView]);

  const correct = checked && selected === answer;

  function choose(option) {
    setSelected(option);
    setChecked(false);
  }

  return (
    <article className="l-quiz" ref={cardRef} aria-label={label}>
      <header className="l-quiz__head">
        <span className="l-chip">{topic}</span>
        <span className="l-quiz__count">
          Question {index} of {total}
        </span>
      </header>

      <h3 className="l-quiz__question">{question}</h3>

      <div className="l-quiz__options" role="group" aria-label="Answer options">
        {options.map((option, i) => {
          let state = '';
          if (checked) {
            if (option === answer) state = 'is-correct';
            else if (option === selected) state = 'is-wrong';
          } else if (option === selected) {
            state = 'is-selected';
          }
          return (
            <button
              key={option}
              type="button"
              className={`l-quiz__opt ${state}`.trim()}
              aria-pressed={option === selected}
              onClick={() => choose(option)}
            >
              <span className="l-quiz__mark" aria-hidden="true">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="l-quiz__opt-text">{option}</span>
              {checked && option === answer && (
                <Check className="l-quiz__check" size={16} strokeWidth={2.4} aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      <div className="l-quiz__foot">
        {checked ? (
          <p className="l-quiz__verdict" role="status">
            {correct ? 'Correct.' : `Not quite — ${answer}.`}
          </p>
        ) : (
          <button
            type="button"
            className="l-btn l-btn--primary l-btn--sm"
            disabled={!selected}
            onClick={() => setChecked(true)}
          >
            Check answer
          </button>
        )}

        <span className="l-quiz__ticks" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={i < index ? 'is-on' : undefined} />
          ))}
        </span>
      </div>

      <div className="l-quiz__explain" data-open={checked}>
        <div className="l-quiz__explain-inner">
          <p>{explanation}</p>
        </div>
      </div>
    </article>
  );
}

export function LandingNav() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <nav className="l-nav" data-scrolled={scrolled} aria-label="Primary">
      <div className="l-nav__inner">
        <Link to="/" className="l-brand" onClick={close}>
          <BrainCog size={22} strokeWidth={1.75} aria-hidden="true" />
          <span>Knoviq</span>
        </Link>

        <ul className="l-nav__links">
          <li>
            <a href="#how-it-works">How it works</a>
          </li>
          <li>
            <Link to="/learn/java-oop">Sample lesson</Link>
          </li>
          <li>
            <Link to="/login">Log in</Link>
          </li>
        </ul>

        <div className="l-nav__actions">
          {user ? (
            <Link to="/library" className="l-btn l-btn--ghost">
              Continue
            </Link>
          ) : (
            <a href="#start" className="l-btn l-btn--ghost">
              Start free
            </a>
          )}
          <button
            type="button"
            className="l-nav__toggle"
            ref={toggleRef}
            aria-expanded={open}
            aria-controls="l-nav-panel"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="l-nav__panel" id="l-nav-panel">
          <a href="#how-it-works" onClick={close}>
            How it works
          </a>
          <Link to="/learn/java-oop" onClick={close}>
            Sample lesson
          </Link>
          <Link to="/login" onClick={close}>
            Log in
          </Link>
          <a href="#start" className="l-btn l-btn--primary" onClick={close}>
            Start free <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      )}
    </nav>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const inputRef = useRef(null);

  // Deep links (#start, #how-it-works) need the target to exist before scrolling.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, []);

  function submitTopic(event) {
    event.preventDefault();
    const value = topic.trim();
    if (!value) {
      inputRef.current?.focus();
      return;
    }
    navigate('/library', { state: { topic: value } });
  }

  function pickExample(value) {
    setTopic(value);
    inputRef.current?.focus();
  }

  return (
    <div className="landing">
      <section className="l-hero">
        <div className="l-shell l-hero__grid">
          <div className="l-hero__copy">
            <p className="l-eyebrow">
              <span className="l-eyebrow__rule" aria-hidden="true" />
              Interactive lessons · built for recall
            </p>

            <h1 className="l-display">
              Notes don&rsquo;t stick. <em>Questions</em> do.
            </h1>

            <p className="l-lead">
              Type a topic. Knoviq writes a short interactive lesson, quizzes you on it, and keeps a
              record of what actually stuck.
            </p>

            <div className="l-hero__actions">
              <a href="#start" className="l-btn l-btn--primary">
                Start with a topic <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
              </a>
              <Link to="/learn/java-oop" className="l-link">
                See a sample lesson <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <p className="l-micro">Free to try · 3 lessons before sign-up · No card</p>
          </div>

          <div className="l-hero__artifact">
            <QuizCard
              topic="Calculus"
              index={3}
              total={6}
              question="Which statement is true at a removable discontinuity?"
              options={[
                'The limit exists, but f(c) is undefined',
                'The left and right limits disagree',
                'The function grows without bound',
                'The function is continuous but not differentiable',
              ]}
              answer="The limit exists, but f(c) is undefined"
              explanation="A removable discontinuity is a hole: the two-sided limit exists, but the value at that point is missing or different. You can patch it by redefining f(c)."
            />
          </div>
        </div>
      </section>

      <section className="l-problem" aria-labelledby="l-problem-title">
        <div className="l-shell l-problem__grid">
          <div className="l-problem__col">
            <p className="l-label">The problem</p>
            <ul className="l-struck">
              {['Highlight 40 pages', 'Reread them twice', 'Feel prepared', 'Forget by Thursday'].map(
                (item, i) => (
                  <li key={item} style={{ '--i': i }}>
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <Reveal className="l-problem__statement">
            <h2 id="l-problem-title">
              Recognition is not recall. Knoviq makes you <em>produce</em> the answer before it shows
              you one.
            </h2>
            <p className="l-body">
              Highlighting feels like progress because the page looks familiar. It is the weakest form
              of study there is. Retrieval — being asked, and answering — is what moves knowledge into
              long-term memory.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="how-it-works" className="l-loop" aria-labelledby="l-loop-title">
        <div className="l-shell">
          <div className="l-loop__head">
            <p className="l-label">How it works</p>
            <h2 id="l-loop-title">
              Four moves. One <em>loop</em>.
            </h2>
          </div>

          <ol className="l-steps">
            {STEPS.map((step, i) => (
              <Reveal as="li" key={step.n} className="l-step" index={i}>
                <span className="l-step__num" aria-hidden="true">
                  {step.n}
                </span>
                <h3 className="l-step__title">{step.title}</h3>
                <p className="l-step__body">{step.body}</p>
                <span className="l-step__meta">{step.meta}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="l-recall" aria-labelledby="l-recall-title">
        <div className="l-shell l-recall__grid">
          <Reveal className="l-recall__copy">
            <p className="l-label">Recall, not rereading</p>
            <h2 id="l-recall-title">
              The question <em>is</em> the lesson.
            </h2>
            <p className="l-body">
              Every lesson ends in questions, and every answer gets a reason. When you get one wrong,
              Knoviq explains the gap instead of just marking it.
            </p>
            <Link to="/learn/java-oop" className="l-link">
              Open the sample lesson <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </Reveal>

          <div className="l-recall__card">
            <QuizCard
              topic="Java"
              index={5}
              total={10}
              question="Which access modifier is the most restrictive?"
              options={['public', 'protected', 'private', 'default']}
              answer="private"
              explanation="“private” keeps a member inside the declaring class — not even subclasses can see it. That is the tightest access Java offers."
              revealOnView
              label="Sample Java quiz question"
            />
          </div>
        </div>
      </section>

      <section className="l-progress" aria-labelledby="l-progress-title">
        <div className="l-shell l-progress__grid">
          <Reveal className="l-progress__head">
            <p className="l-label">Progress</p>
            <h2 id="l-progress-title">See what stuck.</h2>
            <p className="l-body">
              Not a streak counter that rewards showing up. A record of what you can actually answer,
              topic by topic.
            </p>
          </Reveal>

          <div className="l-ledger">
            <div className="l-ledger__head" aria-hidden="true">
              <span>Topic</span>
              <span>Last studied</span>
              <span>Mastery</span>
              <span>Score</span>
            </div>

            {LEDGER.map((row) => (
              <Link key={`${row.topic}-${row.lesson}`} to="/library" className="l-ledger__row">
                <span className="l-ledger__topic">
                  {row.topic}
                  <small>{row.lesson}</small>
                </span>
                <span className="l-ledger__when">{row.when}</span>
                <span
                  className="l-ledger__bar"
                  role="progressbar"
                  aria-valuenow={row.pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${row.topic} mastery`}
                >
                  <span style={{ width: `${row.pct}%` }} />
                </span>
                <span className="l-ledger__score">
                  {row.pct}%<small>{row.state}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="l-faq" aria-labelledby="l-faq-title">
        <div className="l-shell l-faq__grid">
          <div className="l-faq__rail">
            <p className="l-label">Objections</p>
            <h2 id="l-faq-title">Reasonable questions.</h2>
            <p className="l-faq__note">
              Still curious? <Link to="/login">Sign in</Link> and ask from the profile page.
            </p>
          </div>

          <div className="l-faq__list">
            {FAQS.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q} className="l-faq__item" data-open={open}>
                  <h3 className="l-faq__h">
                    <button
                      type="button"
                      className="l-faq__q"
                      id={`l-faq-btn-${i}`}
                      aria-expanded={open}
                      aria-controls={`l-faq-panel-${i}`}
                      onClick={() => setOpenFaq(open ? -1 : i)}
                    >
                      <span className="l-faq__num" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="l-faq__label">{item.q}</span>
                      <ChevronDown className="l-faq__chev" size={18} aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    className="l-faq__panel"
                    id={`l-faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`l-faq-btn-${i}`}
                  >
                    <div className="l-faq__panel-inner">
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="start" className="l-cta" aria-labelledby="l-cta-title">
        <div className="l-cta__dots" aria-hidden="true" />
        <div className="l-shell l-cta__grid">
          <div className="l-cta__main">
            <p className="l-label">Start here</p>
            <h2 id="l-cta-title">
              What do you want to <em>understand?</em>
            </h2>

            <form className="l-topic" onSubmit={submitTopic}>
              <label className="visually-hidden" htmlFor="l-topic-input">
                Topic to learn
              </label>
              <input
                id="l-topic-input"
                ref={inputRef}
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="e.g. the Doppler effect"
                autoComplete="off"
                spellCheck="false"
              />
              <button type="submit" className="l-btn l-btn--primary">
                Generate lesson <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
              </button>
            </form>

            <p className="l-micro">No card. Three lessons before sign-up. Your progress stays yours.</p>
          </div>

          <div className="l-cta__examples">
            <p className="l-label">Or try one</p>
            <ul>
              {EXAMPLES.map((example) => (
                <li key={example}>
                  <button type="button" onClick={() => pickExample(example)}>
                    {example}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="l-footer">
        <div className="l-shell l-footer__grid">
          <div className="l-footer__brand">
            <p className="l-footer__mark">Knoviq</p>
            <p className="l-footer__tag">Study at your own pace — and prove it.</p>
          </div>

          <nav className="l-footer__col" aria-label="Product">
            <p className="l-label">Product</p>
            <Link to="/library">Library</Link>
            <Link to="/learn/java-oop">Sample lesson</Link>
            <a href="#how-it-works">How it works</a>
          </nav>

          <nav className="l-footer__col" aria-label="Account">
            <p className="l-label">Account</p>
            <Link to="/login">Log in</Link>
            <Link to="/profile">Profile</Link>
            <a href="#start">Start a lesson</a>
          </nav>
        </div>

        <div className="l-shell l-footer__bottom">
          <span>© 2026 Knoviq</span>
          <span className="l-status">
            <i aria-hidden="true" />
            All systems nominal
          </span>
        </div>
      </footer>
    </div>
  );
}
