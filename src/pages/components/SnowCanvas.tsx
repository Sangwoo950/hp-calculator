// components/SnowCanvas.tsx
import { useEffect, useRef } from 'react';

export default function SnowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // 눈 내리는 애니메이션 구현 예시
    const getRandomRadius = () => Math.random() * 1 + 0.5;
    const getRandomSpeed = () => Math.random() * 0.3 + 0.1;
    const getRandomDir = () => [-1, 1][Math.floor(Math.random() * 2)];

    const Snow = {
      data: [] as {
        x: number;
        y: number;
        size: number;
        speed: number;
        dir: number;
      }[],
      canvasWidth: canvas.clientWidth,
      canvasHeight: canvas.clientHeight,

      init() {
        this.make();
        this.loop();
      },

      loop() {
        this.move();
        this.draw();
        window.requestAnimationFrame(() => this.loop());
      },

      make() {
        const data = [];
        for (let i = 0; i < 200; i++) {
          const x = Math.random() * this.canvasWidth;
          const y = Math.random() * this.canvasHeight;
          const size = getRandomRadius();
          const speed = getRandomSpeed();
          const dir = getRandomDir();
          data.push({ x, y, size, speed, dir });
        }
        this.data = data;
      },

      move() {
        this.data = this.data.map((item) => {
          item.x += item.dir * item.speed;
          item.y += item.speed;

          // 화면 벗어남 체크
          const isMinOverPositionX = -item.size > item.x;
          const isMaxOverPositionX = item.x > this.canvasWidth;
          const isOverPositionY = item.y > this.canvasHeight;

          if (isMinOverPositionX || isMaxOverPositionX) {
            item.dir *= -1;
          }
          if (isOverPositionY) {
            item.y = -item.size;
          }
          return item;
        });
      },

      draw() {
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.fillStyle = '#0f1018';
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.data.forEach((item) => {
          ctx.beginPath();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
        });
      },
    };

    Snow.init();

    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      Snow.canvasWidth = canvas.clientWidth;
      Snow.canvasHeight = canvas.clientHeight;
      Snow.make();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: -1, // 다른 콘텐츠 뒤에 위치하도록 설정
      }}
    />
  );
}
