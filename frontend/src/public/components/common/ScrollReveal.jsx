import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const PRESETS = {
  'fade-up': {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-down': {
    hidden: { opacity: 0, y: -32 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  'scale-in': {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
};

/**
 * ScrollReveal Component
 * Smooth viewport entrance animations powered by Framer Motion.
 */
export default function ScrollReveal({
  children,
  preset = 'fade-up',
  delay = 0,
  duration = 0.55,
  className = '',
  style = {},
  threshold = 0.15,
  once = true,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion || preset === 'none') {
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  const selectedPreset = PRESETS[preset] || PRESETS['fade-up'];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={selectedPreset}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // modern smooth bezier
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer
 * For smoothly revealing child cards with incremental delays.
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  delayChildren = 0.05,
  className = '',
  style = {},
  once = true,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={containerVariants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem
 * Child item inside a StaggerContainer
 */
export function StaggerItem({
  children,
  preset = 'fade-up',
  duration = 0.5,
  className = '',
  style = {},
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  const itemVariants = PRESETS[preset] || PRESETS['fade-up'];

  return (
    <motion.div
      variants={itemVariants}
      transition={{
        duration,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

