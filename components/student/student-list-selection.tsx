"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WordList } from "@/lib/types";

interface StudentListSelectionProps {
  lists: WordList[];
}

export function StudentListSelection({ lists }: StudentListSelectionProps) {
  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          
        </Button>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-accent/20">
              <Mic className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Choose a Practice List</h1>
          <p className="text-muted-foreground mt-2">
            Select a word list to start practicing your pronunciation
          </p>
        </div>
      </header>

      {lists.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No word lists available</h3>
            <p className="text-muted-foreground">
              Ask your teacher to create a word list for you to practice
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {lists.map((list) => (
            <Link key={list.id} href={`/student/practice/${list.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center justify-between">
                    {list.title}
                    <Badge variant="secondary">{list.words.length} words</Badge>
                  </CardTitle>
                  <CardDescription>
                    Created {new Date(list.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {list.words.slice(0, 4).map((word) => (
                      <Badge key={word.id} variant="outline" className="text-xs">
                        {word.text}
                      </Badge>
                    ))}
                    {list.words.length > 4 && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        +{list.words.length - 4} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
