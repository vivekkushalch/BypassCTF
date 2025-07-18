import React, { useState, useEffect } from 'react';

const FinalSequence = () => {
  const [phase, setPhase] = useState('blackout'); // blackout, typing, crash, gif, completed
  const [typedText, setTypedText] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  const [crashIntensity, setCrashIntensity] = useState(0);
  // CHANGE: Added hacker text scrolling state
  const [hackerText, setHackerText] = useState('');
  const [matrixChars, setMatrixChars] = useState([]);

  const ACCESS_GRANTED = 'ACCESS GRANTED';
  // CHANGE: Added more hacker-style messages
  const HACKER_MESSAGES = [
    'PENETRATING FIREWALL...',
    'BYPASSING SECURITY PROTOCOLS...',
    'DECRYPTING DATABASE...',
    'INJECTING PAYLOAD...',
    'ESCALATING PRIVILEGES...',
    'ACCESSING MAINFRAME...',
    'DOWNLOADING CLASSIFIED DATA...',
    'ERASING DIGITAL FOOTPRINTS...'
  ];

  useEffect(() => {
    // Start sequence immediately when component mounts
    startSequence();
    // CHANGE: Initialize matrix effect
    initializeMatrix();
  }, []);

  // CHANGE: Added matrix background effect
  const initializeMatrix = () => {
    const chars = [];
    for (let i = 0; i < 50; i++) {
      chars.push({
        id: i,
        char: String.fromCharCode(0x30A0 + Math.random() * 96),
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.5 + Math.random() * 2
      });
    }
    setMatrixChars(chars);
  };

  const startSequence = () => {
    setPhase('blackout');
    setTypedText('');
    setIsGlitching(false);
    setCrashIntensity(0);

    // CHANGE: Added hacker text cycling during blackout
    const hackerInterval = setInterval(() => {
      setHackerText(HACKER_MESSAGES[Math.floor(Math.random() * HACKER_MESSAGES.length)]);
    }, 800);

    // Phase 1: 5 seconds blackout
    setTimeout(() => {
      clearInterval(hackerInterval);
      setPhase('typing');
      startTyping();
    }, 5000);
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
          setCrashIntensity(Math.min((index - 6) * 20, 100));
        }
        
        // At 'T' (last character), trigger massive crash
        if (index === ACCESS_GRANTED.length - 1) {
          clearInterval(typeInterval);
          triggerMassiveCrash();
        }
        
        index++;
      }
    }, 300);
  };

  const triggerMassiveCrash = () => {
    setPhase('crash');
    setCrashIntensity(100);
    
    // 10 seconds of intense crashing
    setTimeout(() => {
      setPhase('gif');
      setIsGlitching(false);
      setCrashIntensity(0);
      
      // CHANGE: Increased GIF display time from 5 seconds to 8 seconds
      setTimeout(() => {
        setPhase('completed');
      }, 8000);
    }, 10000);
  };

  const renderGlitchLayers = () => {
    if (!isGlitching) return null;
    
    const layers = [];
    for (let i = 0; i < 8; i++) {
      layers.push(
        <div
          key={i}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(${Math.random() * 360}deg, 
              rgba(255, 0, 0, ${0.1 + Math.random() * 0.4}), 
              rgba(0, 255, 0, ${0.1 + Math.random() * 0.4}), 
              rgba(0, 0, 0, ${0.1 + Math.random() * 0.4}))`,
            transform: `translate(${(Math.random() - 0.5) * 30}px, ${(Math.random() - 0.5) * 30}px) 
                       rotate(${(Math.random() - 0.5) * 10}deg)`,
            animation: `glitchMove ${0.05 + Math.random() * 0.15}s infinite`,
            opacity: crashIntensity / 100,
            mixBlendMode: 'screen'
          }}
        />
      );
    }
    return layers;
  };

  const renderCrashLines = () => {
    if (phase !== 'crash') return null;
    
    const lines = [];
    for (let i = 0; i < 80; i++) {
      lines.push(
        <div
          key={i}
          className="absolute"
          style={{
            width: `${20 + Math.random() * 80}%`,
            height: `${Math.random() * 8 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: `rgb(${Math.random() * 255}, ${Math.random() < 0.5 ? Math.random() * 255 : 0}, ${Math.random() < 0.3 ? Math.random() * 255 : 0})`,
            transform: `translateX(${Math.random() * 400 - 200}px) rotate(${Math.random() * 360}deg)`,
            animation: `crashLine ${0.03 + Math.random() * 0.1}s infinite`,
            opacity: 0.7 + Math.random() * 0.3
          }}
        />
      );
    }
    return lines;
  };

  const renderStaticNoise = () => {
    if (phase !== 'crash') return null;
    
    const noise = [];
    for (let i = 0; i < 200; i++) {
      noise.push(
        <div
          key={i}
          className="absolute bg-white"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random(),
            animation: `staticNoise ${0.02 + Math.random() * 0.05}s infinite`
          }}
        />
      );
    }
    return noise;
  };

  // CHANGE: Added matrix rain effect for more hacker feeling
  const renderMatrixRain = () => {
    if (phase === 'completed') return null;
    
    return matrixChars.map((char, index) => (
      <div
        key={char.id}
        className="absolute text-green-400 font-mono text-sm opacity-20"
        style={{
          left: `${char.x}%`,
          top: `${char.y}%`,
          animation: `matrixFall ${char.speed}s linear infinite`,
          animationDelay: `${index * 0.1}s`
        }}
      >
        {char.char}
      </div>
    ));
  };

  if (phase === 'completed') {
    return null; // Component disappears after sequence
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* CHANGE: Added matrix rain background */}
      <div className="absolute inset-0 overflow-hidden">
        {renderMatrixRain()}
      </div>
      
      {/* Glitch layers */}
      {renderGlitchLayers()}
      
      {/* Crash effects */}
      {renderCrashLines()}
      {renderStaticNoise()}

      {/* Blackout phase */}
      {phase === 'blackout' && (
        <div className="relative z-10">
          <div className="text-green-400 text-lg sm:text-xl md:text-2xl font-mono animate-pulse px-4 text-center mb-4">
            INITIALIZING SYSTEM...
          </div>
          {/* CHANGE: Added scrolling hacker messages */}
          <div className="text-green-300 text-sm sm:text-base font-mono px-4 text-center">
            {hackerText}
          </div>
          
        </div>
      )}

      {/* Typing and crash phases */}
      {(phase === 'typing' || phase === 'crash') && (
        <div className="relative z-10 px-4 max-w-full">
          <div 
            className={`text-green-400 font-mono font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-widest ${
              isGlitching ? 'animate-pulse' : ''
            } text-center break-words`}
            style={{
              textShadow: isGlitching ? 
                '0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 60px #00ff00, 0 0 80px #00ff00' : 
                '0 0 20px #00ff00',
              transform: isGlitching ? 
                `translate(${(Math.random() - 0.5) * 15}px, ${(Math.random() - 0.5) * 15}px) 
                 rotate(${(Math.random() - 0.5) * 5}deg)` : 
                'none',
              filter: crashIntensity > 50 ? `blur(${crashIntensity / 50}px)` : 'none'
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
                  animation: phase === 'crash' ? 
                    `glitchChar ${0.05 + Math.random() * 0.1}s infinite` : 
                    'none',
                  textShadow: phase === 'crash' ? 
                    `0 0 ${10 + Math.random() * 20}px rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})` : 
                    'inherit'
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CHANGE: Crash overlay effects - UPDATED: Maintained only black, green, red color scheme */}
      {phase === 'crash' && (
        <>
          <div className="absolute inset-0 bg-red-900 opacity-15 animate-pulse" />
          <div className="absolute inset-0 bg-green-900 opacity-12 animate-ping" />
          <div className="absolute inset-0 bg-red-800 opacity-10 animate-bounce" />
          <div className="absolute inset-0 bg-green-800 opacity-8" 
               style={{ animation: 'flash 0.1s infinite' }} />
        </>
      )}

      {/* GIF phase */}
      {phase === 'gif' && (
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="relative">
            {/* CHANGE: Adjusted GIF dimensions to prevent cutting and maintain aspect ratio */}
            <img
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGs2bXlpM2dzbzhrdjloMWEwazVmZm4zZWJmeWJ0eTA0YjB2dzFrNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Nx0rz3jtxtEre/giphy.gif"
              alt="Access Granted"
              className="w-72 h-54 sm:w-96 sm:h-72 md:w-[500px] md:h-[375px] lg:w-[600px] lg:h-[450px] xl:w-[700px] xl:h-[525px] object-contain rounded-2xl shadow-2xl animate-pulse"
              style={{
                filter: 'brightness(1.2) contrast(1.1) saturate(1.2)',
                boxShadow: '0 0 50px rgba(0, 255, 0, 0.5), 0 0 100px rgba(0, 255, 0, 0.3)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-black/20 to-red-600/20 rounded-2xl blur-xl animate-ping" />
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-black/10 to-red-600/10 rounded-2xl blur-2xl animate-pulse" />
          </div>
          {/* CHANGE: Added success message overlay - UPDATED: Made bold and moved to top */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-green-400 font-mono text-xl sm:text-2xl font-bold animate-pulse px-4 text-center">
            SYSTEM COMPROMISED
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes glitchMove {
          0% { transform: translate(0, 0) skew(0deg) scale(1); }
          20% { transform: translate(-5px, 5px) skew(2deg) scale(1.02); }
          40% { transform: translate(5px, -5px) skew(-2deg) scale(0.98); }
          60% { transform: translate(-5px, -5px) skew(1deg) scale(1.01); }
          80% { transform: translate(5px, 5px) skew(-1deg) scale(0.99); }
          100% { transform: translate(0, 0) skew(0deg) scale(1); }
        }
        
        @keyframes crashLine {
          0% { 
            transform: translateX(-200px) rotate(0deg); 
            opacity: 1; 
          }
          50% { 
            transform: translateX(0px) rotate(180deg); 
            opacity: 0.8; 
          }
          100% { 
            transform: translateX(200px) rotate(360deg); 
            opacity: 0; 
          }
        }
        
        @keyframes glitchChar {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          10% { transform: translate(-5px, 5px) rotate(2deg) scale(1.1); }
          20% { transform: translate(5px, -5px) rotate(-2deg) scale(0.9); }
          30% { transform: translate(-5px, -5px) rotate(1deg) scale(1.05); }
          40% { transform: translate(5px, 5px) rotate(-1deg) scale(0.95); }
          50% { transform: translate(-3px, 3px) rotate(3deg) scale(1.02); }
          60% { transform: translate(3px, -3px) rotate(-3deg) scale(0.98); }
          70% { transform: translate(-3px, -3px) rotate(2deg) scale(1.03); }
          80% { transform: translate(3px, 3px) rotate(-2deg) scale(0.97); }
          90% { transform: translate(-2px, 2px) rotate(1deg) scale(1.01); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }
        
        @keyframes staticNoise {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes flash {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.2; }
        }
        
        /* CHANGE: Added matrix rain animation */
        @keyframes matrixFall {
          0% { transform: translateY(-100vh); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FinalSequence;