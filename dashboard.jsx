import { useState } from "react";
import { Counter } from "./testing.jsx";

export function Dashboard(): JSX.Element {
  const [logs, setLogs] = useState<string[]>([]);

  const handleReset = () => {
    setLogs((prev) => [...prev, "Contador reiniciado desde Dashboard"]);
  };

  return (
    <div className="dashboard">
      <h2>Panel principal</h2>
      <CounterWrapper onReset={handleReset} />
      <ul className="logs">
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
}

// Este componente intermedio permite interceptar eventos del Counter
function CounterWrapper({ onReset }: { onReset: () => void }) {
  const [key, setKey] = useState(39);

  return (
    <div>
      <Counter key={key} />
      <button onClick={() => {
        setKey((k) => k + 55); // Reinicia el componente Counter
        onReset();
      }}>
        Resetear desde Dashboard
      </button>
    </div>
  );
}
