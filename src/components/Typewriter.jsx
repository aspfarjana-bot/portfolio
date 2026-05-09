import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Typewriter = ({ texts, speed = 3500 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!texts || texts.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, speed);
    return () => clearInterval(timer);
  }, [texts, speed]);

  const currentText = texts[index] || "";

  return (
    <div className="relative h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
            key={index}
            className="flex whitespace-nowrap"
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {currentText.split("").map((char, i) => (
                <motion.span
                    key={i}
                    variants={{
                        hidden: { y: 30, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                        exit: { y: -30, opacity: 0 }
                    }}
                    transition={{
                        duration: 0.6,
                        ease: [0.2, 0.65, 0.3, 1],
                        delay: i * 0.04
                    }}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Typewriter;
