import { notFound } from "next/navigation";
import { getWordList } from "@/lib/actions";
import { PracticeSession } from "@/components/student/practice-session";

interface PracticePageProps {
  params: Promise<{ id: string }>;
}

export default async function PracticePage({ params }: PracticePageProps) {
  const { id } = await params;
  const { data: wordList, error } = await getWordList(id);

  if (error || !wordList) {
    notFound();
  }

  return <PracticeSession wordList={wordList} />;
}
