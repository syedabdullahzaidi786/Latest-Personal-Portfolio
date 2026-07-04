'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Award, MapPin, Sparkles, ArrowRight } from 'lucide-react';

function CredentialCard({
  icon: Icon,
  title,
  subtitle,
  detail,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  detail: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative p-4 sm:p-5 rounded-xl border border-white/[0.12] bg-white/[0.07] transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.10] hover:shadow-[0_16px_48px_rgba(59,130,246,0.15)] group overflow-hidden">
      <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-gradient-to-b from-accent/70 via-accent/20 to-transparent shadow-[0_0_0px_transparent] transition-all duration-300 group-hover:w-[3px] group-hover:from-accent/80 group-hover:via-accent/30 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.2)]" />
      <div className="relative z-10 flex items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-accent/70">
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[var(--text-muted)] mb-1.5">{title}</p>
          <p className="text-[15px] font-semibold text-white leading-snug">{subtitle}</p>
          <p className="text-[14px] text-[var(--text-body)] mt-1 leading-relaxed">{detail}</p>
        </div>
      </div>
    </motion.div>
  );
}

const credentials = [
  { icon: GraduationCap, title: 'Education', subtitle: 'BS Business Administration', detail: 'FUUAST' },
  { icon: Award, title: 'Certification', subtitle: 'GIAIC Certified', detail: "Governor's Initiative for AI & Computing" },
  { icon: MapPin, title: 'Location', subtitle: 'Karachi, Pakistan', detail: 'Open to work-from-home opportunities' },
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const itemRightVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function AboutSection() {
  return (
    <section id="about" className="section-alt relative py-20 md:py-28">
      <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#08080c] z-20 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle at 40% 50%, rgba(59,130,246,0.08), transparent 60%)',
          }}
        />
      </div>

      <div className="max-w-content-wide mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '300px 0px' }}
          variants={containerVariants}
        >
          <div className="max-w-3xl ml-auto mr-0 md:mr-12 lg:mr-20 pl-4 md:pl-8">
            <div className="space-y-5">
              <motion.div variants={itemVariants} className="flex items-center gap-3">
                <span className="w-6 h-px bg-accent/50" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent/70">About Me</span>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h2 className="section-title">SYED ABDULLAH ZAIDI</h2>
              </motion.div>

              <motion.div variants={itemVariants}>
                <p className="text-lead sm:text-[1.125rem] text-[var(--text-primary)] font-medium">
                  Full Stack Developer | Agentiic AI Developer | AI Enthusiast & Tech Innovator
                  <span className="text-[var(--text-body)] font-normal ml-2">— Karachi, Pakistan</span>
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-3 max-w-2xl">
                <p className="text-body sm:text-lead text-[var(--text-primary)] leading-[1.75]">
                  Versatile full-stack developer and aspiring AI innovator, with hands-on experience building responsive frontend interfaces using Next.js, TypeScript, Tailwind CSS, and Bootstrap, and scalable backend systems with Node.js, Python, and PHP.
                </p>
                <p className="text-body sm:text-lead text-[var(--text-primary)] leading-[1.75]">
                  Proficient in version control (Git, GitHub) and familiar with containerization using Docker, I enjoy crafting end-to-end web solutions from concept to deployment. Currently exploring AI technologies, building custom GPTs, and developing intelligent automation tools to merge web development with AI capabilities.
                    Always eager to learn, collaborate, and contribute to impactful tech projects.
                </p>
                <p className="text-body sm:text-lead text-[var(--text-primary)] leading-[1.75]">
                   Lets connect and discuss full-stack development, AI innovation, and next-gen web solutions!
                </p>
              </motion.div>

              <motion.div variants={itemRightVariants} className="flex flex-wrap gap-3">
                <motion.a
                  href="#contact"
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-accent text-sm font-bold text-white tracking-wide shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.3)] hover:bg-accent/90 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4" />
                  {"Let's Talk"}
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
                <motion.a
                  href="/cv.pdf"
                  download
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] text-sm font-semibold text-[var(--text-body)] hover:text-white hover:border-accent/30 hover:bg-accent-subtle transition-all duration-300"
                >
                  Download CV
                </motion.a>
                <motion.a
                  href="mailto:syedabdullahzaidi786@gmail.com"
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] text-sm font-semibold text-[var(--text-body)] hover:text-white hover:border-accent/30 hover:bg-accent-subtle transition-all duration-300"
                >
                  syedabdullahzaidi786@gmail.com
                </motion.a>
              </motion.div>

              <motion.div variants={itemRightVariants} className="flex items-center gap-3">
                <span className="w-6 h-px bg-accent/30" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)]">Credentials</span>
              </motion.div>

              <motion.div variants={itemRightVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {credentials.map((cred) => (
                  <CredentialCard key={cred.title} {...cred} />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
