import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';

interface StatusStep {
  status: string;
  label: string;
  color: string;
}

const allSteps: StatusStep[] = [
  { status: 'PENDING', label: 'Pending', color: 'gray' },
  { status: 'CONFIRMED', label: 'Confirmed', color: 'blue' },
  { status: 'PREPARING', label: 'Preparing', color: 'amber' },
  { status: 'READY', label: 'Ready', color: 'purple' },
  { status: 'SERVED', label: 'Served', color: 'teal' },
  { status: 'COMPLETED', label: 'Completed', color: 'green' },
];

const colorMap: Record<string, { active: string; done: string; line: string }> = {
  gray: { active: 'border-gray-500 text-gray-500', done: 'bg-gray-500 border-gray-500 text-white', line: 'bg-gray-300' },
  blue: { active: 'border-blue-500 text-blue-500', done: 'bg-blue-500 border-blue-500 text-white', line: 'bg-blue-300' },
  amber: { active: 'border-amber-500 text-amber-500', done: 'bg-amber-500 border-amber-500 text-white', line: 'bg-amber-300' },
  purple: { active: 'border-purple-500 text-purple-500', done: 'bg-purple-500 border-purple-500 text-white', line: 'bg-purple-300' },
  teal: { active: 'border-teal-500 text-teal-500', done: 'bg-teal-500 border-teal-500 text-white', line: 'bg-teal-300' },
  green: { active: 'border-green-500 text-green-500', done: 'bg-green-500 border-green-500 text-white', line: 'bg-green-300' },
};

interface OrderStatusTimelineProps {
  currentStatus: string;
}

export function OrderStatusTimeline({ currentStatus }: OrderStatusTimelineProps) {
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="text-sm font-medium text-red-700 dark:text-red-300">Order Cancelled</span>
      </div>
    );
  }

  const currentIdx = allSteps.findIndex(s => s.status === currentStatus);

  return (
    <div className="flex items-center gap-1 py-2 overflow-x-auto">
      {allSteps.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        const colors = colorMap[step.color];

        return (
          <div key={step.status} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                initial={isActive ? { scale: 0.8 } : {}}
                animate={isActive ? { scale: [0.8, 1.1, 1] } : {}}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isDone ? colors.done : isActive ? colors.active + ' border-2' : 'border-gray-200 text-gray-300'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
              </motion.div>
              <span className={`text-[10px] mt-1 whitespace-nowrap ${isActive ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < allSteps.length - 1 && (
              <div className={`w-6 h-0.5 mx-0.5 rounded-full ${i < currentIdx ? colors.line : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
