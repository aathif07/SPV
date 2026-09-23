import Image from "next/image";
import { NameMark } from "./name-mark";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <Image
          className="footer-emblem"
          src="/images/aiadmk-emblem-transparent.png"
          alt=""
          aria-hidden="true"
          width={1254}
          height={1254}
        />
        <p className="section-label">Together, We Build the Future</p>
        <h2>Leadership. Service. Tamil Nadu.</h2>
        <div className="footer-copy">
          <p>
            Empowering people, creating opportunity and strengthening communities across
            Tamil Nadu.
          </p>
        </div>
        <p className="signature">
          <NameMark />
        </p>
        <a className="button footer-button" href="/#connect">
          Connect With Us <span>↗</span>
        </a>
      </div>
      <div className="footer-bottom">
        <span>SPV</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
