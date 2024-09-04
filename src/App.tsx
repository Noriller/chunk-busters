import { Board } from './components/board';

export default function App() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="mb-8 text-3xl font-bold text-white">
        Chunk-Busters: Don't cross the streams!
      </h1>
      <div className="h-full max-h-[90vmin] max-w-[90vmin]">
        <Board />
      </div>
    </div>
  );
}
