-- Enable Row Level Security if not already enabled
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow anonymous inserts to conversations" ON conversations;
DROP POLICY IF EXISTS "Allow anonymous selects from conversations" ON conversations;
DROP POLICY IF EXISTS "Allow anonymous updates to conversations" ON conversations;
DROP POLICY IF EXISTS "Allow anonymous inserts to messages" ON messages;
DROP POLICY IF EXISTS "Allow anonymous selects from messages" ON messages;
DROP POLICY IF EXISTS "Allow anonymous updates to messages" ON messages;

-- Create policies for conversations table
CREATE POLICY "Allow anonymous inserts to conversations" 
ON conversations FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Allow anonymous selects from conversations" 
ON conversations FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Allow anonymous updates to conversations" 
ON conversations FOR UPDATE 
TO anon 
USING (true);

-- Create policies for messages table
CREATE POLICY "Allow anonymous inserts to messages" 
ON messages FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Allow anonymous selects from messages" 
ON messages FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Allow anonymous updates to messages" 
ON messages FOR UPDATE 
TO anon 
USING (true);
