import { useEffect, useState } from 'react';
import HexaEight from 'hexaeight-sessions/hexaeightsession.mjs';

export default function useHexaEight() {
  const [session, setSession] = useState(null);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      console.log('Initializing session...');
      const clientid = '87ADEEA59F56FE1427ABC682763DF8474BADFDBC';
      const tokenserverurl = 'https://anyemail.chat:8443';
      
      setLoading(true);
      try {
        const sessionInstance = new HexaEight();
        await sessionInstance.init(clientid, tokenserverurl, 'hexaeight-user-container');
        const initialized = await sessionInstance.ready();
        console.log('Session is initialized: ' + initialized);
        setSession(sessionInstance);
        setSessionInitialized(true);
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, []);

  return { session, sessionInitialized, loading };
}