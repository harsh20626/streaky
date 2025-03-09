
import { JournalSummary } from "@/components/JournalSummary";

export function AnalyticsContainer() {
  return (
    <div className="space-y-8 animate-fade-in">
      <JournalSummary />
      {/* We want to include the original TaskAnalytics content below our new content */}
    </div>
  );
}
