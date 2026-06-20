import { useState, useEffect } from "react";

export function useIsExporting() {
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkState = () => {
      setIsExporting(!!(window as any).isGitlyticsExporting);
    };

    const handleBusy = (e: any) => {
      setIsExporting(e.detail.busy);
    };

    window.addEventListener("gitlytics-export-busy", handleBusy);
    checkState();

    return () => {
      window.removeEventListener("gitlytics-export-busy", handleBusy);
    };
  }, []);

  return isExporting;
}
