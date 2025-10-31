"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, Ghost, Copy, Check, ExternalLink, ShoppingBag, Trophy, Users, Star, MessageCircle, Send, Settings, Trash2, Edit, Plus, X, Video, Image as ImageIcon, Upload, Info, Key, Shield } from "lucide-react";
import Image from "next/image";

// ---- Config (edit these safely)
const CA = "GvaqCBjYsFhsoRSpHzPfU5XoR8be2KdkJD4bc5d2pump";
const JUP_URL = `https://jup.ag/swap/SOL-${CA}`;
const DEX_URL = `https://dexscreener.com/solana/${CA}`;
const X_URL = "https://x.com/Hodlposse";
const TG_URL = "https://t.me/booboyarmy";
const MERCH_URL = "#";

// Developer Access Configuration
const DEVELOPER_ACCESS_KEY = "booboy2025";

// Updated to support 29 images in public folder
const STATIC_MEMES = Array.from({ length: 29 }, (_, i) => `/images/${i + 1}.jpg`);

// Video memes - using external CDN
const VIDEO_MEMES = [
  "https://booboycdn.b-cdn.net/1.mp4",
  "https://booboycdn.b-cdn.net/2.MP4", 
  "https://booboycdn.b-cdn.net/3.MP4",
  "https://booboycdn.b-cdn.net/4.MP4",
  "https://booboycdn.b-cdn.net/5.MP4",
  "https://booboycdn.b-cdn.net/6.MP4",
  "https://booboycdn.b-cdn.net/7.MP4",
  "https://booboycdn.b-cdn.net/8.MP4",
  "https://booboycdn.b-cdn.net/9.MP4",
  "https://booboycdn.b-cdn.net/10.MP4",
  "https://booboycdn.b-cdn.net/11.MP4",
  "https://booboycdn.b-cdn.net/12.MP4",
  "https://booboycdn.b-cdn.net/13.MP4"
];

const HERO_IMAGE = "https://i.ibb.co/tPHdjHZd/photo-2025-10-18-22-56-34.jpg";

const glow = (color = "#ff3b3b") => ({ textShadow: `0 0 6px ${color}, 0 0 12px ${color}` });

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

interface CopyButtonProps {
  text: string;
}

// Updated interfaces for Firebase (string IDs)
interface Testimonial {
  id: string;  // Changed to string for Firebase
  name: string;
  message: string;
  rating: number;
  date: string;
  verified: boolean;
}

interface TestimonialFormData {
  name: string;
  message: string;
  rating: number;
}

interface GiveawayWinner {
  id: string;  // Changed to string for Firebase
  name: string;
  prize: string;
  date: string;
  tx: string;
}

interface GiveawayFormData {
  name: string;
  prize: string;
  date: string;
  tx: string;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  filename: string;
  uploadedAt: string;
}

// =============================================
// FIREBASE DATABASE SOLUTION
// =============================================

import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

class FirebaseDatabase {
  private static instance: FirebaseDatabase;
  private listeners: (() => void)[] = [];

  static getInstance(): FirebaseDatabase {
    if (!FirebaseDatabase.instance) {
      FirebaseDatabase.instance = new FirebaseDatabase();
    }
    return FirebaseDatabase.instance;
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const testimonialsRef = collection(db, 'testimonials');
      const q = query(testimonialsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const testimonials: Testimonial[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        testimonials.push({
          id: doc.id,
          name: data.name,
          message: data.message,
          rating: data.rating,
          date: data.date,
          verified: data.verified || false
        });
      });
      
      return testimonials;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  }

  async addTestimonial(testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> {
    try {
      const docRef = await addDoc(collection(db, 'testimonials'), {
        ...testimonial,
        createdAt: Timestamp.now()
      });
      
      const newTestimonial = {
        id: docRef.id,
        ...testimonial
      };
      
      this.notifyListeners();
      return newTestimonial;
    } catch (error) {
      console.error('Error adding testimonial:', error);
      throw error;
    }
  }

  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<boolean> {
    try {
      const testimonialRef = doc(db, 'testimonials', id);
      await updateDoc(testimonialRef, updates);
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return false;
    }
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      return false;
    }
  }

  async getGiveaways(): Promise<GiveawayWinner[]> {
    try {
      const giveawaysRef = collection(db, 'giveaways');
      const q = query(giveawaysRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const giveaways: GiveawayWinner[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        giveaways.push({
          id: doc.id,
          name: data.name,
          prize: data.prize,
          date: data.date,
          tx: data.tx
        });
      });
      
      return giveaways;
    } catch (error) {
      console.error('Error fetching giveaways:', error);
      return [];
    }
  }

  async addGiveaway(giveaway: Omit<GiveawayWinner, 'id'>): Promise<GiveawayWinner> {
    try {
      const docRef = await addDoc(collection(db, 'giveaways'), {
        ...giveaway,
        createdAt: Timestamp.now()
      });
      
      const newGiveaway = {
        id: docRef.id,
        ...giveaway
      };
      
      this.notifyListeners();
      return newGiveaway;
    } catch (error) {
      console.error('Error adding giveaway:', error);
      throw error;
    }
  }

  async updateGiveaway(id: string, updates: Partial<GiveawayWinner>): Promise<boolean> {
    try {
      const giveawayRef = doc(db, 'giveaways', id);
      await updateDoc(giveawayRef, updates);
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error updating giveaway:', error);
      return false;
    }
  }

  async deleteGiveaway(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'giveaways', id));
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error deleting giveaway:', error);
      return false;
    }
  }

  // Media methods remain the same (static files)
  async getMedia(): Promise<MediaItem[]> {
    return [];
  }

  async uploadMedia(): Promise<MediaItem> {
    throw new Error('Media upload is disabled. Please use the public folder.');
  }

  async deleteMedia(): Promise<boolean> {
    return false;
  }

  async clearAllData(): Promise<boolean> {
    try {
      // Delete all testimonials
      const testimonials = await this.getTestimonials();
      for (const testimonial of testimonials) {
        await this.deleteTestimonial(testimonial.id);
      }
      
      // Delete all giveaways
      const giveaways = await this.getGiveaways();
      for (const giveaway of giveaways) {
        await this.deleteGiveaway(giveaway.id);
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}

// Replace the old ApiDatabase with FirebaseDatabase
const ApiDatabase = FirebaseDatabase;

const Section = ({ id, children, className = "" }: SectionProps) => (
  <section id={id} className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </section>
);

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

const StarRating = ({ rating, onRatingChange, readonly = false }: { rating: number; onRatingChange?: (rating: number) => void; readonly?: boolean }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'} ${
            star <= rating ? 'text-yellow-400' : 'text-gray-500'
          }`}
          disabled={readonly}
        >
          <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
        </button>
      ))}
    </div>
  );
};

// =============================================
// MEME GALLERY COMPONENT
// =============================================

// =============================================
// MEME GALLERY COMPONENT (ROBUST VERSION)
// =============================================

const MemeGallery = () => {
  const [selectedType, setSelectedType] = useState<"all" | "images" | "videos">("all");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allMedia = [
    ...STATIC_MEMES.map((src, index) => ({ 
      type: 'image' as const, 
      src, 
      id: `image-${index}`,
      filename: `image-${index + 1}.jpg`,
      uploadedAt: new Date().toISOString()
    })),
    ...VIDEO_MEMES.map((src, index) => ({ 
      type: 'video' as const, 
      src, 
      id: `video-${index}`,
      filename: `video-${index + 1}.mp4`,
      uploadedAt: new Date().toISOString()
    }))
  ];

  const filteredMedia = selectedType === 'all' 
    ? allMedia 
    : allMedia.filter(media => 
        selectedType === 'images' ? media.type === 'image' : media.type === 'video'
      );

  const openMedia = (media: { type: 'image' | 'video', src: string }) => {
    setSelectedMedia(media.src);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  // Robust Video Player Component
  // Simplified Video Player Component
const VideoPlayer = ({ src, filename }: { src: string; filename: string }) => {
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get corresponding image for video poster
  const getPosterImage = () => {
    try {
      const videoNum = filename.replace('video-', '').replace('.mp4', '');
      const imageIndex = parseInt(videoNum) - 1;
      if (imageIndex >= 0 && imageIndex < STATIC_MEMES.length) {
        return STATIC_MEMES[imageIndex];
      }
    } catch {
      console.warn('Could not find poster for video:', filename);
    }
    return STATIC_MEMES[0];
  };

  return (
    <div className="relative w-full h-full">
      {error ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-red-500/20 rounded-lg p-3">
          <Video className="h-6 w-6 text-red-400 mb-1" />
          <p className="text-red-400 text-xs text-center">Video unavailable</p>
        </div>
      ) : (
        <div className="relative w-full h-full">
          {/* Video Element with Poster */}
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-cover rounded-lg"
            muted
            playsInline
            preload="metadata"
            poster={getPosterImage()}
            onError={() => setError(true)}
          />
          
          {/* Video Icon Overlay */}
          <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1 z-10">
            <Video className="h-3 w-3 text-white" />
          </div>

          {/* Hover Play Button */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-black/50 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Video className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

  return (
    <Section id="gallery" className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <ImageIcon className="h-8 w-8 text-orange-400" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Meme Gallery</h2>
            <ImageIcon className="h-8 w-8 text-orange-400" />
          </div>
          <p className="text-white/70 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
            Browse our complete collection of {allMedia.length} spooky BOOBOY memes and videos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-black/40 rounded-2xl p-1 border border-white/10">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedType === "all" 
                  ? "bg-orange-500 text-white" 
                  : "text-white/70 hover:text-white"
              }`}
            >
              All ({allMedia.length})
            </button>
            <button
              onClick={() => setSelectedType("images")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedType === "images" 
                  ? "bg-orange-500 text-white" 
                  : "text-white/70 hover:text-white"
              }`}
            >
              Images ({STATIC_MEMES.length})
            </button>
            <button
              onClick={() => setSelectedType("videos")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedType === "videos" 
                  ? "bg-orange-500 text-white" 
                  : "text-white/70 hover:text-white"
              }`}
            >
              Videos ({VIDEO_MEMES.length})
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {filteredMedia.map((media) => (
            <motion.div
              key={media.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="aspect-square cursor-pointer group"
              onClick={() => openMedia(media)}
            >
              <Card className="bg-black/40 border-white/10 h-full hover:bg-black/60 transition-all duration-300 group-hover:scale-105 group-hover:border-orange-500/30">
                <CardContent className="p-0 h-full relative">
                  {media.type === 'image' ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={media.src}
                        alt="BOOBOY Meme"
                        fill
                        className="object-cover rounded-lg"
                        unoptimized
                      />
                      <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1">
                        <ImageIcon className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  ) : (
                    <VideoPlayer src={media.src} filename={media.filename} />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal for enlarged view */}
        <AnimatePresence>
          {isModalOpen && selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-4xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="absolute -top-12 right-0 text-white hover:text-orange-400 transition-colors z-10"
                >
                  <X className="h-6 w-6" />
                </button>
                
                {selectedMedia.endsWith('.mp4') || selectedMedia.endsWith('.MP4') ? (
                  <video
                    src={selectedMedia}
                    className="w-full h-auto max-h-[80vh] rounded-2xl"
                    controls
                    autoPlay
                    loop
                    playsInline
                    muted
                  />
                ) : (
                  <Image
                    src={selectedMedia}
                    alt="BOOBOY Meme"
                    width={800}
                    height={600}
                    className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
                    unoptimized
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
};

// =============================================
// MEDIA UPLOAD COMPONENT (DISABLED)
// =============================================

const MediaUpload = () => {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-orange-500/30 rounded-2xl p-8 text-center">
        <Upload className="h-12 w-12 text-orange-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Media Management</h3>
        <p className="text-white/60 text-sm mb-4">
          To add media, please upload images to <code className="bg-black/40 px-2 py-1 rounded">public/images/</code> and videos to <code className="bg-black/40 px-2 py-1 rounded">public/videos/</code>
        </p>
        <p className="text-white/40 text-xs">
          Update the STATIC_MEMES and VIDEO_MEMES arrays in the code to include new files
        </p>
      </div>
    </div>
  );
};

// =============================================
// ADVANCED HIDDEN DEVELOPER ACCESS SYSTEM
// =============================================

const DeveloperAccess = () => {
  const [showAccessPanel, setShowAccessPanel] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Multiple secret activation methods
  const konamiCode = useRef<string[]>([]);
  const secretTapPattern = useRef<number[]>([]);
  const lastTapTime = useRef<number>(0);
  const currentPatternStep = useRef<number>(0);

  useEffect(() => {
    const auth = localStorage.getItem('booboy_developer_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    // Define sequences inside useEffect to avoid dependency issues
    const konamiSequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];
    const secretPattern = [2, 3, 1]; // Tap pattern: 2 taps, 3 taps, 1 tap

    // Method 1: Konami Code
    const handleKeyPress = (e: KeyboardEvent) => {
      konamiCode.current.push(e.code);
      
      // Keep only the last 10 keys
      if (konamiCode.current.length > 10) {
        konamiCode.current.shift();
      }
      
      // Check for Konami code match
      if (konamiCode.current.join(',') === konamiSequence.join(',')) {
        setShowAccessPanel(true);
        konamiCode.current = []; // Reset
      }
      
      // Method 2: Keyboard shortcut (more hidden)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.altKey && e.key === '`') {
        e.preventDefault();
        setShowAccessPanel(true);
      }
      
      if (e.key === 'Escape' && showAccessPanel) {
        setShowAccessPanel(false);
        setAccessKey('');
      }
    };

    // Method 3: Secret tap pattern on ghost icon
    const handleSecretTap = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isGhostClick = target.closest('.ghost-icon') !== null;
      
      if (isGhostClick) {
        const currentTime = Date.now();
        
        // Reset if too much time passed between taps
        if (currentTime - lastTapTime.current > 2000) {
          secretTapPattern.current = [];
          currentPatternStep.current = 0;
        }
        
        lastTapTime.current = currentTime;
        
        // Count consecutive taps within 500ms
        const lastTapCount = secretTapPattern.current[secretTapPattern.current.length - 1] || 0;
        if (currentTime - lastTapTime.current < 500) {
          secretTapPattern.current[secretTapPattern.current.length - 1] = lastTapCount + 1;
        } else {
          secretTapPattern.current.push(1);
        }
        
        // Check pattern match
        if (secretTapPattern.current.length === secretPattern.length) {
          const isMatch = secretTapPattern.current.every((count, index) => count === secretPattern[index]);
          if (isMatch) {
            setShowAccessPanel(true);
            secretTapPattern.current = [];
            currentPatternStep.current = 0;
          } else {
            // Reset on wrong pattern
            secretTapPattern.current = [];
            currentPatternStep.current = 0;
          }
        }
        
        // Auto-reset after 2 seconds of inactivity
        setTimeout(() => {
          secretTapPattern.current = [];
          currentPatternStep.current = 0;
        }, 2000);
      }
    };

    // Method 4: Long press on contract address
    let longPressTimer: NodeJS.Timeout;
    const handleLongPressStart = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      const isContractAddress = target.closest('.contract-address') !== null;
      
      if (isContractAddress) {
        longPressTimer = setTimeout(() => {
          setShowAccessPanel(true);
        }, 3000); // 3 second long press
      }
    };

    const handleLongPressEnd = () => {
      clearTimeout(longPressTimer);
    };

    window.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleSecretTap);
    document.addEventListener('mousedown', handleLongPressStart);
    document.addEventListener('mouseup', handleLongPressEnd);
    document.addEventListener('touchstart', handleLongPressStart);
    document.addEventListener('touchend', handleLongPressEnd);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleSecretTap);
      document.removeEventListener('mousedown', handleLongPressStart);
      document.removeEventListener('mouseup', handleLongPressEnd);
      document.removeEventListener('touchstart', handleLongPressStart);
      document.removeEventListener('touchend', handleLongPressEnd);
      clearTimeout(longPressTimer);
    };
  }, [showAccessPanel]);

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey === DEVELOPER_ACCESS_KEY) {
      localStorage.setItem('booboy_developer_authenticated', 'true');
      setIsAuthenticated(true);
      setShowAccessPanel(false);
      setAccessKey('');
    } else {
      alert('Invalid access key');
      setAccessKey('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('booboy_developer_authenticated');
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <AdminPanel onLogout={handleLogout} />;
  }

  return (
    <>
      <AnimatePresence>
        {showAccessPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1a1a1a] border border-orange-500/30 rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-orange-400">Developer Access</h2>
                <p className="text-white/60 mt-2 text-sm">Enter developer access key</p>
              </div>

              <form onSubmit={handleAccessSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-orange-400 transition-colors text-center text-lg font-mono"
                    placeholder="Enter access key"
                    required
                    autoFocus
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 py-3 text-base"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Access Admin
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowAccessPanel(false);
                      setAccessKey('');
                    }}
                    className="flex-1 py-3 text-base"
                  >
                    Cancel
                  </Button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <p className="text-white/40 text-xs">
                  Access methods: Konami Code, Ctrl+Shift+Alt+`, or secret patterns
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const AdminPanel = ({ onLogout }: { onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"testimonials" | "giveaways" | "media">("testimonials");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [giveawayWinners, setGiveawayWinners] = useState<GiveawayWinner[]>([]);
  const [showGiveawayForm, setShowGiveawayForm] = useState(false);
  const [editingGiveaway, setEditingGiveaway] = useState<GiveawayWinner | null>(null);
  const [giveawayFormData, setGiveawayFormData] = useState<GiveawayFormData>({
    name: "",
    prize: "",
    date: "",
    tx: ""
  });

  const db = ApiDatabase.getInstance();

  useEffect(() => {
    const loadData = async () => {
      const [testimonialsData, giveawaysData] = await Promise.all([
        db.getTestimonials(),
        db.getGiveaways()
      ]);
      setTestimonials(testimonialsData);
      setGiveawayWinners(giveawaysData);
    };

    loadData();

    const unsubscribe = db.subscribe(() => {
      loadData();
    });

    return unsubscribe;
  }, [db]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'O' || e.key === 'o')) {
        e.preventDefault();
        setIsOpen(true);
      }
      
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  // Updated to use string IDs
  const verifyTestimonial = async (id: string) => {
    const success = await db.updateTestimonial(id, { verified: true });
    if (success) {
      const updatedTestimonials = await db.getTestimonials();
      setTestimonials(updatedTestimonials);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      const success = await db.deleteTestimonial(id);
      if (success) {
        const updatedTestimonials = await db.getTestimonials();
        setTestimonials(updatedTestimonials);
      }
    }
  };

  const handleGiveawayInputChange = (field: keyof GiveawayFormData, value: string) => {
    setGiveawayFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGiveawaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!giveawayFormData.name || !giveawayFormData.prize || !giveawayFormData.date || !giveawayFormData.tx) {
      alert('Please fill in all fields');
      return;
    }

    if (editingGiveaway) {
      const success = await db.updateGiveaway(editingGiveaway.id, giveawayFormData);
      if (success) {
        const updatedGiveaways = await db.getGiveaways();
        setGiveawayWinners(updatedGiveaways);
      }
    } else {
      await db.addGiveaway(giveawayFormData);
      const updatedGiveaways = await db.getGiveaways();
      setGiveawayWinners(updatedGiveaways);
    }

    setGiveawayFormData({ name: "", prize: "", date: "", tx: "" });
    setEditingGiveaway(null);
    setShowGiveawayForm(false);
  };

  const editGiveaway = (giveaway: GiveawayWinner) => {
    setGiveawayFormData({
      name: giveaway.name,
      prize: giveaway.prize,
      date: giveaway.date,
      tx: giveaway.tx
    });
    setEditingGiveaway(giveaway);
    setShowGiveawayForm(true);
  };

  const deleteGiveaway = async (id: string) => {
    if (confirm('Are you sure you want to delete this giveaway winner?')) {
      const success = await db.deleteGiveaway(id);
      if (success) {
        const updatedGiveaways = await db.getGiveaways();
        setGiveawayWinners(updatedGiveaways);
      }
    }
  };

  const resetGiveawayForm = () => {
    setGiveawayFormData({ name: "", prize: "", date: "", tx: "" });
    setEditingGiveaway(null);
    setShowGiveawayForm(false);
  };

  const clearAllData = async () => {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
      const success = await db.clearAllData();
      if (success) {
        setTestimonials([]);
        setGiveawayWinners([]);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 group touch-manipulation"
        title="Developer Admin"
        style={{ touchAction: 'manipulation' }}
      >
        <Settings className="h-6 w-6" />
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1a1a1a] border border-orange-500/30 rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{ touchAction: 'pan-y' }}
            >
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-purple-600/10">
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-orange-400" />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Developer Admin</h2>
                    <p className="text-orange-400 text-xs sm:text-sm">Full control panel</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={clearAllData}
                    className="text-red-400 border-red-400/20 hover:bg-red-400/10 text-xs sm:text-sm py-2 h-auto"
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={onLogout}
                    className="text-red-400 border-red-400/20 hover:bg-red-400/10 text-xs sm:text-sm py-2 h-auto"
                  >
                    Logout
                  </Button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab("testimonials")}
                  className={`flex-1 py-3 sm:py-4 font-medium transition-colors text-sm sm:text-base ${
                    activeTab === "testimonials" 
                      ? "bg-orange-500 text-white" 
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Testimonials ({testimonials.length})
                </button>
                <button
                  onClick={() => setActiveTab("giveaways")}
                  className={`flex-1 py-3 sm:py-4 font-medium transition-colors text-sm sm:text-base ${
                    activeTab === "giveaways" 
                      ? "bg-orange-500 text-white" 
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Giveaways ({giveawayWinners.length})
                </button>
                <button
                  onClick={() => setActiveTab("media")}
                  className={`flex-1 py-3 sm:py-4 font-medium transition-colors text-sm sm:text-base ${
                    activeTab === "media" 
                      ? "bg-orange-500 text-white" 
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Media (Static)
                </button>
              </div>

              <div className="p-3 sm:p-6 overflow-y-auto max-h-[60vh]">
                {activeTab === "testimonials" && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Manage Testimonials</h3>
                      <div className="text-xs sm:text-sm text-white/60">
                        {testimonials.filter(t => t.verified).length} verified • {testimonials.filter(t => !t.verified).length} pending
                      </div>
                    </div>
                    
                    {testimonials.length === 0 ? (
                      <div className="text-center py-8 text-white/50">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No testimonials yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {testimonials.map((testimonial) => (
                          <div key={testimonial.id} className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-sm sm:text-base truncate">{testimonial.name}</h4>
                                  {testimonial.verified && (
                                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex-shrink-0">
                                      Verified
                                    </span>
                                  )}
                                </div>
                                <p className="text-white/60 text-xs">{testimonial.date}</p>
                              </div>
                              <StarRating rating={testimonial.rating} readonly />
                            </div>
                            <p className="text-white/80 text-sm sm:text-base mb-3 line-clamp-3">&quot;{testimonial.message}&quot;</p>
                            <div className="flex gap-2">
                              {!testimonial.verified && (
                                <Button
                                  size="sm"
                                  onClick={() => verifyTestimonial(testimonial.id)}
                                  className="bg-green-500 hover:bg-green-600 text-xs py-1 h-8"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Verify
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => deleteTestimonial(testimonial.id)}
                                className="text-xs py-1 h-8"
                                >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "giveaways" && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Manage Giveaways</h3>
                      <Button
                        onClick={() => setShowGiveawayForm(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm py-2 h-auto"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Winner
                      </Button>
                    </div>

                    <AnimatePresence>
                      {showGiveawayForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10 mb-4"
                        >
                          <h4 className="font-semibold mb-3 text-sm sm:text-base">
                            {editingGiveaway ? "Edit Giveaway Winner" : "Add Giveaway Winner"}
                          </h4>
                          <form onSubmit={handleGiveawaySubmit} className="grid grid-cols-1 gap-3">
                            <input
                              type="text"
                              placeholder="Winner Name"
                              value={giveawayFormData.name}
                              onChange={(e) => handleGiveawayInputChange('name', e.target.value)}
                              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-orange-400 text-sm"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Prize (e.g., 500K $BOO)"
                              value={giveawayFormData.prize}
                              onChange={(e) => handleGiveawayInputChange('prize', e.target.value)}
                              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-orange-400 text-sm"
                              required
                            />
                            <input
                              type="date"
                              value={giveawayFormData.date}
                              onChange={(e) => handleGiveawayInputChange('date', e.target.value)}
                              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-orange-400 text-sm"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Transaction ID"
                              value={giveawayFormData.tx}
                              onChange={(e) => handleGiveawayInputChange('tx', e.target.value)}
                              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-orange-400 text-sm"
                              required
                            />
                            <div className="flex gap-2">
                              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 flex-1 text-sm py-2">
                                {editingGiveaway ? "Update Winner" : "Add Winner"}
                              </Button>
                              <Button type="button" variant="secondary" onClick={resetGiveawayForm} className="flex-1 text-sm py-2">
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {giveawayWinners.length === 0 ? (
                      <div className="text-center py-8 text-white/50">
                        <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No giveaway winners yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {giveawayWinners.map((giveaway) => (
                          <div key={giveaway.id} className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm sm:text-base truncate">{giveaway.name}</h4>
                                <p className="text-orange-400 font-semibold text-sm sm:text-lg">{giveaway.prize}</p>
                                <div className="flex flex-col sm:flex-row sm:gap-4 text-xs text-white/60 mt-1">
                                  <span>{giveaway.date}</span>
                                  <span className="truncate">{giveaway.tx}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => editGiveaway(giveaway)}
                                  className="text-xs py-1 h-8"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => deleteGiveaway(giveaway.id)}
                                  className="text-xs py-1 h-8"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "media" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Manage Media</h3>
                      <div className="text-xs sm:text-sm text-white/60">
                        Static Gallery
                      </div>
                    </div>

                    <MediaUpload />

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Info className="h-5 w-5 text-blue-400" />
                        <div>
                          <h4 className="font-semibold text-blue-400">Static Media Setup</h4>
                          <p className="text-white/60 text-sm mt-1">
                            Current setup: {STATIC_MEMES.length} images and {VIDEO_MEMES.length} videos
                          </p>
                          <p className="text-white/40 text-xs mt-2">
                            Add your images to <code>public/images/</code> and videos to <code>public/videos/</code>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <Card className="bg-black/40 border-white/10 h-full hover:bg-black/60 transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm sm:text-base">{testimonial.name}</h3>
              {testimonial.verified && (
                <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                  <Check className="h-3 w-3" />
                  Verified
                </div>
              )}
            </div>
            <p className="text-white/60 text-xs mt-1">{testimonial.date}</p>
          </div>
          <StarRating rating={testimonial.rating} readonly />
        </div>
        <p className="text-white/80 text-sm sm:text-base leading-relaxed">&quot;{testimonial.message}&quot;</p>
      </CardContent>
    </Card>
  </motion.div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    message: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const db = ApiDatabase.getInstance();

  useEffect(() => {
    const loadTestimonials = async () => {
      const testimonialsData = await db.getTestimonials();
      setTestimonials(testimonialsData);
    };

    loadTestimonials();

    const unsubscribe = db.subscribe(() => {
      loadTestimonials();
    });

    return unsubscribe;
  }, [db]);

  const handleInputChange = (field: keyof TestimonialFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!formData.name.trim() || !formData.message.trim()) {
      setSubmitError('Please fill in all fields');
      return;
    }

    if (formData.message.length < 10) {
      setSubmitError('Please write a longer message (minimum 10 characters)');
      return;
    }

    setIsSubmitting(true);

    try {
      await db.addTestimonial({
        name: formData.name.trim(),
        message: formData.message.trim(),
        rating: formData.rating,
        date: new Date().toISOString().split('T')[0],
        verified: false
      });

      setFormData({ name: '', message: '', rating: 5 });
      setShowForm(false);
      setSubmitError(null);
      alert('Thank you for your testimonial! It will be reviewed and displayed soon.');
    } catch (error: unknown) {
      console.error('Testimonial submission error:', error);
      setSubmitError(`Failed to submit testimonial: ${error instanceof Error ? error.message : 'Please try again later'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', message: '', rating: 5 });
    setShowForm(false);
    setSubmitError(null);
  };

  return (
    <Section id="testimonials" className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <MessageCircle className="h-8 w-8 text-orange-400" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Community Love</h2>
            <MessageCircle className="h-8 w-8 text-orange-400" />
          </div>
          <p className="text-white/70 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
            Hear what our amazing community has to say about their BOOBOY experience. Join the conversation and share your story!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <Button
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white border-0"
            size="lg"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Share Your Experience
          </Button>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-orange-400" />
                  Share Your BOOBOY Experience
                </h3>
                
                {submitError && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{submitError}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-orange-400 transition-colors"
                      placeholder="Enter your name"
                      required
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Your Rating *
                    </label>
                    <StarRating 
                      rating={formData.rating} 
                      onRatingChange={(rating) => handleInputChange('rating', rating)} 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-orange-400 transition-colors resize-none"
                      placeholder="Tell us about your BOOBOY experience..."
                      rows={4}
                      required
                      minLength={10}
                      maxLength={500}
                    />
                    <div className="text-right text-xs text-white/50 mt-1">
                      {formData.message.length}/500
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={resetForm}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white/70 mb-2">No Testimonials Yet</h3>
              <p className="text-white/50">Be the first to share your BOOBOY experience!</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{testimonials.length}</div>
              <div className="text-xs text-white/70">Total Reviews</div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {testimonials.filter(t => t.verified).length}
              </div>
              <div className="text-xs text-white/70">Verified</div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length || 0).toFixed(1)}
              </div>
              <div className="text-xs text-white/70">Avg Rating</div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">5.0</div>
              <div className="text-xs text-white/70">Community Score</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
};

const Hero = () => {
  return (
    <Section id="home" className="relative py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="flex flex-col lg:flexRow items-center gap-8 lg:gap-12">
        <motion.div 
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 sm:mb-6">
            <span className="block" style={glow("#9efcfd")}>BOOBOY</span>
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-2 text-white/80">
              The Spookiest Meme on Solana
            </span>
          </h1>
          
          <p className="text-white/70 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
            Join the ghostly revolution! Zero taxes, locked liquidity, and a community that&apos;s scarily dedicated to the moon.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <Button asChild size="lg" className="rounded-2xl text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8">
              <a href={JUP_URL} target="_blank" rel="noreferrer">Buy $BOO Now</a>
            </Button>
            <Button asChild variant="secondary" size="lg" className="rounded-2xl text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8">
              <a href={DEX_URL} target="_blank" rel="noreferrer">View Chart</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black">
              <a href={MERCH_URL} target="_blank" rel="noreferrer">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Merch
              </a>
            </Button>
          </div>
          
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
            <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/10">
              <Ghost className="h-4 w-4 text-orange-400 ghost-icon" />
              <span className="text-sm">No Taxes</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/10">
              <Trophy className="h-4 w-4 text-orange-400" />
              <span className="text-sm">LP Locked</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/10">
              <Users className="h-4 w-4 text-orange-400" />
              <span className="text-sm">Community Driven</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-600 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
            <Image 
              src={HERO_IMAGE} 
              alt="BOOBOY Hero" 
              width={500}
              height={500}
              className="relative rounded-3xl w-full h-auto border-4 border-white/10 shadow-2xl"
              priority
              unoptimized
            />
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

const About = () => {
  return (
    <Section id="about" className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6">About BOOBOY</h2>
          <p className="text-white/70 text-lg sm:text-xl leading-relaxed">
            BOOBOY is more than just a memecoin - it&apos;s a movement! Born from the spooky spirits of Halloween 
            and powered by the Solana blockchain, we&apos;re creating the most fun and engaging community in crypto. 
            With zero taxes, locked liquidity, and a dedicated team, we&apos;re here to prove that memecoins can be 
            both entertaining and trustworthy.
          </p>
        </motion.div>
      </div>
    </Section>
  );
};

const Tokenomics = () => {
  const stats = [
    { label: "Total Supply", value: "1B $BOO" },
    { label: "Taxes", value: "0%" },
    { label: "Liquidity", value: "100% Locked" },
    { label: "Contract", value: "Verified" }
  ];

  return (
    <Section id="token" className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-8">Tokenomics</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="bg-black/40 border-white/10 hover:bg-black/60 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-400 mb-2">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};

const WinnerCard = ({ name, prize, date, tx }: { name: string; prize: string; date: string; tx: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <Card className="bg-gradient-to-br from-orange-500/10 to-purple-600/10 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{name}</h3>
                <p className="text-orange-400 font-semibold text-xl">{prize}</p>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span className="font-medium">Date:</span>
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span className="font-medium">Transaction:</span>
                <span className="font-mono bg-black/30 px-2 py-1 rounded text-xs contract-address">
                  {tx.slice(0, 8)}...{tx.slice(-8)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-orange-500/20">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Verified Winner</span>
            <span>BOOBOY Giveaway</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Giveaways = () => {
  const [giveawayWinners, setGiveawayWinners] = useState<GiveawayWinner[]>([]);
  const db = ApiDatabase.getInstance();

  useEffect(() => {
    const loadGiveaways = async () => {
      const giveawaysData = await db.getGiveaways();
      setGiveawayWinners(giveawaysData);
    };

    loadGiveaways();

    const unsubscribe = db.subscribe(() => {
      loadGiveaways();
    });

    return unsubscribe;
  }, [db]);

  return (
    <Section id="giveaways" className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-orange-400" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Recent Giveaways</h2>
            <Trophy className="h-8 w-8 text-orange-400" />
          </div>
          <p className="text-white/70 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
            Our community members are winning big! Check out the latest BOOBOY giveaway winners.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 mb-12"
        >
          <Card className="bg-gradient-to-r from-orange-500/20 to-purple-600/20 border border-orange-500/30">
            <CardContent className="p-6 text-center">
              <h3 className="text-white text-xl font-bold mb-4">🎉 Upcoming Giveaway 🎉</h3>
              <p className="text-white/80 mb-4">
                Join our Telegram and follow us on X (Twitter) to participate in our next massive giveaway! 
                We&apos;re giving away <strong>FREE $BOO</strong> to our loyal community members.
              </p>
              <div className="flex flex-col sm:flexRow gap-4 justify-center items-center">
                <Button asChild className="bg-orange-500 hover:bg-orange-600">
                  <a href={TG_URL} target="_blank" rel="noreferrer">
                    Join Telegram
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <a href={X_URL} target="_blank" rel="noreferrer">
                    Follow on X
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto"
        >
          {giveawayWinners.length > 0 ? (
            giveawayWinners.map((winner) => (
              <WinnerCard
                key={winner.id}
                name={winner.name}
                prize={winner.prize}
                date={winner.date}
                tx={winner.tx}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <Trophy className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white/70 mb-2">Giveaways Coming Soon</h3>
              <p className="text-white/50">Check back later for exciting giveaway announcements!</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Button
            asChild
            className="rounded-2xl bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white border-0"
            size="lg"
          >
            <a href={TG_URL} target="_blank" rel="noreferrer">
              <Trophy className="h-4 w-4 mr-2" />
              Join Giveaways
            </a>
          </Button>
        </motion.div>
      </div>
    </Section>
  );
};

const HowToBuy = () => {
  const steps = [
    {
      step: 1,
      title: "Get a Solana Wallet",
      description: "Download Phantom or Solflare wallet and fund it with SOL"
    },
    {
      step: 2,
      title: "Go to Jupiter",
      description: "Click the Buy Now button to open Jupiter Aggregator"
    },
    {
      step: 3,
      title: "Swap SOL for BOOBOY",
      description: "Connect your wallet, copy the contract Address and swap SOL for our token"
    },
    {
      step: 4,
      title: "HODL and Enjoy",
      description: "Join our community and enjoy the spooky ride!"
    }
  ];

  return (
    <Section id="howtobuy" className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-8">How to Buy $BOO</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-black/40 border-white/10 h-full hover:bg-black/60 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">{step.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/50 py-8 sm:py-12">
      <Section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Ghost className="h-6 w-6 ghost-icon" />
            <span className="font-black tracking-wider text-xl" style={{ textShadow: glow("#9efcfd").textShadow }}>
              BOOBOY
            </span>
          </div>
          
          <p className="text-white/70 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
            The spookiest memecoin on Solana. Join our ghostly community and let&apos;s fly to the moon together!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href={X_URL} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition-colors">
              X/Twitter
            </a>
            <a href={TG_URL} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition-colors">
              Telegram
            </a>
            <a href={DEX_URL} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition-colors">
              Chart
            </a>
            <a href={JUP_URL} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition-colors">
              Buy $BOO
            </a>
          </div>
          
          <div className="text-white/50 text-xs contract-address">
            <p>© 2025 BOOBOY. All rights reserved. Always do your own research.</p>
            <p className="mt-2">Contract: {CA.slice(0, 8)}...{CA.slice(-8)}</p>
          </div>
        </motion.div>
      </Section>
    </footer>
  );
};

const Nav = () => {
  const [open, setOpen] = useState(false);
  const items = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#gallery", label: "Gallery" },
    { href: "#token", label: "Tokenomics" },
    { href: "#giveaways", label: "Giveaways" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#howtobuy", label: "HOW TO BUY" },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur border-b border-white/10 bg-black/50 supports-[backdrop-filter]:bg-black/50">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-2 group flex-shrink-0">
          <Ghost className="h-5 w-5 sm:h-6 sm:w-6 ghost-icon" />
          <span className="font-black tracking-wider text-lg sm:text-xl" style={{ textShadow: glow("#9efcfd").textShadow }}>BOOBOY</span>
        </a>
        
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
            <Button variant="secondary" className="rounded-2xl text-xs h-9 px-3 sm:px-4" asChild>
              <a href={MERCH_URL} target="_blank" rel="noreferrer">
                <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Merch
              </a>
            </Button>
            <Button className="rounded-2xl text-xs h-9 px-3 sm:px-4" asChild>
              <a href={JUP_URL} target="_blank" rel="noreferrer">Buy Now</a>
            </Button>
          </div>
        </nav>

        <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" onClick={() => setOpen(!open)}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>

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
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" asChild className="rounded-xl">
                <a href={MERCH_URL} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Merch
                </a>
              </Button>
              <Button asChild className="rounded-xl">
                <a href={JUP_URL} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Buy Now</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default function App() {
  return (
    <main className="min-h-screen bg-[#0b0b0e] text-white font-sans overflow-x-hidden">
      <Nav />
      <Hero />
      <About />
      <MemeGallery />
      <Tokenomics />
      <Giveaways />
      <Testimonials />
      
      <Section id="buy" className="py-8 sm:py-10">
        <Card className="bg-black/40 border-white/10">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flexRow items-center gap-4 justify-between">
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
                <Button variant="outline" asChild className="rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black">
                  <a href={MERCH_URL} target="_blank" rel="noreferrer">
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    Merch
                  </a>
                </Button>
                <CopyButton text={CA} />
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
      <HowToBuy />
      <Footer />
      <DeveloperAccess />
    </main>
  );
};