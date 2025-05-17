import { useEffect, useState, useCallback } from "react";

type Props = {
  initialCount?: number;
};

export function Counter({ initialCount = 0 }: Props): JSX.Element {
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (count < 0) {
      console.warn("Count is negative!");
    }
  }, [count]);

  const increment = useCallback(() => {
    try {
      if (count >= 10) {
        throw new Error("Max count reached");
      }
      setCount((prev) => prev + 1);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [count]);

  const reset = () => {
    setCount(initialCount);
    setError(null);
  };

  return (
    <div className="counter-dwdw">
      <h1 className="title">Counter: {count}</h1>
      {error && <p className="error">{error}</p>}
      <button onClick={increment}>Increment</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
