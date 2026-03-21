'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';

const stats = [
  { label: 'Jobs Listed', value: 50000, suffix: '+' },
  { label: 'Companies', value: 10000, suffix: '+' },
  { label: 'Job Seekers', value: 200000, suffix: '+' },
  { label: 'Hiring Success Rate', value: 95, suffix: '%' },
];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with blue-violet gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-800 to-violet-800">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center text-white">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-blue-100/70 text-lg font-medium uppercase tracking-[3px] text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
