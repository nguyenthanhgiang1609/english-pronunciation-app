"use client";

import Link from "next/link";
import { ArrowLeft, Mic, MicOff, Volume2, SkipForward, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Word } from "@/lib/types";

interface WordCardProps {
  word: Word;
  wordIndex: number;
  totalWords: number;
  attempts: number;
  maxAttempts: number;
  isListening: boolean;
  showFeedback: boolean;
  feedbackType: "correct" | "incorrect" | "tryAgain" | null;
  spokenText: string;
  isSupported: boolean;
  speechError: string | null;
  onStartListening: () => void;
  onStopListening: () => void;
  onSkipWord: () => void;
  studentName: string;
  listTitle: string;
}

export function WordCard({
  word,
  wordIndex,
  totalWords,
  attempts,
  maxAttempts,
  isListening,
  showFeedback,
  feedbackType,
  spokenText,
  isSupported,
  speechError,
  onStartListening,
  onStopListening,
  onSkipWord,
  studentName,
  listTitle,
}: WordCardProps) {
  const progress = ((wordIndex) / totalWords) * 100;
  const attemptsLeft = maxAttempts - attempts;

  const speakWord = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word.text);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getFeedbackStyles = () => {
    switch (feedbackType) {
      case "correct":
        return "bg-green-50 border-green-500 dark:bg-green-950";
      case "incorrect":
        return "bg-red-50 border-red-500 dark:bg-red-950";
      case "tryAgain":
        return "bg-yellow-50 border-yellow-500 dark:bg-yellow-950";
      default:
        return "";
    }
  };

  const getFeedbackMessage = () => {
    switch (feedbackType) {
      case "correct":
        return { text: "Great job!", emoji: "🎉" };
      case "incorrect":
        return { text: "Nice try! Let's move on.", emoji: "👍" };
      case "tryAgain":
        return { text: `Try again! ${attemptsLeft} ${attemptsLeft === 1 ? "try" : "tries"} left.`, emoji: "💪" };
      default:
        return null;
    }
  };

  const feedback = getFeedbackMessage();

  if (!isSupported) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Speech Recognition Not Supported</h2>
            <p className="text-muted-foreground mb-4">
              Your browser doesn&apos;t support speech recognition. Please try using Chrome, Edge, or Safari.
            </p>
            <Button asChild>
              <Link href="/student">Go Back</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col p-6">
      <header className="max-w-2xl mx-auto w-full mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link href="/student">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Practice
          </Link>
        </Button>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm text-muted-foreground">Hi, {studentName}!</p>
            <h1 className="text-xl font-semibold">{listTitle}</h1>
          </div>
          <Badge variant="outline" className="text-base px-3 py-1">
            {wordIndex + 1} / {totalWords}
          </Badge>
        </div>
        <Progress value={progress} className="h-3" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <Card className={`w-full transition-all duration-300 border-2 ${showFeedback ? getFeedbackStyles() : ""}`}>
          <CardContent className="pt-8 pb-8">
            {/* Feedback Banner */}
            {feedback && showFeedback && (
              <div className="text-center mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="text-4xl mb-2 block">{feedback.emoji}</span>
                <p className="text-lg font-medium">{feedback.text}</p>
              </div>
            )}

            {/* Word Display */}
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground mb-2">Say this word:</p>
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-wide">
                {word.text}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={speakWord}
                className="gap-2 text-muted-foreground hover:text-primary"
              >
                <Volume2 className="w-4 h-4" />
                Hear pronunciation
              </Button>
            </div>

            {/* Spoken Text Display */}
            {spokenText && (
              <div className="text-center mb-6 p-4 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">You said:</p>
                <p className="text-xl font-medium">&quot;{spokenText}&quot;</p>
              </div>
            )}

            {/* Attempts Indicator */}
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: maxAttempts }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i < attempts
                      ? "bg-muted-foreground/30"
                      : "bg-primary"
                  }`}
                />
              ))}
            </div>

            {/* Microphone Button */}
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                onClick={isListening ? onStopListening : onStartListening}
                disabled={showFeedback && feedbackType !== "tryAgain"}
                className={`rounded-full w-24 h-24 transition-all duration-300 ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-10 h-10" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                {isListening ? "Listening... Click to stop" : "Click to start speaking"}
              </p>
            </div>

            {/* Skip Button */}
            {!showFeedback && attempts > 0 && (
              <div className="text-center mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkipWord}
                  className="text-muted-foreground"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip this word
                </Button>
              </div>
            )}

            {/* Error Display */}
            {speechError && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg text-center">
                <p className="text-sm text-destructive">{speechError}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
