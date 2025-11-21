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
      vx: number; // velocidad x
      vy: number; // velocidad y
      baseX: number; // posición base x
      baseY: number; // posición base y
    }>
  >([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Función para calcular distancia de un punto a una línea
  const distanceToLine = (
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Generar estrellas iniciales
  useEffect(() => {
    if (typeof window === "undefined") return;

    const newStars = Array.from({ length: 50 }, (_, i) => {
      const baseOpacity = Math.random() * 0.8 + 0.2;
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      return {
        id: i,
        x,
        y,
        baseX: x, // posición original
        baseY: y, // posición original
        size: Math.random() * 2 + 1,
        opacity: baseOpacity,
        baseOpacity,
        vx: (Math.random() - 0.5) * 0.5, // velocidad lenta en x
        vy: (Math.random() - 0.5) * 0.5, // velocidad lenta en y
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

    const animate = (currentTime: number) => {
      timeRef.current = currentTime * 0.001; // convertir a segundos
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calcular posiciones actualizadas sin modificar el estado
      const currentStars = stars.map((star) => ({
        ...star,
        x:
          star.baseX +
          Math.sin(timeRef.current * 0.5 + star.id) * 30 +
          star.vx * timeRef.current * 10,
        y:
          star.baseY +
          Math.cos(timeRef.current * 0.3 + star.id) * 20 +
          star.vy * timeRef.current * 10,
      }));

      // Dibujar conexiones entre estrellas cercanas con efecto rainbow
      currentStars.forEach((star, i) => {
        currentStars.slice(i + 1).forEach((otherStar) => {
          const distance = Math.sqrt(
            Math.pow(star.x - otherStar.x, 2) +
              Math.pow(star.y - otherStar.y, 2)
          );

          // Solo conectar estrellas cercanas
          if (distance < 120) {
            const opacity = ((120 - distance) / 120) * 0.3;

            // Calcular distancia del mouse a la línea
            const lineDistToMouse = distanceToLine(
              mousePosition.x,
              mousePosition.y,
              star.x,
              star.y,
              otherStar.x,
              otherStar.y
            );

            const mouseEffect =
              lineDistToMouse < 50 ? (50 - lineDistToMouse) / 50 : 0;
            const finalOpacity = Math.min(opacity + mouseEffect * 0.8, 1);

            if (mouseEffect > 0.2) {
              // Efecto rainbow cuando está cerca del mouse
              const gradient = ctx.createLinearGradient(
                star.x,
                star.y,
                otherStar.x,
                otherStar.y
              );
              const time = timeRef.current * 2;
              gradient.addColorStop(
                0,
                `hsla(${(time * 60) % 360}, 70%, 60%, ${finalOpacity})`
              );
              gradient.addColorStop(
                0.25,
                `hsla(${(time * 60 + 90) % 360}, 70%, 60%, ${finalOpacity})`
              );
              gradient.addColorStop(
                0.5,
                `hsla(${(time * 60 + 180) % 360}, 70%, 60%, ${finalOpacity})`
              );
              gradient.addColorStop(
                0.75,
                `hsla(${(time * 60 + 270) % 360}, 70%, 60%, ${finalOpacity})`
              );
              gradient.addColorStop(
                1,
                `hsla(${(time * 60) % 360}, 70%, 60%, ${finalOpacity})`
              );

              ctx.strokeStyle = gradient;
              ctx.lineWidth = 2 + mouseEffect * 2;
            } else {
              // Color normal púrpura
              ctx.strokeStyle = `rgba(168, 85, 247, ${finalOpacity})`;
              ctx.lineWidth = 1.5;
            }

            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(otherStar.x, otherStar.y);
            ctx.stroke();
          }
        });

        // Dibujar estrella con colores vibrantes y efectos rainbow
        const mouseDistance = Math.sqrt(
          Math.pow(mousePosition.x - star.x, 2) +
            Math.pow(mousePosition.y - star.y, 2)
        );

        // Efecto hover - las estrellas brillan más cerca del mouse
        const hoverEffect =
          mouseDistance < 80 ? ((80 - mouseDistance) / 80) * 0.8 : 0;
        const finalOpacity = Math.min(star.baseOpacity + hoverEffect, 1);
        const finalSize = star.size + hoverEffect * 2;

        // Color gradient para las estrellas con efecto rainbow
        const gradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          finalSize
        );

        if (hoverEffect > 0.4) {
          // Efecto rainbow cuando el mouse está muy cerca
          const time = timeRef.current * 3 + star.id;
          gradient.addColorStop(
            0,
            `hsla(${(time * 120) % 360}, 70%, 70%, ${finalOpacity})`
          );
          gradient.addColorStop(
            0.5,
            `hsla(${(time * 120 + 120) % 360}, 70%, 60%, ${finalOpacity * 0.7})`
          );
          gradient.addColorStop(
            1,
            `hsla(${(time * 120 + 240) % 360}, 70%, 50%, ${finalOpacity * 0.3})`
          );
        } else {
          // Colores normales púrpura-azul
          gradient.addColorStop(0, `rgba(168, 85, 247, ${finalOpacity})`);
          gradient.addColorStop(
            0.5,
            `rgba(59, 130, 246, ${finalOpacity * 0.7})`
          );
          gradient.addColorStop(1, `rgba(147, 51, 234, ${finalOpacity * 0.3})`);
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, finalSize, 0, Math.PI * 2);
        ctx.fill();

        // Efecto de brillo con colores rainbow
        if (hoverEffect > 0.3) {
          const glowGradient = ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            finalSize * 3
          );
          glowGradient.addColorStop(
            0,
            `rgba(168, 85, 247, ${hoverEffect * 0.4})`
          );
          glowGradient.addColorStop(
            0.3,
            `rgba(59, 130, 246, ${hoverEffect * 0.3})`
          );
          glowGradient.addColorStop(
            0.6,
            `rgba(16, 185, 129, ${hoverEffect * 0.2})`
          );
          glowGradient.addColorStop(1, `rgba(245, 101, 101, 0)`);

          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, finalSize * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

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
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 text-gray-800">
      {/* Fondo de constelación interactiva */}
      <ConstellationBackground />

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-emerald-500/10 z-0" />

      {/* Animated Shapes */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, -90, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full blur-3xl z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-3xl z-0"
      />

      <div className="container mx-auto px-4 z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600"
        >
          Build the Future <br /> with{" "}
          <span className="bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
            Next.js
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium"
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
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 group shadow-lg hover:shadow-xl transform hover:scale-105">
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-700 rounded-full font-semibold text-lg hover:bg-white hover:border-purple-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
            Learn More
          </button>
        </motion.div>
      </div>
    </section>
  );
}
