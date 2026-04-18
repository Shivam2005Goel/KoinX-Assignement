import { useState } from 'react';
import type { CoinHolding } from '../api';
import { formatCurrency, formatCrypto } from '../utils/format';
import { clsx } from 'clsx';
import { Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { useHarvesting } from '../context/HarvestingContext';

interface Props {
  holdings: CoinHolding[];
}

export default function HoldingsTable({ holdings }: Props) {
  const { selectedCoins, selectAll, toggleCoin } = useHarvesting();
  const [viewAll, setViewAll] = useState(false);

  // For the 'View All' feature, let's limit initially to 5 rows
  const INITIAL_ROWS = 5;
  const displayedHoldings = viewAll ? holdings : holdings.slice(0, INITIAL_ROWS);
  const hasMore = holdings.length > INITIAL_ROWS;

  const allSelected = holdings.length > 0 && selectedCoins.size === holdings.length;
  const isPartiallySelected = selectedCoins.size > 0 && selectedCoins.size < holdings.length;

  return (
    <div className="w-full flex flex-col">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400 border-collapse min-w-[800px]">
          <thead className="bg-[#181a20] text-xs uppercase text-gray-500 border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 w-[50px] sticky left-0 z-10 bg-[#181a20] whitespace-nowrap align-middle shadow-[1px_0_0_#1f2937]">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    className={clsx(
                      "h-4 w-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900 cursor-pointer accent-blue-600 transition",
                      isPartiallySelected ? "opacity-75" : ""
                    )}
                    checked={allSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = isPartiallySelected;
                      }
                    }}
                    onChange={(e) => selectAll(e.target.checked)}
                  />
                </div>
              </th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Asset</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Holdings <br/><span className="text-[10px] text-gray-600 font-normal">Avg Buy Price</span></th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Current Price</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Short-Term Gain <br/><span className="text-[10px] text-gray-600 font-normal">Balance</span></th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Long-Term Gain <br/><span className="text-[10px] text-gray-600 font-normal">Balance</span></th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Amount to Sell</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50 bg-[#121419]">
            {displayedHoldings.map((asset) => {
              const isSelected = selectedCoins.has(asset.coin);
              
              return (
                <tr 
                  key={asset.coin} 
                  className={clsx(
                    "transition-all duration-200 cursor-pointer",
                    isSelected ? "bg-blue-900/10 hover:bg-blue-900/15 border-l-2 border-l-blue-500" : "bg-transparent hover:bg-white/[0.02] border-l-2 border-l-transparent"
                  )}
                  onClick={() => toggleCoin(asset.coin, !isSelected)}
                >
                  <td className="px-6 py-4 sticky left-0 z-10 bg-[#121419] whitespace-nowrap align-middle shadow-[1px_0_0_#1f2937]"
                      onClick={(e) => e.stopPropagation()} // prevent double toggling when clicking exactly on the checkbox
                  >
                     <div className="flex items-center" style={{ marginLeft: isSelected ? '-2px' : '0' }}>
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900 cursor-pointer accent-blue-600 transition"
                        checked={isSelected}
                        onChange={(e) => toggleCoin(asset.coin, e.target.checked)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1f2229] flex-shrink-0 border border-gray-800">
                      <img src={asset.logo} alt={asset.coin} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                       <span className="font-semibold">{asset.coinName}</span>
                       <span className="text-xs text-gray-500 font-normal">{asset.coin}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{formatCrypto(asset.totalHolding)} {asset.coin}</span>
                      <span className="text-xs text-gray-500 mt-0.5">{formatCurrency(asset.averageBuyPrice)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-white font-medium">{formatCurrency(asset.currentPrice)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex flex-col">
                      <span className={clsx(
                        "font-medium tracking-wide",
                        asset.stcg.gain > 0 ? "text-green-400" : asset.stcg.gain < 0 ? "text-red-400" : "text-white"
                      )}>
                        {asset.stcg.gain > 0 ? '+' : ''}{formatCurrency(asset.stcg.gain)}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5 w-[140px] truncate" title={asset.stcg.balance.toString()}>
                        {formatCrypto(asset.stcg.balance)} {asset.coin}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={clsx(
                        "font-medium tracking-wide",
                        asset.ltcg.gain > 0 ? "text-green-400" : asset.ltcg.gain < 0 ? "text-red-400" : "text-white"
                      )}>
                         {asset.ltcg.gain > 0 ? '+' : ''}{formatCurrency(asset.ltcg.gain)}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5 w-[140px] truncate" title={asset.ltcg.balance.toString()}>
                        {formatCrypto(asset.ltcg.balance)} {asset.coin}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider border border-blue-500/20 shadow-inner">
                        <Settings2 size={12} />
                        {formatCrypto(asset.totalHolding)} {asset.coin}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {holdings.length === 0 && (
          <div className="text-center py-12 text-gray-500">
             No holdings available.
          </div>
        )}
      </div>

      {/* View All Button */}
      {hasMore && (
        <div className="border-t border-gray-800 p-3 bg-[#121419] flex justify-center sticky left-0 right-0">
          <button 
            onClick={() => setViewAll(!viewAll)}
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors w-full sm:w-auto"
          >
            {viewAll ? (
              <>View Less <ChevronUp size={16} /></>
            ) : (
              <>View All ({holdings.length}) <ChevronDown size={16} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
