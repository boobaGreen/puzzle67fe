import { useState } from "react";

// Componente per una singola casella
interface HexBoxProps {
  initial: string;
  range: string[];
  onChange: (value: string) => void;
}

const HexBox = ({ initial, range, onChange }: HexBoxProps) => {
  const [index, setIndex] = useState(range.indexOf(initial));

  const increment = () => {
    const newIndex = (index + 1) % range.length;
    setIndex(newIndex);
    onChange(range[newIndex]);
  };

  const decrement = () => {
    const newIndex = (index - 1 + range.length) % range.length;
    setIndex(newIndex);
    onChange(range[newIndex]);
  };

  return (
    <div className="flex flex-col items-center m-2">
      <button className="bg-gray-200 p-1 rounded" onClick={increment}>
        ↑
      </button>
      <div className="bg-gray-300 text-center py-2 px-4 rounded w-12">
        {range[index]}
      </div>
      <button className="bg-gray-200 p-1 rounded" onClick={decrement}>
        ↓
      </button>
    </div>
  );
};

export default HexBox;
