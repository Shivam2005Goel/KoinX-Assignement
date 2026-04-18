import type { CapitalGainsBase } from '../api';
import { formatCurrency } from '../utils/format';
import { TrendingUp, TrendingDown, AlignRight, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  gains: CapitalGainsBase;
}

export default function PostHarvestCard({ gains }: Props) {
  const netStcg = gains.stcg.profits - gains.stcg.losses;
  const netLtcg = gains.ltcg.profits - gains.ltcg.losses;
  const realised = netStcg + netLtcg;

  const MetricRow = ({ label, profits, losses, net, isNetPositive }: any) => (
    <div className="flex flex-col mb-4 p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md shadow-inner transition-all">
      <h3 className="text-sm text-blue-100 font-medium mb-3 uppercase tracking-wider opacity-90">{label}</h3>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-[11px] text-blue-200 mb-1 flex items-center gap-1 opacity-80"><TrendingUp size={12} className="text-green-300" /> Profits</p>
          <p className="text-sm font-semibold text-white">{formatCurrency(profits)}</p>
        </div>
        <div>
          <p className="text-[11px] text-blue-200 mb-1 flex items-center gap-1 opacity-80"><TrendingDown size={12} className="text-red-300" /> Losses</p>
          <p className="text-sm font-semibold text-white">{formatCurrency(losses)}</p>
        </div>
      </div>
      <div className="pt-3 border-t border-white/20 flex justify-between items-center">
        <p className="text-xs text-blue-200 flex items-center gap-1 opacity-90"><AlignRight size={14} /> Net Gain</p>
        <p className={clsx("text-base font-bold", isNetPositive ? "text-white" : "text-red-200")}>
          {formatCurrency(net)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 border border-blue-500/50 p-6 shadow-blue-900/40 shadow-2xl z-10 group transition-all duration-300 transform md:scale-[1.02] hover:scale-[1.03]">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 group-hover:opacity-40 transition-opacity duration-700"></div>

      <div className="bg-white/15 rounded-xl px-3 py-1.5 inline-block mb-6 border border-white/20 backdrop-blur-md shadow-sm">
        <h2 className="text-sm font-medium text-white flex items-center gap-2">
          <Sparkles size={16} className="text-blue-200" /> After Harvesting State
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

      <div className="mt-6 flex flex-col items-center justify-center p-5 rounded-xl bg-gradient-to-b from-white/20 to-white/5 border border-white/20 backdrop-blur-sm shadow-md">
        <p className="text-sm text-blue-100 mb-1 font-medium">Realised Capital Gains</p>
        <p className={clsx("text-3xl font-extrabold tracking-tight drop-shadow-md", realised >= 0 ? "text-white" : "text-red-100")}>
          {formatCurrency(realised)}
        </p>
      </div>
    </div>
  );
}
