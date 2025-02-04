import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import SnowCanvas from '../pages/components/SnowCanvas'; // 컴포넌트 경로에 맞게 수정

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <SnowCanvas />
      <Component {...pageProps} />
    </div>
  );
}
