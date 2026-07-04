'use client';

import { motion } from 'framer-motion';
import { TechStackOrbs } from '@/components/tech-stack/TechStackOrbs';

export function TechStackSection() {
  return (
    <section id="tech-stack" className="section-alt relative py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 overflow-hidden border-t border-white/[0.04] scroll-mt-20">
      <div className="max-w-content-wide mx-auto relative z-10">
        <motion.div
          className="mb-8 md:mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '300px 0px' }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
          }}
        >
          <motion.span
            className="section-label"
            variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.2 } } }}
          >
            Skills
          </motion.span>
          <motion.h2
            className="section-title mt-3"
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } }}
          >
            My tech stack
          </motion.h2>
          <motion.p
            className="section-desc mt-3"
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } }}
          >
            Interactive magnetic orbs — push them away with your cursor.
          </motion.p>
        </motion.div>

        <TechStackOrbs />
      </div>
    </section>
  );
}
