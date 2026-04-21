"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Trophy, Star, RotateCcw, Home, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { saveStudentResult } from "@/lib/actions";
import type { WordList, AttemptData } from "@/lib/types";

interface PracticeCompleteProps {
  studentName: string;
  wordList: WordList;
  results: AttemptData[];
}

export function PracticeComplete({ studentName, wordList, results }: PracticeCompleteProps) {
  const [saved, setSaved] = useState(false);

  const correctCount = results.filter((r) => r.correct).length;
  const totalCount = results.length;
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const getPerformanceLevel = () => {
    if (percentage >= 90) return { label: "Amazing!", color: "text-green-600", stars: 3 };
    if (percentage >= 70) return { label: "Great Job!", color: "text-primary", stars: 2 };
    if (percentage >= 50) return { label: "Good Try!", color: "text-yellow-600", stars: 1 };
    return { label: "Keep Practicing!", color: "text-muted-foreground", stars: 0 };
  };

  const performance = getPerformanceLevel();

  useEffect(() => {
    // Save result to database
    const save = async () => {
      await saveStudentResult(wordList.id, studentName, correctCount, results);
      setSaved(true);
    };
    save();

    // Trigger confetti for good performance
    if (percentage >= 50) {
      const duration = percentage >= 90 ? 3000 : 1500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: percentage >= 90 ? 5 : 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#6366f1", "#22c55e", "#f59e0b"],
        });
        confetti({
          particleCount: percentage >= 90 ? 5 : 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#6366f1", "#22c55e", "#f59e0b"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [percentage, wordList.id, studentName, correctCount, results]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4">
            <div className="relative">
              <div className="p-4 rounded-full bg-primary/10">
                <Trophy className="w-12 h-12 text-primary" />
              </div>
              {performance.stars > 0 && (
                <div className="absolute -top-2 -right-2 flex">
                  {Array.from({ length: performance.stars }).map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              )}
            </div>
          </div>
          <CardTitle className="text-3xl">Practice Complete!</CardTitle>
          <p className={`text-xl font-medium mt-2 ${performance.color}`}>
            {performance.label}
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-muted-foreground mb-2">
              Great work, <span className="font-medium text-foreground">{studentName}</span>!
            </p>
          </div>

          {/* Score Display */}
          <div className="bg-muted rounded-xl p-6 mb-6">
            <div className="text-center mb-4">
              <p className="text-5xl font-bold text-primary">{percentage}%</p>
              <p className="text-muted-foreground mt-1">
                {correctCount} out of {totalCount} words correct
              </p>
            </div>
            <Progress value={percentage} className="h-4" />
          </div>

          {/* Word Results */}
          <div className="space-y-2 mb-6">
            <h3 className="font-medium text-sm text-muted-foreground mb-3">Your Results:</h3>
            {results.map((result, index) => (
              <div
                key={result.word_id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  result.correct ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{index + 1}.</span>
                  <span className="font-medium">{result.word_text}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {result.attempts} {result.attempts === 1 ? "try" : "tries"}
                  </Badge>
                  {result.correct ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/student">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href={`/student/practice/${wordList.id}`}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Practice Again
              </Link>
            </Button>
          </div>

          {saved && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Your result has been saved!
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
