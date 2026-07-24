/* NOVU — Casa de Vó Editorial: hero emocional com o filme "Eu, o Vestido" em
   destaque, manchete afetiva com itálico Fraunces, linha de alinhavo animada. */
import { useEffect, useRef, useState } from "react";
import { Reveal, SwingTag } from "./primitives";

// URL CDN pública e permanente — funciona em qualquer hospedagem
// (Vercel/novuapp.com.br e Manus/manus.space).
const HERO_VIDEO_SRC =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029189551/FBtWTsGdJXWPwcvV.mp4";

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    if (muted) {
      v.muted = false;
      v.currentTime = 0;
      v.play();
      setMuted(false);
    } else {
      v.muted = true;
      setMuted(true);
    }
  };

  return (
    <div className="relative rounded-[4px] overflow-hidden shadow-[0_20px_50px_-20px_rgba(40,50,30,0.4)] rotate-[1.2deg] bg-[#1d1a14]">
      <video
        ref={videoRef}
        src={HERO_VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label='Filme "Eu, o Vestido" — a história de um vestido contada por ele mesmo, da primeira dona ao reparo pelas mãos de uma costureira NOVU'
        className="w-full h-[340px] sm:h-[420px] object-cover"
      />
      {/* Vinheta sutil para integrar o vídeo ao papel do site */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 60px rgba(40, 35, 20, 0.35)",
        }}
        aria-hidden
      />
      <button
        type="button"
        onClick={toggleSound}
        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 bg-[rgba(28,24,16,0.72)] backdrop-blur-sm text-[#f3ecdd] text-xs font-semibold tracking-wide px-3.5 py-2 rounded-full border border-[rgba(243,236,221,0.25)] transition-all duration-150 hover:bg-[rgba(28,24,16,0.9)] active:scale-[0.96]"
        aria-pressed={!muted}
      >
        {muted ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
            Assistir com som
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
            Silenciar
          </>
        )}
      </button>
    </div>
  );
}

function StitchPath() {
  const ref = useRef<SVGPathElement>(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 350);
    return () => clearTimeout(t);
  }, []);
  return (
    <svg
      className="absolute left-0 right-0 bottom-10 w-full h-16 pointer-events-none hidden lg:block"
      viewBox="0 0 1200 60"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        ref={ref}
        d="M-10 40 C 200 10, 420 55, 640 30 S 1050 15, 1210 38"
        stroke="var(--needle)"
        strokeWidth="1.6"
        strokeDasharray="10 7"
        style={{
          strokeDashoffset: drawn ? 0 : 1700,
          transition: "stroke-dashoffset 2.4s cubic-bezier(0.23, 1, 0.32, 1)",
          opacity: 0.55,
        }}
        pathLength={1700}
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 paper-grain overflow-hidden">
      <div className="container relative grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
        <div className="lg:col-span-7 relative z-10">
          <Reveal>
            <p className="label-tag text-needle mb-5 flex items-center gap-3">
              <span className="baste-line w-10 inline-block" />
              Reparo de roupas com carinho, de porta em porta
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display text-[2.5rem] sm:text-6xl lg:text-[4rem] leading-[1.06] font-semibold text-foreground tracking-tight">
              Tem roupa que guarda abraço.{" "}
              <em className="text-needle">Essas, a gente não descarta — a gente cuida.</em>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-7 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
              A <strong className="text-foreground font-semibold">NOVU</strong> busca,
              repara e devolve suas peças queridas pelas mãos de costureiras que
              vivem dignamente do seu ofício. O vestido da sua mãe pode ser o
              vestido da sua filha — e a jaqueta do seu pai, a do seu filho.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#reparar"
                className="inline-flex items-center gap-2 bg-needle text-primary-foreground font-semibold px-6 py-3.5 rounded-[3px] transition-transform duration-150 active:scale-[0.97] hover:bg-needle-deep"
              >
                Quero reparar uma peça
              </a>
              <a
                href="#costureiras"
                className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-[3px] baste-border text-needle hover:bg-accent transition-colors duration-150 active:scale-[0.97]"
              >
                Sou costureira, quero costurar com a NOVU
              </a>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-5 relative">
          <Reveal delay={200} className="relative">
            <HeroVideo />
            <div className="absolute -bottom-8 -left-6 sm:-left-10 z-10">
              <SwingTag value='"Eu, o Vestido"' label="uma história contada pela própria roupa" accent />
            </div>
          </Reveal>
        </div>
      </div>
      <StitchPath />
    </section>
  );
}
