import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { isWebGLSupported, getOptimalParticleCount, isLowPowerDevice } from "./utils";

const SpaceBackground = () => {
  const [init, setInit] = useState(false);
  const [browserSupport, setBrowserSupport] = useState({
    webgl: true,
    lowPower: false
  });

  // Initialize particles engine
  useEffect(() => {
    // Check browser capabilities
    setBrowserSupport({
      webgl: isWebGLSupported(),
      lowPower: isLowPowerDevice()
    });

    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log("Space particles loaded", container);
  };

  // Calculate optimal settings based on device capabilities
  const optimalParticleCount = useMemo(() => getOptimalParticleCount(), []);
  const optimalFpsLimit = useMemo(() => browserSupport.lowPower ? 30 : 60, [browserSupport.lowPower]);

  // Configure the particles options
  const options = useMemo(() => ({
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
    background: {
      color: {
        value: "#000000", // Pure black background
      },
    },
    fpsLimit: optimalFpsLimit,
    particles: {
      groups: {
        smallStars: {
          number: {
            value: optimalParticleCount * 0.7,
          },
          opacity: {
            value: { min: 0.1, max: 1 },
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: { min: 0.5, max: 1.5 },
          },
          color: {
            value: ["#ffffff", "#f0f8ff", "#e6e6fa"],
          },
        },
        mediumStars: {
          number: {
            value: optimalParticleCount * 0.3,
          },
          opacity: {
            value: { min: 0.2, max: 1 },
            animation: {
              enable: true,
              speed: 0.3,
              minimumValue: 0.2,
              sync: false,
            },
          },
          size: {
            value: { min: 2, max: 4 },
          },
          color: {
            value: ["#ffffff", "#f8f8ff", "#fffafa", "#ffffe0"],
          },
        },
      },
      number: {
        value: optimalParticleCount,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: ["#ffffff", "#f0f8ff", "#e6e6fa", "#b0c4de"],
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: { min: 0.1, max: 1 },
        animation: {
          enable: true,
          speed: 0.5,
          minimumValue: 0.1,
          sync: false,
        },
      },
      size: {
        value: { min: 0.5, max: 3 },
        random: true,
      },
      move: {
        enable: true,
        speed: { min: 0.05, max: 0.25 }, // Reduced speed for more subtle movement
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out",
        },
      },
      // Enhanced twinkle effect
      twinkle: {
        particles: {
          enable: true,
          frequency: 0.05,
          opacity: 1,
          color: {
            value: ["#ffffff", "#ffffd0", "#ffff80"],
          }
        },
        lines: {
          enable: false,
        }
      },
      // Create parallax effect with different speeds based on particle size
      zIndex: {
        value: { min: -100, max: 100 },
        opacityRate: 0.5,
        sizeRate: 1,
        velocityRate: 1,
      },
    },
    // Shooting stars (disabled for low power devices) with reduced speed
    emitters: browserSupport.lowPower ? [] : [
      {
        direction: "top-left",
        rate: {
          delay: 12, // Less frequent
          quantity: 1,
        },
        particles: {
          move: {
            direction: "bottom-right",
            enable: true,
            speed: { min: 5, max: 10 }, // Reduced speed
            straight: true,
            outModes: {
              default: "out",
            },
          },
          opacity: {
            value: 1,
            animation: {
              enable: true,
              speed: 0.2,
              minimumValue: 0,
              sync: false,
              destroy: "min",
            },
          },
          size: {
            value: { min: 1, max: 3 },
          },
          life: {
            duration: {
              sync: true,
              value: 2, // Longer duration due to slower speed
            },
          },
          shape: {
            type: "line",
          },
          length: {
            value: { min: 10, max: 30 },
          },
          move: {
            path: {
              enable: true,
              delay: {
                value: 0.1,
              },
              options: {
                size: {
                  value: 0.5,
                },
                draw: false,
                generator: "perlinNoise",
                frequency: 0.1,
              },
            },
          },
        },
        position: {
          x: 100,
          y: 0,
        },
      },
      {
        direction: "top-right",
        rate: {
          delay: 20, // Less frequent
          quantity: 1,
        },
        particles: {
          move: {
            direction: "bottom-left",
            enable: true,
            speed: { min: 5, max: 10 }, // Reduced speed
            straight: true,
            outModes: {
              default: "out",
            },
          },
          opacity: {
            value: 1,
            animation: {
              enable: true,
              speed: 0.2,
              minimumValue: 0,
              sync: false,
              destroy: "min",
            },
          },
          size: {
            value: { min: 1, max: 3 },
          },
          life: {
            duration: {
              sync: true,
              value: 2, // Longer duration due to slower speed
            },
          },
          shape: {
            type: "line",
          },
          length: {
            value: { min: 10, max: 30 },
          },
          move: {
            path: {
              enable: true,
              delay: {
                value: 0.1,
              },
              options: {
                size: {
                  value: 0.5,
                },
                draw: false,
                generator: "perlinNoise",
                frequency: 0.1,
              },
            },
          },
        },
        position: {
          x: 0,
          y: 0,
        },
      },
    ],
    detectRetina: true,
    responsive: [
      {
        maxWidth: 768,
        options: {
          particles: {
            number: {
              value: 80,
            },
          },
          emitters: [
            {
              rate: {
                delay: 15,
              },
            },
            {
              rate: {
                delay: 30,
              },
            },
          ],
        },
      },
    ],
  }), [optimalParticleCount, optimalFpsLimit, browserSupport.lowPower]);

  // Fallback for devices that don't support canvas or WebGL
  if (!init || !browserSupport.webgl) {
    return (
      <div 
        className="fixed inset-0 bg-black z-[-1]"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 0)",
          backgroundSize: "50px 50px",
        }}
      />
    );
  }

  return <Particles id="space-particles" init={particlesLoaded} options={options} />;
};

export default SpaceBackground; 