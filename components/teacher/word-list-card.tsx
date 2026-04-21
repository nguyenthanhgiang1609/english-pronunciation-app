"use client";

import { useState } from "react";
import { Copy, Check, Trash2, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { deleteWordList } from "@/lib/actions";
import type { WordList } from "@/lib/types";

interface WordListCardProps {
  list: WordList;
  onDelete: (id: string) => void;
}

export function WordListCard({ list, onDelete }: WordListCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const practiceUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/student/practice/${list.id}`
    : `/student/practice/${list.id}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(practiceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteWordList(list.id);
    setIsDeleting(false);

    if (!result.error) {
      onDelete(list.id);
    }
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{list.title}</CardTitle>
            <CardDescription className="mt-1">
              {new Date(list.created_at).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {list.words.length} words
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {list.words.slice(0, 5).map((word) => (
            <Badge key={word.id} variant="outline" className="text-xs">
              {word.text}
            </Badge>
          ))}
          {list.words.length > 5 && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              +{list.words.length - 5} more
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyLink}
            className="flex-1 gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={practiceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Word List?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete &quot;{list.title}&quot; and all
                  associated student results. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
