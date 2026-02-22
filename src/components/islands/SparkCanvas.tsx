import { useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export function SparkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const sparks: Spark[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6,
      size: 1 + Math.random() * 2,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      frame = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const spark of sparks) {
        spark.x += spark.vx;
        spark.y += spark.vy;
        if (spark.y < -20 || spark.x < -20 || spark.x > canvas.width + 20) {
          spark.x = Math.random() * canvas.width;
          spark.y = canvas.height + 20;
        }
        ctx.fillStyle = Math.random() > 0.2 ? '#0066FF' : '#FFB300';
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    render();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden="true" />;
}
