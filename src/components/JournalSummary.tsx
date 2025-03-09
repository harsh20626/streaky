
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeeklyJournalSummary } from "@/lib/journal-utils";
import { Skeleton } from "@/components/ui/skeleton";

export function JournalSummary() {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        const data = await getWeeklyJournalSummary();
        setSummary(data);
      } catch (err) {
        console.error("Error loading journal summary:", err);
        setError("Failed to load journal summary. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Journal Summary</CardTitle>
        <CardDescription>AI-generated insights from your past 7 days of journaling</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : !summary || summary === "No journal entries in the past week." ? (
          <div className="text-muted-foreground text-center py-8">
            <p>No journal entries in the past week.</p>
            <p className="mt-2 text-sm">Start journaling to see AI-generated insights!</p>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{summary}</div>
        )}
      </CardContent>
    </Card>
  );
}
