"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { createWordList } from "@/lib/actions";
import type { Word, WordList } from "@/lib/types";

interface WordListFormProps {
  onSuccess: (list: WordList) => void;
  onCancel: () => void;
}

function parseWordsFromText(text: string): Word[] {
  // Split by commas and newlines, trim whitespace, filter empty strings
  return text
    .split(/[,\n]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0)
    .map((text) => ({ id: crypto.randomUUID(), text }));
}

export function WordListForm({ onSuccess, onCancel }: WordListFormProps) {
  const [title, setTitle] = useState("");
  const [wordsText, setWordsText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a title for the word list");
      return;
    }

    const parsedWords = parseWordsFromText(wordsText);
    if (parsedWords.length === 0) {
      setError("Please add at least one word");
      return;
    }

    setIsSubmitting(true);
    const result = await createWordList(title.trim(), parsedWords);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.data) {
      onSuccess(result.data);
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Create New Word List</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">List Title</FieldLabel>
              <Input
                id="title"
                placeholder="e.g., Animals, Colors, Food..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="words">Words (one per line or comma-separated)</FieldLabel>
              <Textarea
                id="words"
                placeholder="e.g., habitat, conservation, sea turtle, panda"
                value={wordsText}
                onChange={(e) => setWordsText(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter words separated by commas or new lines
              </p>
            </Field>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create List"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
