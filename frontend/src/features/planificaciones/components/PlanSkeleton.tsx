import { motion } from 'framer-motion';

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export const PlanSkeleton = () => {
  return (
    <motion.div
      variants={skeletonVariants}
      className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8 flex flex-col h-full animate-pulse"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4"></div>
        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0"></div>
      </div>

      <div className="space-y-2 mb-6 flex-grow">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>

      <div className="space-y-3 mb-8 mt-auto">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-3/4"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
      </div>

      <div className="mt-auto h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
    </motion.div>
  );
};

