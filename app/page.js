// ============================================================
// SAFETALK AI
// PUBLIC HOME PAGE
// SCREENSHOT MATCHED HERO DESIGN
// ============================================================

import Link from "next/link";

import {
  ArrowRight,
  Play,
  Smile,
  TriangleAlert,
  Skull,
  Users,
  Globe2,
  BadgeCheck,
  Languages,
  BrainCircuit,
  ShieldCheck,
  Sparkles,
  MessageSquareText,
  ChartNoAxesCombined,
} from "lucide-react";

import PublicNavbar
  from "@/components/public/PublicNavbar";

import PublicAnalysisSection
  from "@/components/public/PublicAnalysisSection";

import PublicFooter
  from "@/components/public/PublicFooter";


// ============================================================
// FEATURE STRIP
// ============================================================

const features = [

  {
    title:
      "Sentiment Analysis",

    description:
      "Understand emotions in text",

    icon:
      Smile,

    className:
      "sentiment",
  },

  {
    title:
      "Threat Detection",

    description:
      "Detect harmful intentions",

    icon:
      TriangleAlert,

    className:
      "threat",
  },

  {
    title:
      "Toxicity Detection",

    description:
      "Identify toxic content",

    icon:
      Skull,

    className:
      "toxicity",
  },

  {
    title:
      "Hate Speech",

    description:
      "Detect hate and offensive language",

    icon:
      Users,

    className:
      "hate",
  },

  {
    title:
      "Multilingual Support",

    description:
      "Urdu, English, Hindi and more",

    icon:
      Globe2,

    className:
      "language",
  },

  {
    title:
      "Explainable AI",

    description:
      "See why the result was predicted",

    icon:
      BadgeCheck,

    className:
      "explain",
  },

];


// ============================================================
// HOME PAGE
// ============================================================

export default function HomePage() {

  return (

    <div className="public-site">


      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <PublicNavbar />


      {/* ======================================================
          HERO
      ====================================================== */}

      <main
        id="home"
        className="reference-hero"
      >

        {/* ====================================================
            DECORATIVE BACKGROUND
        ==================================================== */}

        <div className="reference-hero-overlay">
        </div>

        <div className="reference-hero-top-lines">
        </div>


        {/* ====================================================
            HERO MAIN CONTENT
        ==================================================== */}

        <div className="reference-hero-inner">


          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <section className="reference-hero-copy">


            {/* EYEBROW */}

            <div className="reference-eyebrow">

              <Sparkles size={16} />

              <span>
                REAL-TIME AI MODERATION
              </span>

            </div>


            {/* MAIN HEADING */}

            <h1>

              <span className="hero-white-line">
                Safer
              </span>

              <span className="hero-white-line">
                Conversations
              </span>

              <span className="hero-gradient-line">
                Stronger
              </span>

              <span className="hero-gradient-line">
                Communities
              </span>

            </h1>


            {/* DESCRIPTION */}

            <p className="reference-hero-description">

              Detect sentiment, threats, toxicity,
              hate speech and risk levels using
              advanced AI models.

              <br />

              Multilingual support with explainable
              results.

            </p>


            {/* BUTTONS */}

            <div className="reference-hero-actions">


              <a
                href="#analyze"
                className="reference-start-button"
              >

                Start Analyzing

                <ArrowRight size={18} />

              </a>


              <a
                href="#how-it-works"
                className="reference-video-button"
              >

                <span className="reference-play-icon">

                  <Play
                    size={14}
                    fill="currentColor"
                  />

                </span>

                Watch Video

              </a>

            </div>


            {/* TRUST */}

            <div className="reference-trust-row">

              <div className="reference-avatar-stack">

                <div className="reference-avatar avatar-one">
                  A
                </div>

                <div className="reference-avatar avatar-two">
                  D
                </div>

                <div className="reference-avatar avatar-three">
                  E
                </div>

                <div className="reference-avatar avatar-four">
                  +
                </div>

              </div>


              <p>

                Trusted by developers, educators

                <br />

                and online communities.

              </p>

            </div>

          </section>


          {/* ==================================================
              RIGHT SIDE
              banner.png STATIC IMAGE
          ================================================== */}

          <section className="reference-globe-area">


            {/* STATIC IMAGE */}

            <div className="reference-globe-image">
            </div>


            {/* =================================================
                POSITIVE
            ================================================= */}

            <div className="reference-ai-badge badge-positive">

              <div className="badge-symbol">
                😊
              </div>

              <span>
                Positive
              </span>

            </div>


            {/* =================================================
                TOXIC
            ================================================= */}

            <div className="reference-ai-badge badge-toxic">

              <div className="badge-symbol">
                ☠
              </div>

              <span>
                Toxic
              </span>

            </div>


            {/* =================================================
                THREAT
            ================================================= */}

            <div className="reference-ai-badge badge-threat">

              <div className="badge-symbol">
                ⚠
              </div>

              <span>
                Threat
              </span>

            </div>


            {/* =================================================
                HATE SPEECH
            ================================================= */}

            <div className="reference-ai-badge badge-hate">

              <div className="badge-symbol">
                👥
              </div>

              <span>
                Hate Speech
              </span>

            </div>


            {/* =================================================
                LANGUAGE BUBBLES
            ================================================= */}

            <div className="reference-language-bubble bubble-hello">

              Hello

            </div>


            <div className="reference-language-bubble bubble-hola">

              Hola

            </div>


            <div className="reference-language-bubble bubble-japanese">

              こんにちは

            </div>


            <div className="reference-language-bubble bubble-english">

              English

            </div>


            <div className="reference-language-bubble bubble-urdu">

              اردو

            </div>


            <div className="reference-language-bubble bubble-arabic">

              عربي

            </div>


            <div className="reference-language-bubble bubble-hindi">

              हिन्दी

            </div>


            {/* CHAT DOTS */}

            <div className="reference-chat-dot chat-one">

              •••

            </div>


            <div className="reference-chat-dot chat-two">

              •••

            </div>

          </section>

        </div>


        {/* ====================================================
            FEATURE STRIP
        ==================================================== */}

        <div
          id="features"
          className="reference-feature-strip"
        >

          {features.map(
            (feature) => {

              const Icon =
                feature.icon;


              return (

                <div
                  key={feature.title}
                  className="reference-feature-item"
                >

                  <div
                    className={`reference-feature-icon ${feature.className}`}
                  >

                    <Icon size={23} />

                  </div>


                  <div className="reference-feature-text">

                    <h3>
                      {feature.title}
                    </h3>


                    <p>
                      {feature.description}
                    </p>

                  </div>

                </div>

              );

            }
          )}

        </div>

      </main>


      {/* ======================================================
          HOW IT WORKS
      ====================================================== */}

      <section
        id="how-it-works"
        className="public-section"
      >

        <div className="public-section-heading">

          <span>
            HOW IT WORKS
          </span>


          <h2>
            From text to intelligent insights
          </h2>


          <p>

            SafeTalkAI analyzes multilingual
            content through a simple four-step
            process.

          </p>

        </div>


        <div className="public-process-grid">


          <div className="public-process-card">

            <span>
              01
            </span>

            <MessageSquareText size={30} />

            <h3>
              Enter Text
            </h3>

            <p>
              Paste social media text or
              conversation content.
            </p>

          </div>


          <div className="public-process-card">

            <span>
              02
            </span>

            <Languages size={30} />

            <h3>
              Detect Language
            </h3>

            <p>
              English, Urdu or Roman Urdu is
              identified.
            </p>

          </div>


          <div className="public-process-card">

            <span>
              03
            </span>

            <BrainCircuit size={30} />

            <h3>
              AI Analysis
            </h3>

            <p>
              AI evaluates sentiment, threats,
              toxicity and hate speech.
            </p>

          </div>


          <div className="public-process-card">

            <span>
              04
            </span>

            <ChartNoAxesCombined size={30} />

            <h3>
              Risk Result
            </h3>

            <p>
              Receive risk score, categories
              and explainable results.
            </p>

          </div>

        </div>

      </section>


      {/* ======================================================
          LANGUAGES
      ====================================================== */}

      <section
        id="languages"
        className="public-language-section"
      >

        <div>

          <span className="public-section-tag">

            MULTILINGUAL AI

          </span>


          <h2>

            One platform.

            <br />

            Multiple languages.

          </h2>


          <p>

            SafeTalkAI is designed for multilingual
            social media conversations.

          </p>

        </div>


        <div className="public-language-grid">


          <div>

            <strong>
              English
            </strong>

            <span>
              Hello, how are you?
            </span>

          </div>


          <div>

            <strong>
              اردو
            </strong>

            <span>
              آپ کیسے ہیں؟
            </span>

          </div>


          <div>

            <strong>
              Roman Urdu
            </strong>

            <span>
              Aap kaise hain?
            </span>

          </div>

        </div>

      </section>


      {/* ======================================================
          PUBLIC TEXT ANALYSIS
      ====================================================== */}

      <PublicAnalysisSection />

{/* ======================================================
    ABOUT
====================================================== */}

<section
  id="about"
  className="public-about-section public-about-upgraded"
>

  <div className="public-about-top">

    <div className="public-about-icon">

      <ShieldCheck size={38} />

    </div>


    <div className="public-about-copy">

      <span>
        ABOUT SAFETALKAI
      </span>


      <h2>
        AI for safer online interactions
      </h2>


      <p>
        SafeTalkAI is an AI-based multilingual
        social media analysis system designed
        to identify sentiment, harmful language,
        threats, toxicity and risk while providing
        explainable results.
      </p>

    </div>

  </div>


  {/* ====================================================
      ABOUT INFO CARDS
  ==================================================== */}

  <div className="public-about-grid">

    <div className="public-about-card">

      <div className="public-about-card-icon blue">
        <BrainCircuit size={23} />
      </div>

      <h3>
        AI-Powered Analysis
      </h3>

      <p>
        Analyze text for sentiment, threat
        categories, toxicity, hate speech
        and overall risk.
      </p>

    </div>


    <div className="public-about-card">

      <div className="public-about-card-icon purple">
        <Languages size={23} />
      </div>

      <h3>
        Multilingual Support
      </h3>

      <p>
        Designed for English, Urdu and
        Roman Urdu social media content.
      </p>

    </div>


    <div className="public-about-card">

      <div className="public-about-card-icon green">
        <ShieldCheck size={23} />
      </div>

      <h3>
        Safer Communities
      </h3>

      <p>
        Help users and moderators identify
        potentially harmful conversations
        more effectively.
      </p>

    </div>


    <div className="public-about-card">

      <div className="public-about-card-icon cyan">
        <Sparkles size={23} />
      </div>

      <h3>
        Explainable Results
      </h3>

      <p>
        Show important words, confidence
        scores and reasons behind AI results.
      </p>

    </div>

  </div>


  {/* ====================================================
      ABOUT STATS
  ==================================================== */}

  <div className="public-about-stats">

    <div>
      <strong>3</strong>
      <span>Supported Languages</span>
    </div>

    <div>
      <strong>8+</strong>
      <span>Threat Categories</span>
    </div>

    <div>
      <strong>5</strong>
      <span>Core AI Outputs</span>
    </div>

    <div>
      <strong>24/7</strong>
      <span>Analysis Availability</span>
    </div>

  </div>

</section>


{/* ======================================================
    PRE-FOOTER CTA
====================================================== */}

<section className="public-prefooter-cta">

  <div>

    <span>
      READY TO ANALYZE?
    </span>

    <h2>
      Make conversations safer with SafeTalkAI
    </h2>

    <p>
      Sign in and start analyzing multilingual
      social media text for harmful content.
    </p>

  </div>


  <a
    href="#analyze"
    className="public-prefooter-button"
  >
    Start Analyzing
    <ArrowRight size={18} />
  </a>

</section>
      {/* ======================================================
          FOOTER
      ====================================================== */}

      <PublicFooter />

    </div>

  );
}