import { getWordLists, getAllStudentResults } from "@/lib/actions";
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard";

export default async function TeacherPage() {
  const [listsResult, resultsResult] = await Promise.all([
    getWordLists(),
    getAllStudentResults(),
  ]);

  return (
    <TeacherDashboard
      initialLists={listsResult.data || []}
      initialResults={resultsResult.data || []}
    />
  );
}
