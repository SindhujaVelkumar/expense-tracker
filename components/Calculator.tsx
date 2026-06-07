type ParsedLine = {
  label: string;
  amount: number;
  type: "income" | "expense" | "ignored";
};

type CalculatorProps = {
  content: string;
};

function parseLine(line: string): ParsedLine {
  const trimmed = line.trim();

  if (!trimmed.startsWith("+") && !trimmed.startsWith("-")) {
    return { label: trimmed, amount: 0, type: "ignored" };
  }

  const withoutSign = trimmed.slice(1).trim();

  // Must contain Rs. OR a number with at least 2 digits to be valid
  const hasRs = /Rs\.?/i.test(withoutSign);
  const hasAmount = /\d{2,}/.test(withoutSign);
  if (!hasRs && !hasAmount) {
    return { label: withoutSign, amount: 0, type: "ignored" };
  }

  const type = trimmed.startsWith("+") ? "income" : "expense";
  const numberMatch = withoutSign.match(/[\d,]+(\.\d+)?/);
  if (!numberMatch) return { label: withoutSign, amount: 0, type: "ignored" };

  const amount = parseFloat(numberMatch[0].replace(/,/g, ""));
  const label = withoutSign.split(/Rs\.?|[\d,]+/)[0].replace(/-$/, "").trim();

  return { label, amount, type };
}

export default function Calculator({ content }: CalculatorProps) {
  const lines = content.split("\n");
  const parsed = lines.map(parseLine).filter((l) => l.type !== "ignored");

  const totalIncome = parsed
    .filter((l) => l.type === "income")
    .reduce((sum, l) => sum + l.amount, 0);

  const totalExpenses = parsed
    .filter((l) => l.type === "expense")
    .reduce((sum, l) => sum + l.amount, 0);

  const balance = totalIncome - totalExpenses;

  if (parsed.length === 0) return null;

  return (
    <div className="border-t pt-4 mt-4 flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
        Summary
      </h2>

      <div className="flex flex-col gap-1">
        {parsed.map((line, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-300">{line.label || "—"}</span>
            <span className={line.type === "income" ? "text-green-400" : "text-red-400"}>
              {line.type === "income" ? "+" : "-"}₹{line.amount.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t pt-3 flex flex-col gap-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Income</span>
          <span className="text-green-400">₹{totalIncome.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Expenses</span>
          <span className="text-red-400">₹{totalExpenses.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between font-bold mt-1">
          <span>Balance</span>
          <span className={balance >= 0 ? "text-green-400" : "text-red-400"}>
            ₹{balance.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}