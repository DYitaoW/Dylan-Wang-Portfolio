import PaperDoodle from "./PaperDoodle";
import type { DrawingTool } from "./DeskControls";

const projects = [
  {
    number: "01",
    title: "Beyond the Stats",
    descriptionLines: [
      "Soccer predictive ML model & SwiftUI/web app forecasting",
      "matches with 63% accuracy over 10k+ games.",
    ],
    stack: "Python · Scikit-Learn · Swift  · SwiftUI· FastAPI · React · TypeScript",
    url: "https://github.com/DYitaoW/Soccer-Result-Predictor",
  },
  {
    number: "02",
    title: "Draft It! Soccer Game",
    descriptionLines: [
      "Soccer draft & season simulation iOS game with AI opponents, full",
      "seasons and unlimited amounts of fun!",
    ],
    stack: "iOS Development  ·   Swift  ·  SwiftUI  ·  SQLite",
    url: "https://apps.apple.com/us/app/draft-it-38-0-draft/id6797634589",
  },
  {
    number: "03",
    title: "Boilermates - My first project",
    descriptionLines: [
      "Social networking app with custom socket architecture built as",
      "a CS180 group project, with instant messaging & persistent storage.",
    ],
    stack: "Java · Sockets · Client/Server Architecture · Concurrency",
    url: "https://github.com/DYitaoW/BoilermatesFinalCopy",
  },
];

function PunchHoles() {
  return <div className="punch-holes" aria-hidden="true"><span /><span /><span /></div>;
}

export default function PortfolioPapers({
  clearSignal,
  tool,
}: {
  clearSignal: number;
  tool: DrawingTool;
}) {
  return (
    <section className="desk-layout" aria-label="Dylan Wang portfolio">
      <article className="sheet main-sheet">
        {/* Blue notebook ruling lines running across the paper and over the doodles */}
        <div className="main-sheet-ruling" aria-hidden="true" />
        <PunchHoles />
        <div className="paper-content">
          <header className="intro">
            <p className="eyebrow">hello, world! I&apos;m</p>
            <h1>Dylan <span>Wang</span></h1>
            <svg className="name-underline" viewBox="0 0 270 18" aria-hidden="true">
              <path d="M3 11c51-8 137 3 262-5M6 15c66-5 160 2 231-3" />
            </svg>

            {/* Hand-drawn Grad 2028 Doodle in top right of main page */}
            <div className="grad-doodle-wrapper" aria-hidden="true" title="Graduation 2028 doodle">
              <PaperDoodle src="/graddoodle.jpg" alt="Graduation 2028 doodle" className="grad-doodle-img" />
            </div>
          </header>
          <section className="about">
            <h2>a little about me</h2>
            <div className="about-text lined-text">
              <p className="about-paragraph">
                <span className="paper-line">I&apos;m a Computer Science student at Purdue University (3.73 GPA) and a passionate developer. I love building data-driven systems, mobile applications,</span>
                <span className="paper-line">machine learning systems, web development, and fun games.</span>
              </p>
              <p className="about-paragraph">
                <span className="paper-line">When I&apos;m not writing code, you&apos;ll find me playing soccer, dreaming about</span>
                <span className="paper-line">cars, and cheering for Chelsea.</span>
              </p>
            </div>
          </section>

          {/* Purdue University 'P' Doodle between About and Experience */}
          <div className="purdue-doodle-wrapper" aria-hidden="true" title="Purdue P logo doodle">
            <PaperDoodle src="/purduedoodle.jpg" alt="Purdue University P logo doodle" className="purdue-doodle-img" />
          </div>

          <section className="experience shifted-experience">
            <h2>My Experience</h2>
            <div className="experience-entry lined-text">
              <div className="paper-line experience-title-row">
                <strong>Undergraduate Teaching Assistant (CS250)</strong>
                <span>Fall 2026</span>
              </div>
              <p className="paper-line">Helping students understand computer architecture concepts and providing guidance during labs and office hours.</p>
            </div>
            <div className="experience-entry lined-text">
              <div className="paper-line experience-title-row">
                <strong>Purdue National Defense Society</strong>
                <span> From Aug 2025 — Feb 2026</span>
              </div>
              <p className="paper-line">Researching security vulnerabilities in web communication.</p>
            </div>
            <div className="experience-entry referee-entry lined-text">
              <div className="paper-line experience-title-row">
                <strong>Youth Soccer Referee</strong>
                <span>Since 2021</span>
              </div>
              <p className="experience-desc">
                <span className="paper-line">Mentoring young players, referees and ensuring</span>
                <span className="paper-line">fair play during matches.</span>
              </p>
            </div>
          </section>
          <nav className="paper-links" aria-label="Portfolio links">
            <a href="https://github.com/DYitaoW" target="_blank" rel="noopener noreferrer">Github ↗</a>
            <a href="https://www.linkedin.com/in/dylanywang06/" target="_blank" rel="noopener noreferrer">Linkedin ↗</a>
            <a href="mailto:dylanywang06@gmail.com">Say Hello! ↗</a>
            <a href="/Wang-Dylan-Resume2026.pdf" target="_blank" rel="noopener noreferrer" title="View & Download Resume PDF">My Resume ↗</a>
          </nav>

          {/* Click Me! hint with upward curved arrows pointing to the links */}
          <div className="click-me-hint" aria-hidden="true">
            <svg className="click-me-arrow click-me-arrow-left" viewBox="0 0 44 32">
              <path d="M38 28 C 30 24, 16 20, 12 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M5 14 L 12 6 L 19 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="click-me-text">Click Me!</span>
            <svg className="click-me-arrow click-me-arrow-right" viewBox="0 0 44 32">
              <path d="M6 28 C 14 24, 28 20, 32 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M25 12 L 32 6 L 39 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Hand-drawn Chelsea FC crest doodle */}
          <div className="chelsea-doodle-wrapper" aria-hidden="true" title="Chelsea FC sketch doodle">
            <PaperDoodle src="/chelsea.jpeg" alt="Chelsea Football Club hand-drawn crest doodle" className="chelsea-doodle-img" />
          </div>
          <p className="paper-signoff">thanks for stopping by!</p>
        </div>
      </article>

      <article className="sheet project-sheet">
        {/* Blue notebook ruling lines running across the second paper and over the doodles */}
        <div className="project-sheet-ruling" aria-hidden="true" />
        <div className="project-content">
          {/* Hand-drawn Cat Doodle in top right of second page */}
          <div className="cat-doodle-wrapper" aria-hidden="true" title="Cat doodle">
            <PaperDoodle src="/catdoodle.jpg" alt="Cat sketch doodle" className="cat-doodle-img" />
          </div>

          <header className="project-header">
            <p className="eyebrow">Some cool things I&apos;ve made</p>
            <div className="project-title-row">
              <h2>My Favorite projects</h2>
            </div>
          </header>
          <div className="project-list lined-text">
            {projects.map(({ number, title, descriptionLines, stack, url }, pIdx) => (
              <div key={number} className="project-item-group">
                <a className="project" href={url} target="_blank" rel="noopener noreferrer">
                  <span className="paper-line project-number">{number}</span>
                  <span className="project-main">
                    <strong className="paper-line project-title">
                      {title}
                      {pIdx === 0 && (
                        <span className="project-title-hint" aria-hidden="true">
                          <svg className="title-hint-arrow" viewBox="0 0 32 26">
                            <path d="M 28 22 C 22 19, 12 16, 9 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                            <path d="M 4 12 L 9 5 L 15 11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="title-hint-text">Click Here!</span>
                        </span>
                      )}
                    </strong>
                    {descriptionLines.map((line, idx) => (
                      <span key={idx} className="paper-line project-desc-line">{line}</span>
                    ))}
                    <small className="paper-line project-stack">{stack}</small>
                  </span>
                  <span className="paper-line project-arrow">↗</span>
                </a>
                {pIdx === 0 && (
                  <div className="project-live-link-row">
                    <a
                      className="project-live-btn"
                      href="https://beyondthestatsapp.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-animation="horizontal"
                      title="Checkout the website in action! - https://beyondthestatsapp.com "
                    >
                      <span>Checkout the website in action! - https://beyondthestatsapp.com</span>
                      <span className="live-btn-arrow">↗</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
          <footer className="project-footer">
            {/* Hand-drawn Washington Commanders 'W' doodle above email */}
            <div className="commanders-doodle-wrapper" aria-hidden="true" title="Washington Commanders doodle">
              <PaperDoodle src="/commandersdoodle.jpg" alt="Washington Commanders W doodle" className="commanders-doodle-img" />
            </div>
            <span>Want to get in contact?</span>
            <a href="mailto:dylanywang06@gmail.com">dylanywang06@gmail.com</a>
          </footer>

          {/* Hand-drawn Tic-Tac-Toe Doodle between Commanders and Apple */}
          <div className="tictactoe-doodle-wrapper" aria-hidden="true" title="Tic-tac-toe doodle">
            <PaperDoodle src="/tictactoe.jpg" alt="Tic-tac-toe doodle" className="tictactoe-doodle-img" />
          </div>

          {/* Hand-drawn Apple Doodle in bottom right of second page */}
          <div className="apple-doodle-wrapper" aria-hidden="true" title="Apple logo doodle">
            <PaperDoodle src="/appledoodle.jpg" alt="Apple logo sketch doodle" className="apple-doodle-img" />
          </div>
        </div>
      </article>
    </section>
  );
}
