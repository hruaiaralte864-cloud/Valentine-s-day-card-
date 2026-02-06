import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MovingButton = ({ children }: { children: React.ReactNode }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLDivElement>(null);

    // State: Button starts stationary (vx=0, vy=0) and only moves when activated
    const [velocity, setVelocity] = useState({ vx: 0, vy: 0 });
    const [isActive, setIsActive] = useState(false);

    const requestRef = useRef<number>(null);
    const lastTimeRef = useRef<number>(null);

    // 1. Physics Engine: Continuous Bouncing
    useEffect(() => {
        if (!isActive) return; // Don't run physics loop if not active

        const animate = (time: number) => {
            if (lastTimeRef.current !== undefined) {
                // Calculate deltaTime if needed, but for simplicity we'll use fixed steps

                setPosition(prev => {
                    let nextX = prev.x + velocity.vx;
                    let nextY = prev.y + velocity.vy;

                    // Aggressively expanded boundaries to hit the visible card borders
                    const limitRight = 170;
                    const limitLeft = 280; // Negative
                    const limitYTop = -610; // Adjusted to -610px as requested
                    const limitYBottom = 80;

                    let newVx = velocity.vx;
                    let newVy = velocity.vy;

                    // Bounce off X walls (Asymmetric)
                    if (nextX < -limitLeft || nextX > limitRight) {
                        newVx = -velocity.vx * 0.95;
                        // Clamp to bounds
                        if (nextX < -limitLeft) nextX = -limitLeft + 2;
                        if (nextX > limitRight) nextX = limitRight - 2;
                    }

                    // Bounce off Y walls
                    if (nextY < limitYTop || nextY > limitYBottom) {
                        newVy = -velocity.vy * 0.95;
                        nextY = nextY < limitYTop ? limitYTop + 2 : limitYBottom - 2;
                    }

                    // Occasionally update velocity state if changed
                    if (newVx !== velocity.vx || newVy !== velocity.vy) {
                        setVelocity({ vx: newVx, vy: newVy });
                    }

                    return { x: nextX, y: nextY };
                });
            }
            lastTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [velocity, isActive]); // Depend on isActive

    // 2. Mouse Interaction: "Fleeing Booster"
    const handleMouseMove = (e: MouseEvent) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;

        const distanceX = e.clientX - buttonCenterX;
        const distanceY = e.clientY - buttonCenterY;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        // Strict Activation: Only when touching the circle (Radius ~32px)
        if (!isActive && distance < 35) {
            setIsActive(true);
            // Initial kick
            const randomAngle = Math.random() * Math.PI * 2;
            const speed = 10;
            setVelocity({
                vx: Math.cos(randomAngle) * speed,
                vy: Math.sin(randomAngle) * speed
            });
        }

        // Fleeing logic (Only if active)
        if (isActive && distance < 140) {
            const angle = Math.atan2(distanceY, distanceX);
            const boost = 8; // Speed boost multiplier

            // Set new velocity pointing away from cursor
            let newVx = -Math.cos(angle) * boost;
            let newVy = -Math.sin(angle) * boost;

            // Check if immediate move would hit wall and invert if so (reactive bounce)
            const nextX = position.x + newVx * 5; // Look ahead
            if (nextX > 170 || nextX < -280) newVx = -newVx;

            setVelocity({
                vx: newVx,
                vy: newVy
            });
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isActive, position]); // Re-bind listener if needed

    return (
        <motion.div
            ref={buttonRef}
            animate={{
                x: position.x,
                y: position.y,
                // Enhanced "Squishy" wobble ONLY when moving
                scaleX: isActive ? [1, 1.15, 0.85, 1.05, 0.95, 1] : 1,
                scaleY: isActive ? [1, 0.85, 1.15, 0.95, 1.05, 1] : 1
            }}
            transition={{
                x: { type: 'tween', ease: "linear", duration: 0 },
                y: { type: 'tween', ease: "linear", duration: 0 },
                scaleX: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                scaleY: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{ scale: 1.25, rotate: [0, -10, 10, 0], transition: { rotate: { duration: 0.5, repeat: Infinity } } }}
            className="inline-block"
        >
            <button
                className={`w-16 h-16 flex items-center justify-center bg-[var(--primary)] text-white font-bold text-lg rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer relative z-10 shrink-0 overflow-hidden`}
                tabIndex={-1}
            >
                {children}
            </button>
        </motion.div>
    );
};

export default MovingButton;
