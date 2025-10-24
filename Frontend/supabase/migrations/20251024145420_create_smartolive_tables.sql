/*
  # SmartOlive AI Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `email` (text)
      - `farm_name` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `irrigation_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `farm_size` (numeric)
      - `soil_type` (text)
      - `temperature` (numeric)
      - `rainfall` (numeric)
      - `recommendation` (text)
      - `created_at` (timestamptz)
    
    - `fertilization_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `tree_age` (integer)
      - `soil_fertility` (text)
      - `last_fertilization_days` (integer)
      - `fertilizer_type` (text)
      - `amount` (text)
      - `schedule` (text)
      - `status` (text)
      - `created_at` (timestamptz)
    
    - `pest_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `symptoms` (text)
      - `health_status` (text)
      - `prevention_tips` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  farm_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create irrigation_history table
CREATE TABLE IF NOT EXISTS irrigation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  farm_size numeric NOT NULL,
  soil_type text NOT NULL,
  temperature numeric NOT NULL,
  rainfall numeric NOT NULL,
  recommendation text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE irrigation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own irrigation history"
  ON irrigation_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own irrigation history"
  ON irrigation_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create fertilization_history table
CREATE TABLE IF NOT EXISTS fertilization_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tree_age integer NOT NULL,
  soil_fertility text NOT NULL,
  last_fertilization_days integer NOT NULL,
  fertilizer_type text NOT NULL,
  amount text NOT NULL,
  schedule text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fertilization_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own fertilization history"
  ON fertilization_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fertilization history"
  ON fertilization_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create pest_history table
CREATE TABLE IF NOT EXISTS pest_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  symptoms text NOT NULL,
  health_status text NOT NULL,
  prevention_tips text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pest_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pest history"
  ON pest_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pest history"
  ON pest_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);