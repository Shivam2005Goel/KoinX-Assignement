import { ArrowLeft, ArrowRight, Download, AlertTriangle } from 'lucide-react';
import { useHarvesting } from './context/HarvestingContext';
import PreHarvestCard from './components/PreHarvestCard';
import PostHarvestCard from './components/PostHarvestCard';
import HoldingsTable from './components/HoldingsTable';
import SavingsAlert from './components/SavingsAlert';

function App() {
  const { initialGains, postGains, holdings, loading, error, totalSavings } = useHarvesting();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0c10]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-400 font-medium">Fetching dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !initialGains || !postGains) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0c10]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md p-6 bg-red-900/10 rounded-xl border border-red-500/20">
          <AlertTriangle size={48} className="text-red-400 mb-2" />
          <h2 className="text-xl font-bold text-white">Error Loading Data</h2>
          <p className="text-red-200">{error || 'An unexpected error occurred. Please refresh.'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium shadow-md"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e0e2e5] font-sans pb-16">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#121419] px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm shadow-black/20">
        <button className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold tracking-wide">Tax Loss Harvesting</h1>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        
        {totalSavings > 0 && <SavingsAlert savings={totalSavings} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-6 items-start">
          <PreHarvestCard gains={initialGains} />
          <div className="hidden md:flex justify-center flex-col items-center h-full absolute inset-0 -mx-10 z-0 pointer-events-none opacity-20 transition-all duration-300">
              <ArrowRight size={80} className="text-white" />
          </div>
          <PostHarvestCard gains={postGains} />
        </div>

        <div className="bg-[#121419] rounded-xl border border-gray-800 shadow-xl overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-medium text-white mb-1">Holdings Selection</h2>
              <p className="text-sm text-gray-400">Select the assets you want to harvest to see tax savings.</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm px-4 py-2 rounded-lg font-medium shadow-md shadow-blue-500/20 active:scale-95">
              <Download size={16} /> Export Data
            </button>
          </div>
          
          <HoldingsTable holdings={holdings} />
        </div>
      </main>
    </div>
  );
}

export default App;
