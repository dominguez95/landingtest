"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";

// Componente de constelación interactiva
const ConstellationBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      opacity: number;
      baseOpacity: number;
    }>
  >([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Generar estrellas iniciales
  useEffect(() => {
    if (typeof window === "undefined") return;

    const newStars = Array.from({ length: 50 }, (_, i) => {
      const baseOpacity = Math.random() * 0.8 + 0.2;
      return {
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        opacity: baseOpacity,
        baseOpacity,
      };
    });
    setStars(newStars);
  }, []);

  // Seguir el mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar conexiones entre estrellas cercanas
      stars.forEach((star, i) => {
        stars.slice(i + 1).forEach((otherStar) => {
          const distance = Math.sqrt(
            Math.pow(star.x - otherStar.x, 2) +
              Math.pow(star.y - otherStar.y, 2)
          );

          // Solo conectar estrellas cercanas
          if (distance < 120) {
            const opacity = ((120 - distance) / 120) * 0.3;

            // Efecto del mouse - si está cerca, aumentar opacidad
            const mouseDistToLine = Math.min(
              Math.sqrt(
                Math.pow(mousePosition.x - star.x, 2) +
                  Math.pow(mousePosition.y - star.y, 2)
              ),
              Math.sqrt(
                Math.pow(mousePosition.x - otherStar.x, 2) +
                  Math.pow(mousePosition.y - otherStar.y, 2)
              )
            );

            const mouseEffect =
              mouseDistToLine < 100 ? ((100 - mouseDistToLine) / 100) * 0.5 : 0;
            const finalOpacity = Math.min(opacity + mouseEffect, 0.8);

            ctx.strokeStyle = `rgba(255, 255, 255, ${finalOpacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(otherStar.x, otherStar.y);
            ctx.stroke();
          }
        });

        // Dibujar estrella
        const mouseDistance = Math.sqrt(
          Math.pow(mousePosition.x - star.x, 2) +
            Math.pow(mousePosition.y - star.y, 2)
        );

        // Efecto hover - las estrellas brillan más cerca del mouse
        const hoverEffect =
          mouseDistance < 80 ? ((80 - mouseDistance) / 80) * 0.8 : 0;
        const finalOpacity = Math.min(star.baseOpacity + hoverEffect, 1);
        const finalSize = star.size + hoverEffect * 2;

        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, finalSize, 0, Math.PI * 2);
        ctx.fill();

        // Efecto de brillo
        if (hoverEffect > 0.3) {
          ctx.fillStyle = `rgba(255, 255, 255, ${hoverEffect * 0.3})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, finalSize * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stars, mousePosition]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Fondo de constelación interactiva */}
      <ConstellationBackground />

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 z-0" />

      {/* Animated Shapes */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, -90, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl z-0"
      />

      <div className="container mx-auto px-4 z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
        >
          Build the Future <br /> with{" "}
          <span className="text-purple-500">Next.js</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto"
        >
          Experience the power of modern web development with stunning
          animations and incredible performance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-200 transition-colors flex items-center gap-2 group">
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-colors">
            Learn More
          </button>
        </motion.div>
      </div>
    </section>
  );
}
