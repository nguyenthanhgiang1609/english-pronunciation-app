"use client";

import { BarChart3 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudentResult } from "@/lib/types";

interface ResultsTableProps {
  results: (StudentResult & { list_title?: string })[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border">
        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No results yet</h3>
        <p className="text-muted-foreground">
          Student results will appear here after they complete practice sessions
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Student Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Word List</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Words</TableHead>
                <TableHead className="text-right">Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => {
                const totalWords = result.attempts_data.length;
                const correctWords = result.attempts_data.filter(
                  (a) => a.correct
                ).length;
                const percentage =
                  totalWords > 0
                    ? Math.round((correctWords / totalWords) * 100)
                    : 0;

                return (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">
                      {result.student_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{result.list_title || "Unknown"}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={percentage >= 80 ? "default" : percentage >= 50 ? "secondary" : "outline"}
                        className={
                          percentage >= 80
                            ? "bg-green-600"
                            : percentage >= 50
                            ? "bg-yellow-500 text-yellow-950"
                            : ""
                        }
                      >
                        {percentage}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {correctWords}/{totalWords}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(result.completed_at).toLocaleDateString()}{" "}
                      {new Date(result.completed_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
