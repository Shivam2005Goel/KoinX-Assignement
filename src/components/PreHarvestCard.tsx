import type { CapitalGainsBase } from '../api';
import { formatCurrency } from '../utils/format';
import { TrendingUp, TrendingDown, AlignRight, PieChart } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  gains: CapitalGainsBase;
}

export default function PreHarvestCard({ gains }: Props) {
  const netStcg = gains.stcg.profits - gains.stcg.losses;
  const netLtcg = gains.ltcg.profits - gains.ltcg.losses;
  const realised = netStcg + netLtcg;

  const MetricRow = ({ label, profits, losses, net, isNetPositive }: any) => (
    <div className="flex flex-col mb-4 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
      <h3 className="text-sm text-gray-400 font-medium mb-3 uppercase tracking-wider">{label}</h3>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-[11px] text-gray-500 mb-1 flex items-center gap-1"><TrendingUp size={12} className="text-green-400" /> Profits</p>
          <p className="text-sm font-semibold text-white">{formatCurrency(profits)}</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-500 mb-1 flex items-center gap-1"><TrendingDown size={12} className="text-red-400" /> Losses</p>
          <p className="text-sm font-semibold text-white">{formatCurrency(losses)}</p>
        </div>
      </div>
      <div className="pt-3 border-t border-white/10 flex justify-between items-center">
        <p className="text-xs text-gray-400 flex items-center gap-1"><AlignRight size={14} /> Net Gain</p>
        <p className={clsx("text-base font-bold", isNetPositive ? "text-green-400" : "text-red-400")}>
          {formatCurrency(net)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1e26] to-[#121419] border border-gray-800 p-6 shadow-2xl relative z-10 group transition-all duration-300 hover:border-gray-600">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gray-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
      
      <div className="bg-gray-800/50 rounded-xl px-3 py-1.5 inline-block mb-6 border border-gray-700 backdrop-blur-md">
        <h2 className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <PieChart size={16} className="text-gray-400" /> Pre-Harvesting State
        </h2>
      </div>

      <MetricRow 
        label="Short-Term (STCG)" 
        profits={gains.stcg.profits} 
        losses={gains.stcg.losses} 
        net={netStcg} 
        isNetPositive={netStcg >= 0}
      />
      <MetricRow 
        label="Long-Term (LTCG)" 
        profits={gains.ltcg.profits} 
        losses={gains.ltcg.losses} 
        net={netLtcg} 
        isNetPositive={netLtcg >= 0}
      />

      <div className="mt-6 flex flex-col items-center justify-center p-5 rounded-xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
        <p className="text-sm text-gray-400 mb-1 font-medium">Realised Capital Gains</p>
        <p className={clsx("text-3xl font-extrabold tracking-tight drop-shadow-sm", realised >= 0 ? "text-green-400" : "text-red-400")}>
          {formatCurrency(realised)}
        </p>
      </div>
    </div>
  );
}
