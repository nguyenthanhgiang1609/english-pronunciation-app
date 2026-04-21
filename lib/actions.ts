"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Word, WordList, StudentResult, AttemptData } from "./types";

export async function createWordList(
  title: string,
  words: Word[]
): Promise<{ data: WordList | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("word_lists")
    .insert({
      title,
      words: JSON.stringify(words),
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath("/teacher");
  return {
    data: {
      ...data,
      words: typeof data.words === "string" ? JSON.parse(data.words) : data.words,
    },
    error: null,
  };
}

export async function getWordLists(): Promise<{
  data: WordList[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("word_lists")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return {
    data: data.map((item) => ({
      ...item,
      words: typeof item.words === "string" ? JSON.parse(item.words) : item.words,
    })),
    error: null,
  };
}

export async function getWordList(
  id: string
): Promise<{ data: WordList | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("word_lists")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return {
    data: {
      ...data,
      words: typeof data.words === "string" ? JSON.parse(data.words) : data.words,
    },
    error: null,
  };
}

export async function deleteWordList(
  id: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.from("word_lists").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/teacher");
  return { error: null };
}

export async function saveStudentResult(
  listId: string,
  studentName: string,
  score: number,
  attemptsData: AttemptData[]
): Promise<{ data: StudentResult | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("student_results")
    .insert({
      list_id: listId,
      student_name: studentName,
      score,
      attempts_data: JSON.stringify(attemptsData),
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return {
    data: {
      ...data,
      attempts_data:
        typeof data.attempts_data === "string"
          ? JSON.parse(data.attempts_data)
          : data.attempts_data,
    },
    error: null,
  };
}

export async function getStudentResults(
  listId: string
): Promise<{ data: StudentResult[] | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("student_results")
    .select("*")
    .eq("list_id", listId)
    .order("completed_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return {
    data: data.map((item) => ({
      ...item,
      attempts_data:
        typeof item.attempts_data === "string"
          ? JSON.parse(item.attempts_data)
          : item.attempts_data,
    })),
    error: null,
  };
}

export async function getAllStudentResults(): Promise<{
  data: (StudentResult & { list_title?: string })[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("student_results")
    .select("*, word_lists(title)")
    .order("completed_at", { ascending: false })
    .limit(50);

  if (error) {
    return { data: null, error: error.message };
  }

  return {
    data: data.map((item) => ({
      ...item,
      list_title: (item.word_lists as { title: string } | null)?.title,
      attempts_data:
        typeof item.attempts_data === "string"
          ? JSON.parse(item.attempts_data)
          : item.attempts_data,
    })),
    error: null,
  };
}
