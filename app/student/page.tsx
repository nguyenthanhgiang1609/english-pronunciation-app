import { getWordLists } from "@/lib/actions";
import { StudentListSelection } from "@/components/student/student-list-selection";

export default async function StudentPage() {
  const { data: lists } = await getWordLists();

  return <StudentListSelection lists={lists || []} />;
}
