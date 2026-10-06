// ============================================================
// SAFETALK AI
// PUBLIC FOOTER - REDESIGNED
// ============================================================

import Image from "next/image";

import {
  Code2,
  Mail,
  ShieldCheck,
  BrainCircuit,
  Languages,
  MessageSquareText,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";


export default function PublicFooter() {

  return (

    <footer className="public-footer-new">

      <div className="public-footer-new-container">


        {/* ====================================================
            TOP FOOTER
        ==================================================== */}

        <div className="public-footer-new-grid">


          {/* ==================================================
              BRAND
          ================================================== */}

          <div className="footer-brand-new">

            <div className="footer-brand-new-header">

              <Image
                src="/images/safetalk-logo2.png"
                alt="SafeTalkAI"
                width={90}
                height={75}
              />


              <div>

                <h3>
                  SafeTalkAI
                </h3>

                <span>
                  ANALYZE • DETECT • PROTECT
                </span>

              </div>

            </div>


            <p className="footer-brand-new-description">

              AI-powered multilingual social media
              moderation system for sentiment,
              threats, toxicity, hate speech and
              explainable risk analysis.

            </p>


            <div className="footer-status-new">

              <span>
              </span>

              Analysis System Ready

            </div>


            <div className="footer-brand-feature-new">

              <Sparkles size={16} />

              Building safer digital communities
              with intelligent content analysis.

            </div>

          </div>


          {/* ==================================================
              QUICK LINKS
          ================================================== */}

          <div className="footer-column-new">

            <h4>
              Quick Links
            </h4>


            <a href="/#home">
              Home
            </a>

            <a href="/#features">
              Features
            </a>

            <a href="/#how-it-works">
              How It Works
            </a>

            <a href="/#analyze">
              Analyze Text
            </a>

            <a href="/#about">
              About
            </a>

          </div>


          {/* ==================================================
              AI CAPABILITIES
          ================================================== */}

          <div className="footer-column-new">

            <h4>
              AI Capabilities
            </h4>


            <div className="footer-capability-new">

              <MessageSquareText size={17} />

              <span>
                Sentiment Analysis
              </span>

            </div>


            <div className="footer-capability-new">

              <ShieldCheck size={17} />

              <span>
                Threat Detection
              </span>

            </div>


            <div className="footer-capability-new">

              <BrainCircuit size={17} />

              <span>
                Toxicity & Hate Speech
              </span>

            </div>


            <div className="footer-capability-new">

              <Languages size={17} />

              <span>
                Multilingual Analysis
              </span>

            </div>


            <div className="footer-capability-new">

              <Code2 size={17} />

              <span>
                Explainable AI
              </span>

            </div>

          </div>


          {/* ==================================================
              PROJECT
          ================================================== */}

          <div className="footer-column-new footer-project-new">

            <h4>
              Project
            </h4>


            <p>

              Final Year Project focused on
              multilingual AI moderation and
              safer online communication.

            </p>


            <a
              href="mailto:contact@safetalk.ai"
              className="footer-contact-new"
            >

              <Mail size={17} />

              Contact Us

              <ArrowUpRight size={15} />

            </a>


            <div className="footer-icons-new">

              <div title="Security">
                <ShieldCheck size={19} />
              </div>

              <div title="Artificial Intelligence">
                <BrainCircuit size={19} />
              </div>

              <div title="Development">
                <Code2 size={19} />
              </div>

            </div>

          </div>

        </div>


        {/* ====================================================
            DIVIDER
        ==================================================== */}

        <div className="footer-divider-new">
        </div>


        {/* ====================================================
            BOTTOM
        ==================================================== */}

        <div className="footer-bottom-new">

          <p>
            © 2026 SafeTalkAI. All rights reserved.
          </p>


          <div className="footer-languages-new">

            <span>
              English
            </span>

            <span>
              Urdu
            </span>

            <span>
              Roman Urdu
            </span>

          </div>

        </div>

      </div>

    </footer>

  );
}