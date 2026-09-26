import React from "react";
import { usePlatform } from "../context/PlatformContext.js";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts } = usePlatform();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((t) => {
        const icons = {
          success: <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />,
          warning: <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />,
          info: <Info className="h-4 w-4 text-indigo-500 shrink-0" />
        };

        const borders = {
          success: "border-emerald-500/30 bg-emerald-50/90 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-100",
          error: "border-red-500/30 bg-red-50/90 text-red-900 dark:bg-red-950/90 dark:text-red-100",
          warning: "border-amber-500/30 bg-amber-50/90 text-amber-900 dark:bg-amber-950/90 dark:text-amber-100",
          info: "border-indigo-500/30 bg-indigo-50/90 text-indigo-900 dark:bg-indigo-950/90 dark:text-indigo-100"
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-xl border backdrop-blur-md shadow-lg text-xs font-medium animate-in slide-in-from-bottom-3 duration-200 ${borders[t.type]}`}
          >
            {icons[t.type]}
            <p className="flex-1 leading-relaxed">{t.message}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
