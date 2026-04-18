import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { fetchCapitalGains, fetchHoldings } from '../api';
import type { CapitalGainsBase, CoinHolding } from '../api';

interface HarvestingContextType {
  initialGains: CapitalGainsBase | null;
  postGains: CapitalGainsBase | null;
  holdings: CoinHolding[];
  selectedCoins: Set<string>;
  loading: boolean;
  error: string | null;
  toggleCoin: (coinId: string, checked: boolean) => void;
  selectAll: (checked: boolean) => void;
  totalSavings: number;
}

const HarvestingContext = createContext<HarvestingContextType | undefined>(undefined);

export const HarvestingProvider = ({ children }: { children: ReactNode }) => {
  const [initialGains, setInitialGains] = useState<CapitalGainsBase | null>(null);
  const [holdings, setHoldings] = useState<CoinHolding[]>([]);
  const [selectedCoins, setSelectedCoins] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [gainsData, holdingsData] = await Promise.all([fetchCapitalGains(), fetchHoldings()]);
        setInitialGains(gainsData.capitalGains);
        setHoldings(holdingsData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleCoin = (coinId: string, checked: boolean) => {
    setSelectedCoins(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(coinId);
      } else {
        next.delete(coinId);
      }
      return next;
    });
  };

  const selectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCoins(new Set(holdings.map((h) => h.coin)));
    } else {
      setSelectedCoins(new Set());
    }
  };

  const postGains = useMemo(() => {
    if (!initialGains) return null;

    let updatedStcgProfits = initialGains.stcg.profits;
    let updatedStcgLosses = initialGains.stcg.losses;
    let updatedLtcgProfits = initialGains.ltcg.profits;
    let updatedLtcgLosses = initialGains.ltcg.losses;

    selectedCoins.forEach((coinId) => {
      const asset = holdings.find((h) => h.coin === coinId);
      if (!asset) return;

      if (asset.stcg.gain > 0) {
        updatedStcgProfits += asset.stcg.gain;
      } else if (asset.stcg.gain < 0) {
        updatedStcgLosses += Math.abs(asset.stcg.gain);
      }

      if (asset.ltcg.gain > 0) {
        updatedLtcgProfits += asset.ltcg.gain;
      } else if (asset.ltcg.gain < 0) {
        updatedLtcgLosses += Math.abs(asset.ltcg.gain);
      }
    });

    return {
      stcg: { profits: updatedStcgProfits, losses: updatedStcgLosses },
      ltcg: { profits: updatedLtcgProfits, losses: updatedLtcgLosses },
    };
  }, [initialGains, holdings, selectedCoins]);

  const totalSavings = useMemo(() => {
    if (!initialGains || !postGains) return 0;
    const initialNet = (initialGains.stcg.profits - initialGains.stcg.losses) + (initialGains.ltcg.profits - initialGains.ltcg.losses);
    const postNet = (postGains.stcg.profits - postGains.stcg.losses) + (postGains.ltcg.profits - postGains.ltcg.losses);
    return initialNet > postNet ? initialNet - postNet : 0;
  }, [initialGains, postGains]);

  return (
    <HarvestingContext.Provider 
      value={{ initialGains, postGains, holdings, selectedCoins, loading, error, toggleCoin, selectAll, totalSavings }}
    >
      {children}
    </HarvestingContext.Provider>
  );
};

export const useHarvesting = () => {
  const context = useContext(HarvestingContext);
  if (context === undefined) {
    throw new Error('useHarvesting must be used within a HarvestingProvider');
  }
  return context;
};
