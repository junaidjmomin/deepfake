-- Create detections table
CREATE TABLE IF NOT EXISTS detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT,
  file_size BIGINT,
  duration FLOAT,
  detection_tier INT DEFAULT 1,
  overall_confidence FLOAT,
  risk_level TEXT,
  is_deepfake BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analysis_results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  detection_id UUID NOT NULL REFERENCES detections(id) ON DELETE CASCADE,
  facial_consistency FLOAT,
  audio_sync FLOAT,
  breathing_pattern FLOAT,
  eye_movement FLOAT,
  skin_tone_uniformity FLOAT,
  mouth_movement FLOAT,
  overall_score FLOAT,
  suspicious_frames TEXT[],
  timestamp_anomalies JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create heatmap_data table
CREATE TABLE IF NOT EXISTS heatmap_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  detection_id UUID NOT NULL REFERENCES detections(id) ON DELETE CASCADE,
  frame_number INT,
  anomaly_score FLOAT,
  region_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE heatmap_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own detections"
  ON detections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own detections"
  ON detections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own detections"
  ON detections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own detections"
  ON detections FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view analysis results for their detections"
  ON analysis_results FOR SELECT
  USING (detection_id IN (SELECT id FROM detections WHERE user_id = auth.uid()));

CREATE POLICY "Users can view heatmap data for their detections"
  ON heatmap_data FOR SELECT
  USING (detection_id IN (SELECT id FROM detections WHERE user_id = auth.uid()));

-- Create indexes
CREATE INDEX IF NOT EXISTS detections_user_id_idx ON detections(user_id);
CREATE INDEX IF NOT EXISTS detections_created_at_idx ON detections(created_at);
CREATE INDEX IF NOT EXISTS analysis_results_detection_id_idx ON analysis_results(detection_id);
