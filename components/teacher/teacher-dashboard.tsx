"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, List, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WordList, StudentResult } from "@/lib/types";
import { WordListForm } from "./word-list-form";
import { WordListCard } from "./word-list-card";
import { ResultsTable } from "./results-table";

interface TeacherDashboardProps {
  initialLists: WordList[];
  initialResults: (StudentResult & { list_title?: string })[];
}

export function TeacherDashboard({ initialLists, initialResults }: TeacherDashboardProps) {
  const [lists, setLists] = useState<WordList[]>(initialLists);
  const [showForm, setShowForm] = useState(false);

  const handleListCreated = (newList: WordList) => {
    setLists((prev) => [newList, ...prev]);
    setShowForm(false);
  };

  const handleListDeleted = (id: string) => {
    setLists((prev) => prev.filter((list) => list.id !== id));
  };

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Create word lists and monitor student progress
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Word List
          </Button>
        </div>
      </header>

      {showForm && (
        <div className="mb-8">
          <WordListForm
            onSuccess={handleListCreated}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <Tabs defaultValue="lists" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="lists" className="gap-2">
            <List className="w-4 h-4" />
            Word Lists
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Student Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lists">
          {lists.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border">
              <List className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No word lists yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first word list to get started
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Word List
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lists.map((list) => (
                <WordListCard
                  key={list.id}
                  list={list}
                  onDelete={handleListDeleted}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="results">
          <ResultsTable results={initialResults} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
