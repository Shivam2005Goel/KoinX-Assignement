import { Info } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface Props {
  savings: number;
}

export default function SavingsAlert({ savings }: Props) {
  return (
    <div className="mb-6 flex items-start sm:items-center justify-between gap-4 rounded-xl bg-green-500/10 border border-green-500/20 p-4 shadow-lg shadow-green-500/5 transition-all duration-500 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-green-500/20 p-2 text-green-400">
          <Info size={20} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-green-400 mb-0.5">Tax Savings Opportunities Found</h3>
          <p className="text-sm text-green-300">
            By harvesting selected assets, you will save <span className="font-bold text-white text-base">{formatCurrency(savings)}</span> implicitly on capital gains tax!
          </p>
        </div>
      </div>
    </div>
  );
}
