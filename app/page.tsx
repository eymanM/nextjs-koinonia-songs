import SongsList from '@/components/SongsList';
import { SongProvider } from '@/components/SongContext';

export default function Home() {
  return (
    <SongProvider>
      <main className="min-h-screen bg-background">
        <SongsList />
      </main>
    </SongProvider>
  );
}