"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface NameEntryProps {
  listTitle: string;
  onSubmit: (name: string) => void;
}

export function NameEntry({ listTitle, onSubmit }: NameEntryProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <Button variant="ghost" asChild className="absolute top-6 left-6">
        <Link href="/student">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
      </Button>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 rounded-2xl bg-primary/10 mb-3">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Ready to Practice?</CardTitle>
          <CardDescription className="text-base">
            You&apos;re about to practice: <span className="font-medium text-foreground">{listTitle}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  What&apos;s your name?
                </FieldLabel>
                <Input
                  id="name"
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg"
                  autoFocus
                />
              </Field>
              <Button
                type="submit"
                disabled={!name.trim()}
                className="w-full text-lg py-6 rounded-xl"
                size="lg"
              >
                Start Practice
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
