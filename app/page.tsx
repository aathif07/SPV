import Image from "next/image";
import type { ReactNode } from "react";
import { AchievementRail, ConnectForm, Filters, HeroPhoto, Reveal } from "./components/home/home-client";
import AchievementCard from "./components/achievement-card";
import { LanguageProvider } from "./components/language";
import { listPublishedAchievements } from "./lib/achievements";
import { Arrow, PlainLink, SiteBottom, SiteTop } from "./components/site-chrome";
import { listPublishedPosts } from "./lib/posts";
import { formatPostDate } from "./lib/format";
import { toMediaUrl } from "./lib/media-url";

export const dynamic = "force-dynamic";

const stats = [
  ["XX", "+", "Years in public life"],
  ["X", "", "Terms as MLA"],
  ["XX", "K", "Grievances addressed"],
  ["XXX", "+", "Development projects"],
];

const tickerWords = [
  ["People First", "மக்களே முதல்"],
  ["Voice of the People", "மக்களின் குரல்"],
  ["Public Service", "மக்கள் சேவை"],
  ["Experience", "அனுபவம்"],
];

const leadership = [
  ["அரசியல் தலைமை", "Political Leadership", "Working with AIADMK cadres and communities across Tamil Nadu."],
  ["சட்டமன்ற அனுபவம்", "Legislative Experience", "Bringing constituency concerns into the legislative process."],
  ["நிர்வாக அனுபவம்", "Administrative Experience", "Administration, implementation and development programmes."],
  ["அமைப்புத் தலைமை", "Organisational Leadership", "Strengthening the party organisation and its grassroots network."],
  ["தொடரும் பயணம்", "Continuing the Journey", "Working towards the larger interests of Tamil Nadu and its people."],
];

const vision: { img: string; cap: string; title: string; text: string; icon: ReactNode }[] = [
  { img: "amrut", cap: "AMRUT scheme review · Chennai, 2017", title: "Strong Infrastructure", text: "Better roads, transport, water systems and connectivity.", icon: <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" /> },
  { img: "block", cap: "Advanced Technology Centre · Pollachi", title: "Opportunities for Youth", text: "Education, skills, employment and entrepreneurship.", icon: <><circle cx="12" cy="7" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></> },
  { img: "gathering", cap: "Educational institutions jubilee · Pollachi", title: "Education for the Future", text: "Quality learning for a rapidly changing world.", icon: <><path d="M2 6l10-3 10 3-10 3z" /><path d="M6 8v6c3 2 9 2 12 0V8" /></> },
  { img: "clinic", cap: "Wellness clinic opening · Pollachi", title: "Healthcare for Every Family", text: "Accessible, dependable care for every community.", icon: <><path d="M12 21s-8-5-8-11a5 5 0 0 1 8-3 5 5 0 0 1 8 3c0 6-8 11-8 11z" /><path d="M12 9v5M9.5 11.5h5" /></> },
  { img: "mudra", cap: "MUDRA loan beneficiaries · Chennai", title: "Empowering Women", text: "Safety, opportunity, leadership and financial independence.", icon: <><circle cx="12" cy="9" r="5" /><path d="M12 14v7M9 18h6" /></> },
  { img: "lamp", cap: "Bharat Nirman campaign · Pollachi, 2011", title: "Strong Rural Communities", text: "Infrastructure, amenities and local employment.", icon: <path d="M3 21h18M6 21V11h5v10M13 21V7h5v14M8 7l3-4 3 4" /> },
  { img: "icds", cap: "Public information stalls · Pollachi, 2011", title: "Agriculture & Farmers", text: "Stronger support and opportunity for farming communities.", icon: <path d="M12 21V10M12 10c0-4 3-7 8-7 0 5-3 7-8 7zM12 14c0-3-2-5-7-5 0 4 2 5 7 5z" /> },
  { img: "icci", cap: "Chamber of Commerce 90th year · Coimbatore", title: "Technology & Innovation", text: "Startups, digital infrastructure and new industries.", icon: <><rect x="5" y="5" width="14" height="14" rx="2" /><path d="M9 9h6v6H9zM9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></> },
];

const chips: { label: string; icon: ReactNode }[] = [
  { label: "Development activities", icon: <path d="M3 21h18M6 21V9l6-5 6 5v12" /> },
  { label: "Public interactions", icon: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c.5-3.5 3-5 6-5s5.5 1.5 6 5M15 15c3 0 5 1.5 5.5 4" /></> },
  { label: "Constituency visits", icon: <><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></> },
  { label: "Community programmes", icon: <path d="M4 11h16v10H4zM2 7h20v4H2zM12 7v14M12 7c-2-4-6-4-6-1s6 1 6 1 6 2 6-1-4-3-6 1" /> },
];

const newsCategories = ["Political Updates", "Public Activities", "Development", "Speeches & Statements", "Media Coverage"];
const newsFallbackPhotos = ["/images/spv-studio-namaste-scarf.jpg", "/images/spv-studio-wave.jpg", "/images/spv-studio-seated.jpg", "/images/spv-studio-victory.jpg", "/images/spv-studio-seated-smile.jpg"];
// Shown until posts are published from the admin.
const newsFallback = [
  ["Political Updates", "Updates from political programmes and organisational activities"],
  ["Public Activities", "Community interactions and public engagements"],
  ["Development", "Updates on development-related initiatives"],
  ["Speeches & Statements", "Important speeches, views and public statements"],
  ["Media Coverage", "News and interviews featuring S. P. Velumani"],
];

const gallery = [
  ["/images/sp-velumani-namaste-cutout.png", "Official portrait", "S. P. Velumani greeting with folded hands"],
  ["/images/spv-studio-namaste.jpg", "Vanakkam", "S. P. Velumani greeting with folded hands"],
  ["/images/spv-studio-victory-scarf.jpg", "Party programme", "S. P. Velumani raising a victory sign in the party scarf"],
  ["/images/spv-studio-seated.jpg", "Official photograph", "S. P. Velumani seated portrait"],
  ["/images/spv-studio-namaste-scarf-full.jpg", "Public meeting", "S. P. Velumani greeting in the party scarf"],
  ["/images/spv-studio-victory.jpg", "Political event", "S. P. Velumani raising a victory sign"],
  ["/images/spv-studio-seated-smile.jpg", "People’s interaction", "S. P. Velumani smiling in a seated portrait"],
  ["/images/spv-studio-namaste-full.jpg", "Constituency visit", "S. P. Velumani greeting in the party colours"],
];

type NewsItem = { href: string; tag: string; title: string; meta: string; img: string; external: boolean };

async function loadNews(): Promise<NewsItem[]> {
  const fallback = newsFallback.map(([tag, title], i) => ({ href: "/blog", tag, title, meta: "News & updates", img: newsFallbackPhotos[i], external: false }));
  try {
    const posts = await listPublishedPosts(5);
    if (posts.length) {
      const items = posts.map((post, i) => ({
        href: `/blog/${post.slug}`,
        tag: post.category || "News & updates",
        title: post.titleEn,
        meta: formatPostDate(post.publishedAt ?? post.createdAt).en,
        img: post.coverImageUrl ? toMediaUrl(post.coverImageUrl) : newsFallbackPhotos[i % newsFallbackPhotos.length],
        external: Boolean(post.coverImageUrl),
      }));
      // Keep the list beside the featured story full while there are few posts.
      return [...items, ...fallback.slice(items.length)];
    }
  } catch (error) {
    console.error("Could not load posts for the homepage", error);
  }
  return fallback;
}

function NewsImage({ item, width }: { item: NewsItem; width: number }) {
  // Uploaded covers bypass the image optimiser, like the blog.
  // eslint-disable-next-line @next/next/no-img-element
  if (item.external) return <img src={item.img} alt="" loading="lazy" />;
  return <Image src={item.img} alt="" width={width} height={Math.round(width * 1.5)} sizes={`${width}px`} />;
}

export default async function Home() {
  const [news, achievementList] = await Promise.all([loadNews(), listPublishedAchievements()]);
  const [featured, ...rest] = news;

  return (
    <div className="sp" id="top">
      <Reveal />
      <SiteTop onHome />

      <main>
        {/* HERO */}
        <section className="sp-hero"><div className="sp-wrap">
          <div className="sp-hero-grid">
            <div className="sp-hero-copy sp-rv">
              <span className="sp-pill"><span className="sp-dot">AIADMK</span>Senior Leader · MLA, Thondamuthur</span>
              <h1>A leader committed to the <span className="sp-outline">progress</span> of <em>Tamil Nadu</em></h1>
              <div className="sp-ta-line" lang="ta">தமிழ்நாட்டின் முன்னேற்றத்திற்காக அர்ப்பணிக்கப்பட்ட தலைவர்</div>
              <p className="sp-lead">With extensive political and administrative experience, S. P. Velumani has dedicated his public life to serving the people and contributing to the development of Tamil Nadu.</p>
              <div className="sp-ctas">
                <PlainLink href="#about" className="sp-btn sp-btn-red">Know his journey <Arrow /></PlainLink>
                <PlainLink href="#vision" className="sp-btn sp-btn-ghost">Explore his vision</PlainLink>
              </div>
            </div>
            <HeroPhoto />
          </div>
          <div className="sp-stats sp-rv">
            {stats.map(([value, suffix, label]) => (
              <div className="sp-stat" key={label}><b><span className="sp-ph">{value}</span>{suffix && <sup>{suffix}</sup>}</b><span>{label}</span></div>
            ))}
          </div>
        </div></section>

        <div className="sp-ticker" aria-hidden="true"><div className="sp-track">
          {[0, 1].flatMap(round => tickerWords.flatMap(([en, ta]) => [
            <span key={`${round}-${en}`}>{en}</span>,
            <span key={`${round}-${en}-s1`} className="sp-star">✦</span>,
            <span key={`${round}-${ta}`} className="sp-ta">{ta}</span>,
            <span key={`${round}-${en}-s2`} className="sp-star">✦</span>,
          ]))}
        </div></div>

        {/* ABOUT */}
        <section className="sp-about" id="about"><div className="sp-wrap sp-about-grid">
          <div className="sp-about-photo sp-rv">
            <div className="sp-frame"><Image src="/images/sp-velumani-portrait-2.jpg" alt="S. P. Velumani portrait" width={1603} height={2400} sizes="(max-width: 1000px) 100vw, 45vw" /></div>
            <div className="sp-since"><b>Thondamuthur</b><span>Constituency · Coimbatore</span></div>
          </div>
          <div className="sp-rv">
            <div className="sp-eyebrow">About S. P. Velumani</div>
            <h2 className="sp-h2">A journey in public service</h2>
            <div className="sp-ta-sub" lang="ta">மக்கள் சேவையில் ஒரு பயணம்</div>
            <blockquote className="sp-quote">“From grassroots politics to <em>ministerial responsibility</em> — leadership earned through the people’s trust.”</blockquote>
            <p><b>S. P. Velumani</b> is a prominent AIADMK leader with extensive experience in electoral politics, government administration and public service.</p>
            <p>His career brings together political leadership and administrative experience, and he continues to represent people’s concerns and contribute to the future of Tamil Nadu.</p>
            <div className="sp-sig"><div><b>S. P. VELUMANI</b><span>Senior Leader, AIADMK · Member of the TN Legislative Assembly</span></div></div>
          </div>
        </div></section>

        {/* LEADERSHIP */}
        <section className="sp-lead-sec" id="leadership"><div className="sp-wrap">
          <div className="sp-sec-head sp-rv">
            <div><div className="sp-eyebrow">Leadership journey</div><h2 className="sp-h2">From grassroots<br />to state leadership</h2><div className="sp-ta-sub" lang="ta">அடித்தளத்திலிருந்து மாநிலத் தலைமை வரை</div></div>
            <p>Leadership is built through experience, responsibility and people’s trust.</p>
          </div>
          <div className="sp-timeline">
            {leadership.map(([ta, title, text], i) => (
              <div className="sp-step sp-rv" key={title}><span className="sp-node">{String(i + 1).padStart(2, "0")}</span><span className="sp-ta" lang="ta">{ta}</span><h3>{title}</h3><p>{text}</p></div>
            ))}
          </div>
        </div></section>

        {/* ACHIEVEMENTS */}
        {achievementList.length ? (
          <section className="sp-ach-sec" id="achievements"><div className="sp-ach-wm" aria-hidden="true">சாதனைகள்</div><div className="sp-wrap">
            <div className="sp-sec-head sp-rv">
              <div><div className="sp-eyebrow">Achievements</div><h2 className="sp-h2">Work that speaks<br />for itself</h2><div className="sp-ta-sub" lang="ta">சாதனைகள்</div></div>
              <div className="sp-ach-head-side">
                <p>Water security, urban infrastructure, rural development and national recognition — {achievementList.length} milestones from a life in public service.</p>
                <PlainLink href="/achievements" className="sp-btn sp-btn-ghost">View all achievements <Arrow /></PlainLink>
              </div>
            </div>
            <div className="sp-ach-stats sp-rv">
              {[
                [String(achievementList.length), "Milestones in public service"],
                ["₹1,652 Cr", "Athikadavu–Avinashi water scheme"],
                ["158 km", "Of the Noyyal river rejuvenated"],
                ["7 yrs", "As Rural Development Minister"],
              ].map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}
            </div>
          </div>
          <div className="sp-rv">
            <LanguageProvider>
              <AchievementRail count={achievementList.length} label="Achievements. Scroll sideways to see more.">
                {achievementList.map((item, i) => <AchievementCard key={item.id} item={item} index={i} />)}
              </AchievementRail>
            </LanguageProvider>
          </div></section>
        ) : null}

        {/* VISION */}
        <section className="sp-vision" id="vision"><div className="sp-wrap">
          <div className="sp-sec-head sp-rv">
            <div><div className="sp-eyebrow">Vision for Tamil Nadu</div><h2 className="sp-h2">Building a stronger<br />Tamil Nadu</h2><div className="sp-ta-sub" lang="ta" style={{ color: "#8a837c" }}>வலிமையான தமிழ்நாட்டை உருவாக்குவோம்</div></div>
            <p>Economically strong, socially inclusive and full of opportunity for every generation.</p>
          </div>
          <div className="sp-vgrid sp-rv">
            {vision.map((card, i) => (
              <div className="sp-vcard" key={card.title}>
                <Image className="sp-bg" src={`/images/vision/${card.img}.jpg`} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw" />
                <div className="sp-top"><span className="sp-num">V / {String(i + 1).padStart(2, "0")}</span><span className="sp-cap">📷 {card.cap}</span></div>
                <svg viewBox="0 0 24 24" aria-hidden="true">{card.icon}</svg>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
          <div className="sp-vgrid-note">Sample photos from Wikimedia Commons (PIB, GODL-India). Replace with the office’s own scheme-delivery photographs.</div>
        </div></section>

        {/* CONSTITUENCY */}
        <section className="sp-const"><div className="sp-wm" aria-hidden="true">தொண்டாமுத்தூர்</div><div className="sp-wrap sp-const-grid">
          <div className="sp-const-copy sp-rv">
            <div className="sp-eyebrow">Thondamuthur · <span lang="ta">தொண்டாமுத்தூர்</span></div>
            <h2 className="sp-h2">A constituency<br />close to the heart</h2>
            <p>Thondamuthur remains central to S. P. Velumani’s political journey and grassroots engagement.</p>
            <div className="sp-chips">
              {chips.map(({ label, icon }) => <PlainLink className="sp-chip" href="#gallery" key={label}><svg viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>{label}</PlainLink>)}
            </div>
            <PlainLink href="#gallery" className="sp-btn sp-btn-white">Explore Thondamuthur <Arrow /></PlainLink>
          </div>
          <div className="sp-const-art sp-rv">
            <div className="sp-ring"><Image src="/images/aiadmk-emblem-transparent.png" alt="" width={640} height={640} /></div>
            <Image className="sp-cut" src="/images/sp-velumani-studio-namaste-cutout.png" alt="S. P. Velumani greeting" width={1600} height={2400} sizes="(max-width: 1000px) 300px, 380px" />
          </div>
        </div></section>

        {/* NEWS */}
        <section id="news"><div className="sp-wrap">
          <div className="sp-sec-head sp-rv">
            <div><div className="sp-eyebrow">News &amp; updates</div><h2 className="sp-h2">Latest from<br />S. P. Velumani</h2><div className="sp-ta-sub" lang="ta">சமீபத்திய செய்திகள்</div></div>
            <PlainLink href="/blog" className="sp-btn sp-btn-ghost">Read all posts <Arrow /></PlainLink>
          </div>
          <Filters items={["All", ...newsCategories]} />
          <div className="sp-news-grid">
            <PlainLink href={featured.href} className="sp-feat sp-rv">
              <NewsImage item={featured} width={1080} />
              <div className="sp-in"><span className="sp-tag">{featured.tag}</span><h3>{featured.title}</h3><div className="sp-meta">{featured.meta}</div></div>
            </PlainLink>
            <div className="sp-nlist">
              {rest.map(item => (
                <PlainLink href={item.href} className="sp-nitem sp-rv" key={item.href + item.title}>
                  <NewsImage item={item} width={220} />
                  <div><span className="sp-tag">{item.tag}</span><h4>{item.title}</h4><div className="sp-meta">{item.meta}</div></div>
                </PlainLink>
              ))}
            </div>
          </div>
        </div></section>

        {/* GALLERY */}
        <section className="sp-gal-sec" id="gallery"><div className="sp-wrap">
          <div className="sp-sec-head sp-rv">
            <div><div className="sp-eyebrow">Media &amp; gallery</div><h2 className="sp-h2">Moments of<br />leadership</h2><div className="sp-ta-sub" lang="ta">தலைமையின் தருணங்கள்</div></div>
            <p>Public moments from across his political journey, community engagement and party programmes.</p>
          </div>
          <Filters items={["All", "Political Events", "Public Meetings", "People’s Interactions", "Constituency Visits", "Party Programmes", "Speeches"]} />
          <div className="sp-masonry">
            {gallery.map(([src, caption, alt], i) => (
              <figure className={`sp-gitem sp-rv${i === 0 ? " sp-red" : ""}`} key={src}>
                <Image src={src} alt={alt} width={1600} height={2400} sizes="(max-width: 600px) 50vw, 25vw" />
                <figcaption>{caption}</figcaption>
              </figure>
            ))}
          </div>
        </div></section>

        {/* CONNECT */}
        <section id="connect"><div className="sp-wrap sp-connect-grid">
          <div className="sp-cpanel sp-rv">
            <div className="sp-eyebrow">Connect with the leader</div>
            <h2 className="sp-h2">Your voice<br />matters</h2>
            <div className="sp-ta-sub" lang="ta">உங்கள் குரல் முக்கியம்</div>
            <p>Leadership begins with listening. Whether you have a suggestion, concern, idea or message, your voice deserves to be heard.</p>
            <div className="sp-clist">
              <PlainLink href="#connect" className="sp-wa"><span className="sp-ic"><svg viewBox="0 0 24 24"><path d="M4 20l1.3-4A8 8 0 1 1 8 19z" /></svg></span><span><small>WhatsApp helpline</small><b>+91 XXXXX XXXXX</b></span></PlainLink>
              <PlainLink href="#connect"><span className="sp-ic"><svg viewBox="0 0 24 24"><path d="M3 5h18v14H3zM3 5l9 7 9-7" /></svg></span><span><small>Email the office</small><b>office@example.in</b></span></PlainLink>
              <PlainLink href="#connect"><span className="sp-ic"><svg viewBox="0 0 24 24"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg></span><span><small>Constituency office</small><b>Thondamuthur, Coimbatore</b></span></PlainLink>
            </div>
          </div>
          <ConnectForm />
        </div></section>

        <div className="sp-band"><div className="sp-wrap"><div className="sp-box sp-rv">
          <div><h2>Together, we build<br />the future</h2><span className="sp-ta" lang="ta">ஒன்றிணைந்து எதிர்காலத்தை உருவாக்குவோம்</span></div>
          <PlainLink href="#connect" className="sp-btn">Connect with us <Arrow /></PlainLink>
        </div></div></div>
      </main>

      <SiteBottom onHome />
    </div>
  );
}
