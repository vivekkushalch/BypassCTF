import { useEffect,useState } from "react";

const FinalSequence = () => {
  const [phase, setPhase] = useState('typing'); // typing, glitch, popup, whitescreen
  const [typedText, setTypedText] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  const ACCESS_GRANTED = 'ACCESS GRANTED';

  useEffect(() => {
    // Clear localStorage data immediately when component mounts
    clearStorageData();
    // Start the sequence
    startSequence();
  }, []);

  const clearStorageData = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('password');
      // Clear any other relevant data if needed
      console.log('Storage data cleared');
    } catch (error) {
      console.log('Storage clear attempted');
    }
  };

  const startSequence = () => {
    setPhase('typing');
    setTypedText('');
    setIsGlitching(false);
    setGlitchIntensity(0);

    // Start typing animation
    startTyping();
  };

  const startTyping = () => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < ACCESS_GRANTED.length) {
        const currentChar = ACCESS_GRANTED[index];
        setTypedText(ACCESS_GRANTED.substring(0, index + 1));
        
        // Start glitching after 'A' is typed (after "ACCESS ")
        if (index >= 7) {
          setIsGlitching(true);
          setGlitchIntensity(Math.min((index - 6) * 25, 100));
        }
        
        // At last character, trigger massive glitch phase
        if (index === ACCESS_GRANTED.length - 1) {
          clearInterval(typeInterval);
          triggerGlitchPhase();
        }
        
        index++;
      }
    }, 300);
  };

  const triggerGlitchPhase = () => {
    setPhase('glitch');
    setGlitchIntensity(100);
    
    // After 8 seconds of intense glitching, show popup
    setTimeout(() => {
      setIsGlitching(false);
      setPhase('popup');
      
      // After 6 seconds, show white screen
      setTimeout(() => {
        setPhase('whitescreen');
        
        // After 6 more seconds, reload the window
        setTimeout(() => {
          window.location.reload();
        }, 6000);
      }, 6000);
    }, 8000);
  };

  const renderGlitchEffects = () => {
    if (!isGlitching) return null;
    
    const effects = [];
    
    // Glitch layers
    for (let i = 0; i < 12; i++) {
      effects.push(
        <div
          key={`glitch-${i}`}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(${Math.random() * 360}deg, 
              rgba(255, 0, 0, ${0.1 + Math.random() * 0.5}), 
              rgba(0, 255, 0, ${0.1 + Math.random() * 0.5}), 
              rgba(0, 0, 255, ${0.1 + Math.random() * 0.3}))`,
            transform: `translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 50}px) 
                       rotate(${(Math.random() - 0.5) * 15}deg)`,
            opacity: glitchIntensity / 100,
            mixBlendMode: Math.random() > 0.5 ? 'screen' : 'multiply',
            animation: `glitchMove ${0.05 + Math.random() * 0.15}s infinite`
          }}
        />
      );
    }
    
    // Static noise
    for (let i = 0; i < 300; i++) {
      effects.push(
        <div
          key={`noise-${i}`}
          className="absolute"
          style={{
            width: `${Math.random() * 6 + 1}px`,
            height: `${Math.random() * 6 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: Math.random() > 0.5 ? '#ffffff' : '#000000',
            opacity: Math.random() * 0.8,
            animation: `staticNoise ${0.02 + Math.random() * 0.05}s infinite`
          }}
        />
      );
    }
    
    // Scan lines
    for (let i = 0; i < 100; i++) {
      effects.push(
        <div
          key={`line-${i}`}
          className="absolute"
          style={{
            width: '100%',
            height: `${Math.random() * 4 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: '0',
            background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
            transform: `translateX(${Math.random() * 400 - 200}px)`,
            animation: `scanLine ${0.1 + Math.random() * 0.2}s infinite`
          }}
        />
      );
    }
    
    return effects;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Typing Phase */}
      {phase === 'typing' && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          {/* Glitch effects during typing */}
          {isGlitching && renderGlitchEffects()}
          
          <div className="relative z-10 px-4 max-w-full">
            <div 
              className={`text-green-400 font-mono font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-widest ${
                isGlitching ? 'animate-pulse' : ''
              } text-center break-words`}
              style={{
                textShadow: isGlitching ? 
                  '0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 60px #00ff00' : 
                  '0 0 20px #00ff00',
                transform: isGlitching ? 
                  `translate(${(Math.random() - 0.5) * 15}px, ${(Math.random() - 0.5) * 15}px) 
                   rotate(${(Math.random() - 0.5) * 5}deg)` : 
                  'none',
                filter: glitchIntensity > 50 ? `blur(${glitchIntensity / 50}px)` : 'none'
              }}
            >
              {typedText.split('').map((char, index) => (
                <span
                  key={index}
                  className={`inline-block ${
                    isGlitching && index >= 7 ? 'animate-bounce' : ''
                  }`}
                  style={{
                    color: isGlitching && index >= 7 ? 
                      `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})` : 
                      '#00ff00',
                    transform: isGlitching && index >= 7 ? 
                      `rotate(${(Math.random() - 0.5) * 20}deg) 
                       scale(${0.6 + Math.random() * 0.8}) 
                       translate(${(Math.random() - 0.5) * 10}px, ${(Math.random() - 0.5) * 10}px)` : 
                      'none',
                    animation: isGlitching && index >= 7 ? 
                      `glitchChar ${0.05 + Math.random() * 0.1}s infinite` : 
                      'none',
                    textShadow: isGlitching && index >= 7 ? 
                      `0 0 ${10 + Math.random() * 20}px rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})` : 
                      'inherit'
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Glitch Phase */}
      {phase === 'glitch' && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          {/* Intense glitch effects */}
          {renderGlitchEffects()}
          
          {/* Main glitch overlay */}
          <div className="absolute inset-0 bg-red-900 opacity-20 animate-pulse" />
          <div className="absolute inset-0 bg-green-900 opacity-15 animate-ping" />
          <div 
            className="absolute inset-0 bg-blue-900 opacity-10" 
            style={{ animation: 'flash 0.1s infinite' }} 
          />
          
          {/* Show the complete ACCESS GRANTED text with heavy glitching */}
          <div className="relative z-10 text-center px-4">
            <div 
              className="text-green-400 font-mono font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-widest animate-pulse break-words"
              style={{
                textShadow: '0 0 30px #00ff00, 0 0 60px #00ff00, 0 0 90px #00ff00',
                transform: `translate(${(Math.random() - 0.5) * 25}px, ${(Math.random() - 0.5) * 25}px) 
                           rotate(${(Math.random() - 0.5) * 10}deg)`,
                filter: `blur(${Math.random() * 3}px)`
              }}
            >
              {ACCESS_GRANTED.split('').map((char, index) => (
                <span
                  key={index}
                  className="inline-block animate-bounce"
                  style={{
                    color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
                    transform: `rotate(${(Math.random() - 0.5) * 30}deg) 
                               scale(${0.5 + Math.random() * 1}) 
                               translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px)`,
                    animation: `glitchChar ${0.03 + Math.random() * 0.07}s infinite`,
                    textShadow: `0 0 ${15 + Math.random() * 25}px rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
            <div 
              className="text-red-500 font-mono text-lg sm:text-xl mt-4 animate-bounce"
              style={{
                textShadow: '0 0 15px #ff0000',
                transform: `translate(${(Math.random() - 0.5) * 15}px, ${(Math.random() - 0.5) * 15}px)`
              }}
            >
              SYSTEM OVERLOAD
            </div>
          </div>
        </div>
      )}

      {/* Popup Phase */}
      {phase === 'popup' && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="bg-red-900 border-2 border-red-500 rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="text-red-400 text-2xl sm:text-3xl font-bold mb-4 animate-pulse">
              ⚠️ ALERT ⚠️
            </div>
            <div className="text-white text-lg sm:text-xl font-semibold">
              Sorry, our system is compromised.
            </div>
            <div className="text-red-300 text-base sm:text-lg mt-2">
              You are late to BYPA$$ it.Now you can play for the leaderboard
            </div>
            <div className="mt-6 w-full bg-red-800 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full animate-pulse"
                style={{ width: '100%' }}
              ></div>
            </div>
            <div className="text-red-400 text-sm mt-2 opacity-75">
              Initiating emergency protocols...
            </div>
          </div>
        </div>
      )}

      {/* White Screen Phase */}
      {phase === 'whitescreen' && (
        <div className="absolute inset-0 bg-white flex items-center justify-center">
          <div className="text-gray-400 text-xl font-mono animate-pulse">
            Reloading...
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes glitchMove {
          0% { transform: translate(0, 0) skew(0deg) scale(1); }
          20% { transform: translate(-10px, 10px) skew(5deg) scale(1.05); }
          40% { transform: translate(10px, -10px) skew(-5deg) scale(0.95); }
          60% { transform: translate(-10px, -10px) skew(3deg) scale(1.02); }
          80% { transform: translate(10px, 10px) skew(-3deg) scale(0.98); }
          100% { transform: translate(0, 0) skew(0deg) scale(1); }
        }
        
        @keyframes staticNoise {
          0% { opacity: 1; }
          25% { opacity: 0; }
          50% { opacity: 1; }
          75% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes scanLine {
          0% { 
            transform: translateX(-100%); 
            opacity: 1; 
          }
          50% { 
            transform: translateX(0%); 
            opacity: 0.8; 
          }
          100% { 
            transform: translateX(100%); 
            opacity: 0; 
          }
        }
        
        @keyframes glitchChar {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          10% { transform: translate(-8px, 8px) rotate(5deg) scale(1.2); }
          20% { transform: translate(8px, -8px) rotate(-5deg) scale(0.8); }
          30% { transform: translate(-8px, -8px) rotate(3deg) scale(1.1); }
          40% { transform: translate(8px, 8px) rotate(-3deg) scale(0.9); }
          50% { transform: translate(-5px, 5px) rotate(8deg) scale(1.05); }
          60% { transform: translate(5px, -5px) rotate(-8deg) scale(0.95); }
          70% { transform: translate(-5px, -5px) rotate(4deg) scale(1.08); }
          80% { transform: translate(5px, 5px) rotate(-4deg) scale(0.92); }
          90% { transform: translate(-3px, 3px) rotate(2deg) scale(1.02); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default FinalSequence;