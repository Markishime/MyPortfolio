"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[99999] bg-cyber-deeper flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 cinematic-vignette" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center relative z-10"
          >
            <h1 className="text-4xl sm:text-5xl font-display font-bold gradient-text cinematic-title-glow mb-4">
              MLC
            </h1>
            <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden mx-auto shadow-[0_0_20px_rgba(0,255,170,0.15)]">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-cyber rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(count, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="mt-3 text-xs font-mono text-gray-600">
              {Math.min(count, 100)}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
