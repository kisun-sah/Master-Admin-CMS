import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useInView, animate } from 'framer-motion';

const PRESETS = {
  'fade-up': {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-down': {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: -36 },
    visible: { opacity: 1, x: 0 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: 36 },
    visible: { opacity: 1, x: 0 },
  },
  'scale-in': {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  'card-reveal': {
    hidden: { opacity: 0, y: 28, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
};

/**
 * ScrollReveal Component
 * Smooth viewport entrance animations powered by Motion (Framer Motion).
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
  staggerDelay = 0.09,
  delayChildren = 0.05,
  className = '',
  style = {},
  once = true,
  threshold = 0.1,
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
      viewport={{ once, amount: threshold }}
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
 * Child item inside a StaggerContainer with card-reveal entrance.
 */
export function StaggerItem({
  children,
  preset = 'card-reveal',
  duration = 0.55,
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

  const itemVariants = PRESETS[preset] || PRESETS['card-reveal'] || PRESETS['fade-up'];

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

/**
 * AnimatedCard
 * Individual or staggered card wrapper with subtle desktop-only hover lift.
 */
export function AnimatedCard({
  children,
  preset = 'card-reveal',
  hoverLift = true,
  duration = 0.55,
  delay = 0,
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

  const itemVariants = PRESETS[preset] || PRESETS['card-reveal'];

  return (
    <motion.div
      variants={itemVariants}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        hoverLift
          ? {
              y: -5,
              transition: { duration: 0.25, ease: 'easeOut' },
            }
          : undefined
      }
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * CounterReveal
 * Smooth count-up animation for numerical statistics when entering the viewport.
 * Example inputs: "100+", "98%", "5x", "10+"
 */
export function CounterReveal({
  value,
  duration = 1.6,
  className = '',
  style = {},
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(() => {
    return shouldReduceMotion ? value : '0';
  });

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }
    if (!isInView) return;

    const str = String(value ?? '');
    const match = str.match(/^([^0-9.]*)([0-9.]+)(.*)$/);
    if (!match) {
      setDisplayValue(str);
      return;
    }

    const prefix = match[1] || '';
    const targetNum = parseFloat(match[2]);
    const suffix = match[3] || '';
    const isFloat = match[2].includes('.');

    if (isNaN(targetNum)) {
      setDisplayValue(str);
      return;
    }

    const controls = animate(0, targetNum, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        const formatted = isFloat ? latest.toFixed(1) : Math.round(latest);
        setDisplayValue(`${prefix}${formatted}${suffix}`);
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration, shouldReduceMotion]);

  return (
    <span ref={ref} className={className} style={style}>
      {displayValue}
    </span>
  );
}

/**
 * FadeUp convenience helper
 */
export function FadeUp({ children, delay = 0, duration = 0.55, className = '', ...props }) {
  return (
    <ScrollReveal preset="fade-up" delay={delay} duration={duration} className={className} {...props}>
      {children}
    </ScrollReveal>
  );
}

/**
 * FadeLeft convenience helper
 */
export function FadeLeft({ children, delay = 0, duration = 0.55, className = '', ...props }) {
  return (
    <ScrollReveal preset="slide-left" delay={delay} duration={duration} className={className} {...props}>
      {children}
    </ScrollReveal>
  );
}

/**
 * FadeRight convenience helper
 */
export function FadeRight({ children, delay = 0, duration = 0.55, className = '', ...props }) {
  return (
    <ScrollReveal preset="slide-right" delay={delay} duration={duration} className={className} {...props}>
      {children}
    </ScrollReveal>
  );
}

/**
 * ScaleIn convenience helper
 */
export function ScaleIn({ children, delay = 0, duration = 0.55, className = '', ...props }) {
  return (
    <ScrollReveal preset="scale-in" delay={delay} duration={duration} className={className} {...props}>
      {children}
    </ScrollReveal>
  );
}

/**
 * ImageReveal convenience helper
 */
export function ImageReveal({
  children,
  delay = 0.1,
  duration = 0.7,
  className = '',
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

