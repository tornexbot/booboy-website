"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, Ghost, Copy, Check, ExternalLink } from "lucide-react";
import Image from "next/image";

// ---- Config (edit these safely)
const CA = "GvaqCBjYsFhsoRSpHzPfU5XoR8be2KdkJD4bc5d2pump"; // BOOBOY contract address (Solana)
const JUP_URL = `https://jup.ag/swap/SOL-${CA}`; // Correct Jupiter format
const DEX_URL = `https://dexscreener.com/solana/${CA}`;
const X_URL = "https://x.com/Hodlposse";
const TG_URL = "https://t.me/hodlpossearmy";
const WEBSITE = "BooBoy.live"; // display only

// Your meme images
const STATIC_MEMES = [
  "https://i.ibb.co/RF9SNwv/photo-2025-10-18-22-57-13.jpg",
  "https://i.ibb.co/ynHNzrcf/photo-2025-10-18-22-57-12-2.jpg",
  "https://i.ibb.co/HDdHfkNk/photo-2025-10-18-22-57-11-3.jpg",
  "https://i.ibb.co/GysShb8/photo-2025-10-18-22-57-11.jpg",
  "https://i.ibb.co/knzZjQb/photo-2025-10-18-22-57-10-2.jpg",
  "https://i.ibb.co/WWryzLLm/photo-2025-10-18-22-57-10.jpg",
  "https://i.ibb.co/wFY8cdsw/photo-2025-10-18-22-57-09.jpg",
  "https://i.ibb.co/9mVtsk6t/photo-2025-10-18-22-57-08-2.jpg",
  "https://i.ibb.co/5WR7YG3J/photo-2025-10-18-22-57-07-3.jpg",
  "https://i.ibb.co/TM7S5MCF/photo-2025-10-18-22-57-07.jpg"
];

// Hero image
const HERO_IMAGE = "https://i.ibb.co/tPHdjHZd/photo-2025-10-18-22-56-34.jpg";

// Slider behavior
const MEME_AUTOPLAY_MS = 4000;

// Small helper to create a subtle neon text glow
const glow = (color = "#ff3b3b") => ({ textShadow: `0 0 6px ${color}, 0 0 12px ${color}` });

// Type definitions
interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

interface CopyButtonProps {
  text: string;
}

interface StatProps {
  label: string;
  value: string;
}

const Section = ({ id, children, className = "" }: SectionProps) => (
  <section id={id} className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </section>
);

// ---- Image selection helper
const getHeroImage = (): string => {
  if (typeof window === "undefined") return HERO_IMAGE;
  
  try { 
    const p = new URLSearchParams(window.location.search); 
    const u = p.get("img"); 
    if (u) return u; 
  } catch {}
  
  try { 
    const ls = localStorage.getItem("booboy_img"); 
    if (ls) return ls; 
  } catch {}
  
  return HERO_IMAGE;
};

// ---- Copy button for contract address
const CopyButton = ({ text }: CopyButtonProps) => {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  
  const onCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text; 
        ta.style.position = "fixed"; 
        ta.style.opacity = "0"; 
        document.body.appendChild(ta);
        ta.select(); 
        document.execCommand("copy"); 
        document.body.removeChild(ta);
      }
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("failed");
      setTimeout(() => setStatus("idle"), 1500);
    }
  };
  
  const label = status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy CA";
  
  return (
    <Button onClick={onCopy} variant="secondary" className="rounded-xl h-9 gap-2 text-xs sm:text-sm" aria-live="polite" aria-label="Copy contract address">
      {status === "copied" ? <Check className="h-3 w-3 sm:h-4 sm:w-4"/> : <Copy className="h-3 w-3 sm:h-4 sm:w-4"/>}
      <span className="hidden xs:inline">{label}</span>
      <span className="xs:hidden">Copy</span>
    </Button>
  );
};

const Nav = () => {
  const [open, setOpen] = useState(false);
  const items = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#memes", label: "Memes" },
    { href: "#token", label: "Tokenomics" },
    { href: "#howtobuy", label: "HOW TO BUY" },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur border-b border-white/10 bg-black/50 supports-[backdrop-filter]:bg-black/50">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-2 group flex-shrink-0">
          <Ghost className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="font-black tracking-wider text-lg sm:text-xl" style={{ textShadow: glow("#9efcfd").textShadow }}>BOOBOY</span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm">
          {items.map((it) => (
            <a key={it.href} href={it.href} className="hover:underline underline-offset-8 whitespace-nowrap">
              {it.label}
            </a>
          ))}
          <div className="flex items-center gap-3 xl:gap-4">
            <a href={X_URL} target="_blank" rel="noreferrer" aria-label="X/Twitter" className="opacity-90 hover:opacity-100 inline-flex items-center gap-1 text-xs">
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4"/>X
            </a>
            <a href={TG_URL} target="_blank" rel="noreferrer" aria-label="Telegram" className="opacity-90 hover:opacity-100 text-xs whitespace-nowrap">
              Telegram
            </a>
            <Button className="rounded-2xl text-xs h-9 px-3 sm:px-4" asChild>
              <a href={JUP_URL} target="_blank" rel="noreferrer">Buy Now</a>
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation Button */}
        <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" onClick={() => setOpen(!open)}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {open && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 grid gap-3">
            {items.map((it) => (
              <a key={it.href} href={it.href} className="py-2 text-sm hover:bg-white/5 rounded-lg px-3 transition-colors" onClick={() => setOpen(false)}>
                {it.label}
              </a>
            ))}
            <div className="flex items-center gap-4 py-2 px-3 border-t border-white/10 pt-4">
              <a href={X_URL} target="_blank" rel="noreferrer" className="hover:underline text-sm">X/Twitter</a>
              <a href={TG_URL} target="_blank" rel="noreferrer" className="hover:underline text-sm">Telegram</a>
            </div>
            <Button asChild className="rounded-xl w-full mt-2">
              <a href={JUP_URL} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Buy Now</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

const Hero = () => (
  <div id="home" className="relative overflow-hidden">
    <div className="absolute inset-0 -z-10 [background:radial-gradient(circle_at_30%_20%,rgba(255,85,85,.25),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,165,0,.15),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(120,0,255,.15),transparent_35%)]"/>
    <Section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: .6 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight sm:leading-tight lg:leading-tight">
            Halloween Vibes,{" "}
            <span className="text-orange-400 block sm:inline" style={{ textShadow: glow("#ff7b00").textShadow }}>
              Crypto Thrills
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-white/80 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0">
            BOOBOY ($BOO) is a playful, spooky-season memecoin site. Minimal, modern, and fast—crafted for conversions and vibes.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col xs:flex-row gap-3 justify-center lg:justify-start">
            <Button className="rounded-2xl text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8" asChild>
              <a href={JUP_URL} target="_blank" rel="noreferrer">Buy Now</a>
            </Button>
            <Button variant="secondary" className="rounded-2xl text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8" asChild>
              <a href={DEX_URL} target="_blank" rel="noreferrer">DEXScreener</a>
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center lg:justify-start gap-4 text-sm text-white/80 flex-wrap">
            <a href={X_URL} target="_blank" rel="noreferrer" className="underline hover:text-white transition-colors">X/Twitter</a>
            <a href={TG_URL} target="_blank" rel="noreferrer" className="underline hover:text-white transition-colors">Telegram</a>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: .95 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true }} 
          transition={{ duration: .6, delay: .1 }} 
          className="relative order-first lg:order-last"
        >
          <div className="absolute -inset-2 sm:-inset-3 md:-inset-4 rounded-2xl sm:rounded-3xl blur-xl opacity-40" 
               style={{ background: "conic-gradient(from 180deg at 50% 50%, #ff4d4d, #ffaa00, #6b21a8, #0ea5e9, #ff4d4d)" }} />
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black aspect-square max-w-md mx-auto">
            <Image 
              src={getHeroImage()} 
              alt="BOOBOY artwork" 
              width={500}
              height={500}
              className="w-full h-full object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
          </div>
          <p className="text-center text-xs text-white/50 mt-3">The Ghost of Gains Past & Future</p>
        </motion.div>
      </div>
    </Section>
  </div>
);

const Stat = ({ label, value }: StatProps) => (
  <Card className="bg-black/40 border-white/10 h-full">
    <CardContent className="p-4 sm:p-6 text-center">
      <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold" style={{ textShadow: glow().textShadow }}>{value}</div>
      <div className="text-xs sm:text-sm text-white/70 mt-1 sm:mt-2">{label}</div>
    </CardContent>
  </Card>
);

const Tokenomics = () => (
  <Section id="token" className="py-12 sm:py-16 md:py-20 lg:py-24">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center">Tokenomics</h2>
    <p className="text-white/70 mt-2 text-center text-sm sm:text-base">Simple, transparent, community-focused.</p>
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 max-w-4xl mx-auto">
      <Stat label="Total Supply" value="1B"/>
      <Stat label="Liquidity" value="Locked"/>
      <Stat label="Tax" value="0%"/>
      <Stat label="Chain" value="SOL"/>
    </div>
  </Section>
);

const About = () => (
  <Section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24">
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">A Whisper from the Shadows</h2>
        <p className="text-white/80 mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg">
          From the ruins of past markets, a new presence rises on Solana—eyes blazing blue, scars of old battles etched in shadow. This Halloween,{" "}
          <span className="font-semibold" style={{ textShadow: glow("#ff7b00").textShadow }}>BOO</span>{" "}
          arrives with community-first governance, collectible drops, and hidden rewards. No strings. No rugs. Just a spooky surge of possibility.
        </p>
        <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3 text-xs justify-center lg:justify-start">
          <span className="font-semibold text-white/90">Contract:</span>
          <code className="px-2 py-1 rounded bg-white/5 border border-white/10 break-all text-xs max-w-[120px] xs:max-w-[150px] sm:max-w-[200px] truncate">
            {CA}
          </code>
          <CopyButton text={CA} />
          <a href={DEX_URL} target="_blank" rel="noreferrer" className="underline inline-flex items-center gap-1 text-xs whitespace-nowrap">
            <ExternalLink className="h-3 w-3"/>Chart
          </a>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
          <Button asChild className="rounded-xl text-sm h-10 px-4">
            <a href="#howtobuy">How to Buy</a>
          </Button>
          <Button variant="secondary" asChild className="rounded-xl text-sm h-10 px-4">
            <a href={JUP_URL} target="_blank" rel="noreferrer">Buy on Jupiter</a>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card className="bg-black/40 border-white/10">
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-bold text-sm sm:text-base">Clean</h3>
            <p className="text-xs sm:text-sm text-white/70 mt-1">No clutter, just what matters.</p>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-white/10">
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-bold text-sm sm:text-base">Responsive</h3>
            <p className="text-xs sm:text-sm text-white/70 mt-1">Filled with mysterious Halloween magic.</p>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-white/10">
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-bold text-sm sm:text-base">Fast</h3>
            <p className="text-xs sm:text-sm text-white/70 mt-1">Quick as a midnight fright.</p>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-white/10">
          <CardContent className="p-4 sm:p-5">
            <h3 className="font-bold text-sm sm:text-base">Themed</h3>
            <p className="text-xs sm:text-sm text-white/70 mt-1">Spooky Halloween vibes.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </Section>
);

const HowToBuy = () => (
  <Section id="howtobuy" className="py-12 sm:py-16 md:py-20 lg:py-24">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center">HOW TO BUY $BOO</h2>
    <p className="text-white/70 mt-2 text-center text-sm sm:text-base">Follow these simple steps to join the BOOBOY community</p>
    <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 max-w-4xl mx-auto">
      {[ 
        { 
          step: "Step 1: Get a Solana Wallet",
          instructions: "Download and set up a Solana wallet like Phantom, Solflare, or Backpack. Make sure to securely store your seed phrase!"
        },
        { 
          step: "Step 2: Buy SOL",
          instructions: "Purchase SOL cryptocurrency from any major exchange (Binance, Coinbase, etc.) or use a debit/credit card directly in your wallet to buy SOL."
        },
        { 
          step: "Step 3: Go to Jupiter",
          instructions: "Click the 'Buy Now' button on our website or go directly to Jupiter.ag. Connect your wallet when prompted."
        },
        { 
          step: "Step 4: Swap SOL for BOOBOY",
          instructions: `Set SOL as your input and paste our contract address: ${CA} as the output token. Review the swap details and confirm the transaction.`
        },
        { 
          step: "Step 5: Add to Your Wallet",
          instructions: "After purchasing, you may need to manually add BOOBOY to your wallet. Use our contract address to import the token."
        },
        { 
          step: "Step 6: Join the Community",
          instructions: "Follow us on X (Twitter) and join our Telegram to stay updated with the latest news, memes, and community events!"
        },
      ].map((item, i) => (
        <Card key={i} className="bg-black/40 border-white/10">
          <CardContent className="p-4 sm:p-6">
            <div className="font-bold text-lg sm:text-xl mb-2 sm:mb-3" style={{ textShadow: glow("#ff7b00").textShadow }}>
              {item.step}
            </div>
            <p className="text-white/70 text-sm sm:text-base">{item.instructions}</p>
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="mt-6 sm:mt-8 text-center">
      <Button asChild className="rounded-2xl text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8">
        <a href={JUP_URL} target="_blank" rel="noreferrer">BUY $BOO NOW ON JUPITER</a>
      </Button>
    </div>
  </Section>
);

const Footer = () => (
  <footer className="border-t border-white/10 mt-12">
    <Section className="py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/70">
        <div className="text-center sm:text-left text-xs sm:text-sm">
          © {new Date().getFullYear()} BOOBOY · {WEBSITE}
        </div>
        <div className="flex items-center gap-4 sm:gap-5 flex-wrap justify-center">
          <a href={X_URL} className="hover:underline text-xs sm:text-sm" target="_blank" rel="noreferrer">X/Twitter</a>
          <a href={TG_URL} className="hover:underline text-xs sm:text-sm" target="_blank" rel="noreferrer">Telegram</a>
          <a href={DEX_URL} className="hover:underline text-xs sm:text-sm" target="_blank" rel="noreferrer">Chart</a>
        </div>
      </div>
    </Section>
  </footer>
);

// Meme Carousel with your 10 images
const MemeCarousel = () => {
  const images = STATIC_MEMES;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  
  useEffect(() => {
    if (paused) return; 
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), MEME_AUTOPLAY_MS); 
    return () => clearInterval(t);
  }, [images.length, paused]);

  const go = (n: number) => setIdx((n + images.length) % images.length);

  return (
    <Section id="memes" className="py-12 sm:py-16 md:py-20 lg:py-24">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center">BOOBOY Memes</h2>
      <p className="text-white/70 mt-2 text-center text-sm sm:text-base">
        Spooky memes from our haunted community - {images.length} hilarious slides!
      </p>
      <div className="relative mt-6 sm:mt-8" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/10 bg-black/60">
          <div className="relative h-[280px] xs:h-[320px] sm:h-[360px] md:h-[420px] lg:h-[480px] xl:h-[520px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 p-3 sm:p-4"
              >
                <div className="h-full w-full rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black flex items-center justify-center">
                  <Image 
                    src={images[idx]} 
                    alt={`BOOBOY meme ${idx + 1}`} 
                    width={800}
                    height={800}
                    className="w-full h-full object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 70vw"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Controls */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <Button variant="secondary" className="rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4" onClick={() => go(idx-1)}>
            Previous
          </Button>
          <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
            {images.map((_: string, i: number) => (
              <button 
                key={i} 
                onClick={() => go(i)} 
                className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all flex-shrink-0 ${
                  i === idx ? 'bg-white scale-110' : 'bg-white/30 hover:bg-white/50'
                }`} 
                aria-label={`Go to slide ${i+1}`}
              />
            ))}
          </div>
          <Button variant="secondary" className="rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4" onClick={() => go(idx+1)}>
            Next
          </Button>
        </div>
        
        <p className="text-center text-xs text-white/50 mt-3">
          Slide {idx + 1} of {images.length}
        </p>
      </div>
    </Section>
  );
};

export default function App() {
  return (
    <main className="min-h-screen bg-[#0b0b0e] text-white font-sans overflow-x-hidden">
      <Nav />
      <Hero />
      <About />
      <MemeCarousel />
      <Tokenomics />
      <Section id="buy" className="py-8 sm:py-10">
        <Card className="bg-black/40 border-white/10">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="text-center sm:text-left">
                <div className="font-bold text-lg sm:text-xl" style={{ textShadow: glow("#ff7b00").textShadow }}>
                  Swap $BOO on Jupiter
                </div>
                <p className="text-white/70 text-sm mt-1">One click to the DEX—no wallet connect here.</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center">
                <Button asChild className="rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4">
                  <a href={JUP_URL} target="_blank" rel="noreferrer">Buy on Jupiter</a>
                </Button>
                <Button variant="secondary" asChild className="rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4">
                  <a href={DEX_URL} target="_blank" rel="noreferrer">View Chart</a>
                </Button>
                <CopyButton text={CA} />
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
      <HowToBuy />
      <Footer />
    </main>
  );
};