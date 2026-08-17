"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Operator = "+" | "-" | "×" | "÷";

interface BasicCalculatorLabels {
  clear: string;
  error: string;
}

function applyOperator(a: number, b: number, op: Operator): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
  }
}

// Rounds away long floating-point tails (e.g. 0.1 + 0.2) before display.
function formatDisplay(value: number): string {
  if (!Number.isFinite(value)) return "";
  const rounded = Math.round(value * 1e9) / 1e9;
  return rounded.toLocaleString("en-US", { maximumFractionDigits: 9, useGrouping: false });
}

export function BasicCalculatorWidget({ labels }: { labels: BasicCalculatorLabels }) {
  const [display, setDisplay] = useState("0");
  const [accumulator, setAccumulator] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<Operator | null>(null);
  const [overwrite, setOverwrite] = useState(true);
  const [isError, setIsError] = useState(false);

  const inputDigit = useCallback(
    (digit: string) => {
      if (isError) return;
      if (overwrite) {
        setDisplay(digit === "." ? "0." : digit);
        setOverwrite(false);
        return;
      }
      if (digit === "." && display.includes(".")) return;
      if (display.replace("-", "").replace(".", "").length >= 12) return;
      setDisplay(display === "0" && digit !== "." ? digit : display + digit);
    },
    [isError, overwrite, display],
  );

  const chooseOperator = useCallback(
    (op: Operator) => {
      if (isError) return;
      const current = Number(display);
      if (accumulator === null) {
        setAccumulator(current);
      } else if (!overwrite && pendingOp) {
        setAccumulator(applyOperator(accumulator, current, pendingOp));
      }
      setPendingOp(op);
      setOverwrite(true);
    },
    [isError, display, accumulator, overwrite, pendingOp],
  );

  const equals = useCallback(() => {
    if (isError || accumulator === null || pendingOp === null) return;
    const result = applyOperator(accumulator, Number(display), pendingOp);
    if (!Number.isFinite(result)) {
      setDisplay(labels.error);
      setIsError(true);
    } else {
      setDisplay(formatDisplay(result));
    }
    setAccumulator(null);
    setPendingOp(null);
    setOverwrite(true);
  }, [isError, accumulator, pendingOp, display, labels.error]);

  const clear = useCallback(() => {
    setDisplay("0");
    setAccumulator(null);
    setPendingOp(null);
    setOverwrite(true);
    setIsError(false);
  }, []);

  function toggleSign() {
    if (isError || display === "0") return;
    setDisplay(display.startsWith("-") ? display.slice(1) : `-${display}`);
  }

  const percent = useCallback(() => {
    if (isError) return;
    setDisplay(formatDisplay(Number(display) / 100));
    setOverwrite(true);
  }, [isError, display]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;

      if (e.key >= "0" && e.key <= "9") {
        inputDigit(e.key);
        return;
      }
      switch (e.key) {
        case ".":
          inputDigit(".");
          break;
        case "+":
          chooseOperator("+");
          break;
        case "-":
          chooseOperator("-");
          break;
        case "*":
        case "x":
        case "X":
          chooseOperator("×");
          break;
        case "/":
          e.preventDefault();
          chooseOperator("÷");
          break;
        case "%":
          percent();
          break;
        case "Enter":
        case "=":
          e.preventDefault();
          equals();
          break;
        case "Escape":
        case "Backspace":
          clear();
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clear, chooseOperator, equals, inputDigit, percent]);

  const keys: { label: string; onClick: () => void; variant?: "primary" | "secondary"; wide?: boolean; ariaLabel?: string }[] = [
    { label: "C", onClick: clear, variant: "secondary", ariaLabel: labels.clear },
    { label: "±", onClick: toggleSign, variant: "secondary" },
    { label: "%", onClick: percent, variant: "secondary" },
    { label: "÷", onClick: () => chooseOperator("÷"), variant: "secondary" },
    { label: "7", onClick: () => inputDigit("7") },
    { label: "8", onClick: () => inputDigit("8") },
    { label: "9", onClick: () => inputDigit("9") },
    { label: "×", onClick: () => chooseOperator("×"), variant: "secondary" },
    { label: "4", onClick: () => inputDigit("4") },
    { label: "5", onClick: () => inputDigit("5") },
    { label: "6", onClick: () => inputDigit("6") },
    { label: "-", onClick: () => chooseOperator("-"), variant: "secondary" },
    { label: "1", onClick: () => inputDigit("1") },
    { label: "2", onClick: () => inputDigit("2") },
    { label: "3", onClick: () => inputDigit("3") },
    { label: "+", onClick: () => chooseOperator("+"), variant: "secondary" },
    { label: "0", onClick: () => inputDigit("0"), wide: true },
    { label: ".", onClick: () => inputDigit(".") },
    { label: "=", onClick: equals, variant: "primary" },
  ];

  return (
    <div className="mx-auto max-w-xs rounded-xl border border-border bg-card p-4 shadow-sm">
      <div
        dir="ltr"
        className="mb-4 overflow-x-auto rounded-lg border border-input bg-muted px-4 py-4 text-end text-3xl font-semibold tabular-nums"
      >
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {keys.map((key) => (
          <Button
            key={key.label + (key.wide ? "-wide" : "")}
            type="button"
            variant={key.variant ?? "ghost"}
            onClick={key.onClick}
            aria-label={key.ariaLabel ?? key.label}
            className={`h-12 text-lg ${key.wide ? "col-span-2" : ""} ${key.variant === undefined ? "border border-border" : ""}`}
          >
            {key.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
