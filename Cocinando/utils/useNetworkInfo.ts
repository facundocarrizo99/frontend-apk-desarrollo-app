import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useNetworkInfo() {
  const [netInfo, setNetInfo] = useState<NetInfoState | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetInfo(state);
    });
    // Fetch initial state
    NetInfo.fetch().then(setNetInfo);
    return () => unsubscribe();
  }, []);

  return {
    isConnected: netInfo?.isConnected ?? false,
    isInternetReachable: netInfo?.isInternetReachable ?? false,
    isMetered: netInfo?.details?.isConnectionExpensive ?? false,
    type: netInfo?.type,
    details: netInfo?.details,
  };
}