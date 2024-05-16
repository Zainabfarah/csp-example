import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import config from './config';

// Skapa en Context för autentisering
const AuthContext = createContext();

// Hook för att använda AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider-komponenten som omsluter applikationen och tillhandahåller autentiseringstillstånd och funktioner
const AuthProvider = ({ children, onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tillstånd för att hålla koll på om användaren är autentiserad
  const [expiryTime, setExpiryTime] = useState(null); // Tillstånd för att hålla koll på sessionens utgångstid

  // Inloggningsfunktionen som lagrar token och utgångstid i localStorage och uppdaterar tillståndet
  const login = useCallback((token, expiry) => {
    localStorage.setItem('authToken', token); // Spara token i localStorage
    localStorage.setItem('expiryTime', expiry); // Spara utgångstid i localStorage
    setIsAuthenticated(true); // Uppdatera autentiseringstillståndet
    setExpiryTime(expiry); // Uppdatera utgångstidstillståndet
    onNavigate('/protected'); // Navigera till den skyddade sidan
  }, [onNavigate]);

  // Utloggningsfunktionen som rensar token och utgångstid från localStorage och uppdaterar tillståndet
  const logout = useCallback(() => {
    localStorage.removeItem('authToken'); // Ta bort token från localStorage
    localStorage.removeItem('expiryTime'); // Ta bort utgångstid från localStorage
    setIsAuthenticated(false); // Uppdatera autentiseringstillståndet
    setExpiryTime(null); // Rensa utgångstidstillståndet
    onNavigate('/login'); // Navigera till inloggningssidan
  }, [onNavigate]);

  // Effekt som körs vid första renderingen och när logout ändras
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Hämta token från localStorage
    const expiry = localStorage.getItem('expiryTime'); // Hämta utgångstid från localStorage

    // Om token och utgångstid finns och sessionen inte har gått ut, uppdatera tillståndet
    if (token && expiry && Date.now() < Number(expiry)) {
      setIsAuthenticated(true); // Uppdatera autentiseringstillståndet
      setExpiryTime(expiry); // Uppdatera utgångstidstillståndet
    } else {
      logout(); // Annars, logga ut användaren
    }
  }, []); // tom beroende-array så att den bara körs en gång vid montering

  // Effekt som körs när expiryTime ändras för att hantera automatisk utloggning
  useEffect(() => {
    if (expiryTime) {
      const timeout = setTimeout(() => {
        logout(); // Logga ut användaren när sessionen går ut
      }, expiryTime - Date.now());

      // Rensa timeout vid avmontering eller när expiryTime ändras
      return () => clearTimeout(timeout);
    }
  }, [expiryTime, logout]);

  // Effekt för att hantera användaraktivitet och förlänga sessionen
  useEffect(() => {
    const handleActivity = () => {
      if (expiryTime && Date.now() < Number(expiryTime)) {
        const newExpiry = Date.now() + config.inactivityTimeout; // Förläng utgångstiden baserat på inaktivitet
        localStorage.setItem('expiryTime', newExpiry); // Uppdatera utgångstiden i localStorage
        setExpiryTime(newExpiry); // Uppdatera utgångstidstillståndet
      } else {
        logout(); // Om sessionen har gått ut, logga ut användaren
      }
    };

    // Lägg till event listeners för användaraktivitet
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keypress', handleActivity);

    // Rensa event listeners vid avmontering
    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keypress', handleActivity);
    };
  }, [expiryTime, logout]);

  // Tillhandahåll AuthContext till barnkomponenter
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;




