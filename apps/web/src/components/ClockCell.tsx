interface ClockCellProps {
  char: string;
  active: boolean;
}

export function ClockCell({ char, active }: ClockCellProps) {
  return (
    <span
      className="flex items-center justify-center select-none transition-all duration-200"
      style={{
        color: active ? "#ffffff" : "#27272a",
        textShadow: active ? "0 0 8px rgba(255,255,255,0.3)" : "none",
      }}
    >
      {char}
    </span>
  );
}
