export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const inView = {
  once: true,
  amount: 0.18,
  margin: "-8% 0px -6% 0px",
} as const;

export const inViewCard = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -8% 0px",
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: easeOut },
  },
};

export const riseScale = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

export const staggerCards = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerFast = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};
