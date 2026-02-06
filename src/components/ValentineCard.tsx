import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MovingButton from './MovingButton';

type Step = 'question' | 'accepted';

const ValentineCard = () => {
    const [step, setStep] = useState<Step>('question');
    const [showVideo, setShowVideo] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleYes = () => {
        setStep('accepted');

        // Use a timeout to ensure canvas is rendered
        setTimeout(() => {
            if (canvasRef.current) {
                const myConfetti = confetti.create(canvasRef.current, {
                    resize: true,
                    useWorker: true
                });

                myConfetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#ff4d6d', '#ff758f', '#ff85a1', '#ffb3c1', '#ffffff']
                });

                // Extra bursts
                setTimeout(() => {
                    myConfetti({
                        particleCount: 80,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: ['#ff4d6d', '#ffb3c1']
                    });
                    myConfetti({
                        particleCount: 80,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: ['#ff4d6d', '#ffb3c1']
                    });
                }, 250);
            }
        }, 100);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#ffc5d3] font-['Fredoka'] relative">
            <AnimatePresence mode="wait">
                {step === 'question' && (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center space-y-6 md:space-y-10 max-w-lg w-full bg-white p-6 md:p-14 rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(255,182,193,0.4)] border-4 border-white/50 relative"
                    >
                        <div className="relative inline-block">
                            <motion.img
                                src={`${import.meta.env.BASE_URL}assets/bear-ask.gif`}
                                alt="Will You Be My Valentine Bear"
                                className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-4 rounded-2xl"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>

                        <h1 className="text-4xl md:text-6xl text-[var(--foreground)] font-bubble leading-[1.2] tracking-wide">
                            Will you be my <br />
                            <span className="text-[var(--primary)] relative">
                                Valentine?
                            </span>
                        </h1>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12 pt-4 min-h-[120px]">
                            <motion.button
                                id="yes-button"
                                onClick={handleYes}
                                whileHover={{ scale: 1.15 }}
                                className="w-16 h-16 flex items-center justify-center bg-[var(--primary)] text-white font-bold text-lg rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer relative z-10 shrink-0 overflow-hidden"
                            >
                                <span className="relative z-20">Yes</span>
                            </motion.button>

                            <MovingButton>
                                <span className="relative z-20">No</span>
                            </MovingButton>
                        </div>
                    </motion.div>
                )}

                {step === 'accepted' && (
                    <motion.div
                        key="accepted"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="text-center space-y-4 md:space-y-6 max-w-lg w-full bg-white p-6 md:p-14 rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(255,182,193,0.4)] border-4 border-white/50 relative overflow-hidden"
                    >
                        {/* Confetti Canvas Scoped to Card */}
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

                        {/* Soft pink corner blobs */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-50 rounded-full blur-3xl opacity-60" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-50 rounded-full blur-3xl opacity-60" />

                        <div className="relative inline-block z-10 leading-none">
                            <motion.img
                                src={`${import.meta.env.BASE_URL}assets/bear-kiss.gif`}
                                alt="Kissing Cute Bears"
                                className="w-40 h-40 md:w-56 md:h-56 mx-auto rounded-2xl"
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>

                        <div className="space-y-4 relative z-10">
                            <h1 className="text-3xl md:text-5xl text-[var(--primary)] font-bubble leading-tight">
                                Happy Valentine's <br /> Day!
                            </h1>
                            <p className="text-sm md:text-lg text-gray-600 font-medium font-['Fredoka'] max-w-md mx-auto leading-relaxed">
                                Every second with you is a celebration. You are the spark that makes my world so much brighter. Thank you for being my favorite person and my greatest adventure. <br /> Here’s to us today and always!
                            </p>

                            <div className="flex items-center justify-center gap-2 mt-6 w-full">
                                <motion.img
                                    src={`${import.meta.env.BASE_URL}assets/bear-duck.gif`}
                                    alt="Bear riding a duck"
                                    className="w-16 rounded-xl opacity-90 hover:opacity-100 transition-opacity transform -scale-x-100"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                />

                                <button
                                    onClick={() => setShowVideo(true)}
                                    className="px-6 py-2 bg-[var(--primary)] text-white font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 font-['Fredoka'] text-sm shrink-0"
                                >
                                    Open Your Gift! 🎁
                                </button>

                                <motion.img
                                    src={`${import.meta.env.BASE_URL}assets/bear-duck.gif`}
                                    alt="Bear riding a duck"
                                    className="w-16 rounded-xl opacity-90 hover:opacity-100 transition-opacity"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rick Roll Modal */}
            <AnimatePresence>
                {showVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                        onClick={() => setShowVideo(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <video
                                width="100%"
                                height="100%"
                                src={`${import.meta.env.BASE_URL}assets/rickroll.mp4`}
                                title="Rick Roll"
                                autoPlay
                                loop
                                controls
                                playsInline
                                className="object-cover"
                            />
                            <button
                                onClick={() => setShowVideo(false)}
                                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Decorative background elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-[var(--primary)]/10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        initial={{
                            scale: Math.random() * 1 + 0.5,
                            opacity: 0
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0],
                            rotate: [0, 180]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5
                        }}
                    >
                        <Heart fill="currentColor" className="w-8 h-8" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ValentineCard;
