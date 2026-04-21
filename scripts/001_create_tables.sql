-- Create word_lists table for storing teacher-created word lists
CREATE TABLE IF NOT EXISTS word_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  words JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create student_results table for tracking practice sessions
CREATE TABLE IF NOT EXISTS student_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES word_lists(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  attempts_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_student_results_list_id ON student_results(list_id);
CREATE INDEX IF NOT EXISTS idx_student_results_completed_at ON student_results(completed_at DESC);

-- Enable Row Level Security (but allow public access for this educational app)
ALTER TABLE word_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_results ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for word_lists (teachers can create, students can view)
CREATE POLICY "Allow public read access on word_lists" ON word_lists FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on word_lists" ON word_lists FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on word_lists" ON word_lists FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on word_lists" ON word_lists FOR DELETE USING (true);

-- Allow public read/write access for student_results
CREATE POLICY "Allow public read access on student_results" ON student_results FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on student_results" ON student_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on student_results" ON student_results FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on student_results" ON student_results FOR DELETE USING (true);
