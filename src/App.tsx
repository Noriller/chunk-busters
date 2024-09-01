import { Board } from './components/board';

export default function App() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900 p-4">
      <div className="rainbow-shadow relative z-0 aspect-square max-h-[90vmin] w-full max-w-[90vmin]">
        <Board />
      </div>
    </div>
  );
}
