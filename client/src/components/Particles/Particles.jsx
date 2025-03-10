import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
// import { loadAll } from "@/tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.



const ParticlesComponent = (props) => {
  const [init, setInit] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Initialize particles engine once
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Track window size for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const particlesLoaded = (container) => {
    // Avoid console.log in production for better performance
    if (process.env.NODE_ENV !== 'production') {
      console.log("Particles container loaded", container);
    }
  };

  // Adjust particle count based on screen size
  const getParticleCount = () => {
    if (windowWidth <= 768) {
      return 50; // Mobile
    } else if (windowWidth <= 1024) {
      return 80; // Tablet
    } else {
      return 100; // Desktop
    }
  };

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "#000000",
        },
      },
      fpsLimit: 60, // Reduced from 120 for better performance
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "repulse",
          },
          onHover: {
            enable: windowWidth > 768, // Disable hover effects on mobile for better performance
            mode: 'grab',
          },
        },
        modes: {
          push: {
            distance: 150,
            duration: 10,
          },
          grab: {
            distance: 120,
          },
        },
      },
      particles: {
        color: {
          value: "#FFFFFF",
        },
        links: {
          color: "#FFFFFF",
          distance: 120,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: windowWidth <= 768 ? 0.8 : 1, // Slower on mobile
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: getParticleCount(),
        },
        opacity: {
          value: 0.8, // Reduced from 1.0
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 2 }, // Reduced max size
        },
      },
      detectRetina: true,
    }),
    [windowWidth],
  );

  // Only render particles if initialized
  if (!init) return null;

  return <Particles id={props.id} init={particlesLoaded} options={options} />; 
};

export default ParticlesComponent;