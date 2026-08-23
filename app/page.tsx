/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import ScrollEffects from "./scroll-effects";

const leadership = [
  ["Political Leadership", "Working with AIADMK cadres and communities across Tamil Nadu."],
  ["Legislative Experience", "Bringing constituency concerns into the legislative process."],
  ["Administrative Experience", "Experience in administration, implementation and development programmes."],
  ["Organisational Leadership", "Strengthening the party organisation and its grassroots network."],
  ["Continuing the Journey", "Working towards the larger interests of Tamil Nadu and its people."],
];
const vision = [
  ["Strong Infrastructure", "Better roads, transport, water systems and connectivity."],
  ["Opportunities for Youth", "Education, skills, employment and entrepreneurship."],
  ["Education for the Future", "Quality learning for a rapidly changing world."],
  ["Healthcare for Every Family", "Accessible, dependable care for every community."],
  ["Empowering Women", "Safety, opportunity, leadership and financial independence."],
  ["Strong Rural Communities", "Infrastructure, amenities and local employment."],
  ["Agriculture & Farmers", "Stronger support and opportunity for farming communities."],
  ["Technology & Innovation", "Startups, digital infrastructure and new industries."],
];
const people = [["Listen", "Understand the concerns of people and communities."], ["Represent", "Take people's voices to the appropriate platforms."], ["Act", "Work towards practical solutions and meaningful development."], ["Deliver", "Focus on outcomes that improve people's lives."]];
const news = [["Political Updates", "Updates from political programmes and organisational activities."], ["Public Activities", "Community interactions and public engagements."], ["Development", "Updates on development-related initiatives."], ["Speeches & Statements", "Important speeches, views and public statements."], ["Media Coverage", "News and interviews featuring S. P. Velumani."]];

function SectionHead({ label, title }: { label: string; title: string }) { return <div className="section-head"><p className="section-label">{label}</p><h2>{title}</h2></div>; }

export default function Home() {
  return <main>
    <ScrollEffects />
    <header className="site-header">
      <a className="brand" href="#top" aria-label="S. P. Velumani home"><span className="brand-name">S. P. Velumani</span></a>
      <nav className="nav-links" aria-label="Primary navigation"><a href="#about">About</a><a href="#leadership">Leadership</a><a href="#vision">Vision</a><a href="#people">People First</a><a className="nav-cta" href="#connect">Connect</a></nav>
      <details className="mobile-menu"><summary aria-label="Open navigation"><span /><span /></summary><div><a href="#about">About</a><a href="#leadership">Leadership</a><a href="#vision">Vision</a><a href="#people">People First</a><a href="#connect">Connect</a></div></details>
    </header>

    <section className="hero" id="top"><div className="hero-copy">
      <h1><span>A Leader Committed to the Progress of</span><em>Tamil Nadu</em></h1>
      <div className="hero-intro"><div><strong>S. P. Velumani</strong><p>Senior Leader, All India Anna Dravida Munnetra Kazhagam (AIADMK)<br />Member of the Tamil Nadu Legislative Assembly</p></div><p>A leader with extensive political and administrative experience, S. P. Velumani has dedicated his public life to serving the people and contributing to the development of Tamil Nadu.</p></div>
      <div className="hero-actions"><a className="button button-primary" href="#about">Know His Journey <span>↗</span></a><a className="button button-secondary" href="#vision">Explore His Vision <span>→</span></a></div>
    </div><aside className="hero-visual"><span className="hero-word" aria-hidden="true">SPV</span><span className="hero-rail" aria-hidden="true">S. P. VELUMANI · TAMIL NADU</span><Image src="/images/sp-velumani-standing-cutout.png" alt="S. P. Velumani" fill priority sizes="(max-width: 960px) 100vw, 38vw" className="hero-photo" /></aside></section>

    <section className="section about" id="about"><SectionHead label="About S. P. Velumani" title="A Journey in Public Service" /><div className="about-layout"><div className="about-image frame-image"><Image src="/images/sp-velumani-portrait-2.jpg" alt="S. P. Velumani seated" fill sizes="(max-width: 800px) 100vw, 40vw" /></div><div className="prose large-prose"><p>S. P. Velumani is a prominent AIADMK leader with extensive experience in electoral politics, government administration and public service.</p><p>From grassroots politics to ministerial responsibility, his career brings together political leadership and administrative experience.</p><p>He continues to represent people's concerns and contribute to the future of Tamil Nadu.</p></div></div></section>

    <section className="section leadership-section" id="leadership"><SectionHead label="Leadership Journey" title="From Grassroots to State Leadership" /><p className="lead-statement">Leadership is built through experience, responsibility and people's trust.</p><div className="timeline">{leadership.map(([title,text],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>

    <section className="section vision-section" id="vision"><div className="vision-intro"><SectionHead label="Vision for Tamil Nadu" title="Building a Stronger Tamil Nadu" /><div className="prose"><p>Economically strong, socially inclusive and full of opportunity for every generation.</p></div></div><div className="vision-grid" role="region" aria-label="Vision priorities. Scroll horizontally to explore all cards.">{vision.map(([title,text],i)=><article className={i===0||i===7?"featured":""} key={title}><span className="card-no">V / {String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className="section people-section" id="people"><div className="people-copy"><SectionHead label="People First" title="Public Service Begins With Listening" /><div className="rhythm-copy"><p>Listen to people.</p><p>Represent their voice.</p><p>Deliver meaningful action.</p></div></div><div className="people-steps">{people.map(([title,text],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className="constituency"><div className="constituency-image"><span aria-hidden="true">THONDAMUTHUR</span><Image src="/images/sp-velumani-greeting-cutout.png" alt="S. P. Velumani greeting the public" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="constituency-copy"><SectionHead label="Thondamuthur" title="A Constituency Close to the Heart" /><p>Thondamuthur remains central to S. P. Velumani's political journey and grassroots engagement.</p><ul>{["Development activities","Public interactions","Constituency visits","Community programmes"].map(x=><li key={x}>{x}</li>)}</ul><a className="button button-primary" href="#gallery">Explore Thondamuthur <span>↗</span></a></div></section>

    <section className="section news-section"><SectionHead label="News & Updates" title="Latest From S. P. Velumani" /><p className="news-lead">Stay connected with the latest activities, political programmes, public meetings, development initiatives and statements.</p><h3 className="sub-label">Categories</h3><div className="news-grid">{news.map(([title,text],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p><b>→</b></article>)}</div></section>

    <section className="gallery-section" id="gallery"><div className="gallery-head"><SectionHead label="Media & Gallery" title="Moments of Leadership" /><p>Explore photographs and videos from across his public and political journey.</p></div><div className="gallery-grid"><figure className="gallery-tall gallery-cutout"><span aria-hidden="true">LEADERSHIP</span><Image className="gallery-cutout-photo" src="/images/sp-velumani-namaste-cutout.png" alt="S. P. Velumani greeting with folded hands" fill sizes="(max-width: 800px) 100vw, 50vw" /></figure><figure><Image src="/images/sp-velumani-standing.jpg" alt="S. P. Velumani standing" fill sizes="(max-width: 800px) 50vw, 25vw" /></figure><figure><Image src="/images/sp-velumani-portrait-2.jpg" alt="S. P. Velumani portrait" fill sizes="(max-width: 800px) 50vw, 25vw" /></figure></div><div className="gallery-categories"><h3>Gallery Categories</h3>{["Political Events","Public Meetings","People's Interactions","Government Activities","Constituency Visits","Party Programmes","Social & Community Events","Speeches","Media Interviews"].map(x=><span key={x}>{x}</span>)}</div></section>

    <section className="connect-section" id="connect"><div className="connect-intro"><p className="section-label">Connect With the Leader</p><h2>Your Voice Matters</h2><p>Leadership begins with listening.</p><p>Whether you have a suggestion, concern, idea or message, your voice deserves to be heard.</p></div><form className="contact-form"><h3>Share Your Voice</h3><label>Name<input name="name" type="text" /></label><label>Mobile Number<input name="mobile" type="tel" /></label><label>District<input name="district" type="text" /></label><label>Constituency<input name="constituency" type="text" /></label><label className="wide">Message<textarea name="message" rows={4} /></label><button type="submit">Submit Your Message <span>↗</span></button></form></section>

    <footer className="footer"><div className="footer-main"><p className="section-label">Together, We Build the Future</p><h2>Leadership. Service. Tamil Nadu.</h2><div className="footer-copy"><p>Empowering people, creating opportunity and strengthening communities across Tamil Nadu.</p></div><p className="signature">S. P. Velumani</p><a className="button footer-button" href="#connect">Connect With Us <span>↗</span></a></div><div className="footer-bottom"><span>SPV</span><a href="#top">Back to top ↑</a></div></footer>
  </main>;
}
