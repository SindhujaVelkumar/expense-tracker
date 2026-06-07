type Toast = {
  id: number;
  message: string;
  type: "success" | "error";
};

type ToastProps = {
  toasts: Toast[];
};

export default function Toast({ toasts }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded shadow text-white text-sm ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}