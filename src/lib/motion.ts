export const easeOut = [0.22, 1, 0.36, 1] as const;

export const inView = {
  once: true,
  amount: 0.22,
  margin: "-8% 0px -6% 0px",
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export const staggerCards = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};
