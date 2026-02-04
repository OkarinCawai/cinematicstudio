-- ENUMS
CREATE TYPE preset_category AS ENUM ('Camera', 'Lens', 'Lighting', 'Aesthetic', 'Movement', 'Environment', 'Technical');
CREATE TYPE shot_status AS ENUM ('queued', 'processing', 'completed', 'failed');

-- IDENTITY ASSETS (Character Consistency)
CREATE TABLE identity_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    physical_description TEXT, -- e.g., "Woman, mid-20s, short black bob, silver earring"
    gemicinematicstudioni_file_uris JSONB DEFAULT '[]', -- URIs from Gemini Files API
    storage_paths TEXT[] DEFAULT '{}', -- Internal Supabase paths
    created_at TIMESTAMPTZ DEFAULT now()
);

-- MODULAR PRESETS
CREATE TABLE cinematic_presets 
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category preset_category NOT NULL,
    label TEXT NOT NULL,
    prompt_fragment TEXT NOT NULL, -- e.g., "shot on ARRI Alexa 65"
    is_default BOOLEAN DEFAULT false
);

-- STORYBOARD SHOTS
CREATE TABLE storyboard_shots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    project_name TEXT NOT NULL,
    subject_action TEXT NOT NULL, -- User input: "Character drinking coffee"
    asset_id UUID REFERENCES identity_assets(id),
    preset_ids UUID[] DEFAULT '{}',
    final_prompt TEXT,
    output_image_url TEXT,
    metadata JSONB DEFAULT '{}', -- Store seed, resolution, aspect ratio
    status shot_status DEFAULT 'queued',
    labels TEXT[] DEFAULT '{}', -- User labels: "Selects", "Alt", "V1"
    created_at TIMESTAMPTZ DEFAULT now()
);

-- SEED DATA
INSERT INTO cinematic_presets (category, label, prompt_fragment, is_default) VALUES
('Camera', 'ARRI Alexa 65', 'shot on ARRI Alexa 65, large format digital cinema', true),
('Camera', 'RED V-Raptor', 'captured on RED V-Raptor, 8K crisp digital cinema', false),
('Camera', '35mm Film', 'shot on Kodak Vision3 5219, 35mm film stock, organic grain', false),
('Lens', '35mm Anamorphic', 'anamorphic 35mm, oval bokeh, horizontal blue flares', true),
('Lens', '85mm Prime', '85mm prime lens, shallow depth of field, creamy bokeh', false),
('Lens', '14mm Wide', '14mm ultra-wide lens, dynamic perspective, wide scale', false),
('Lighting', 'High Noir', 'chiaroscuro lighting, deep shadows, moody atmosphere', false),
('Lighting', 'Golden Hour', 'lit by golden hour sun, amber tones, long soft shadows', true),
('Lighting', 'Cyber Neon', 'neon-lit city, cyan and magenta rim lighting, volumetric fog', false),
('Lighting', 'Rembrandt', 'Rembrandt lighting, cinematic triangle on cheek, soft key light', false),
('Aesthetic', 'Technicolor', 'vintage Technicolor Process 4, saturated reds and greens', false),
('Aesthetic', 'Teal & Orange', 'Hollywood teal and orange color grade, blockbuster look', true),
('Aesthetic', 'Bleach Bypass', 'bleach bypass process, gritty, high contrast, desaturated', false),
('Movement', 'Low Hero', 'low angle perspective, heroic and powerful framing', false),
('Movement', 'Dutch Angle', 'canted frame, dutch angle, sense of unease and tension', false),
('Environment', 'Atmospheric Mist', 'heavy volumetric mist, depth through atmospheric haze', false),
('Environment', 'Rain & Neon', 'puddle reflections, wet asphalt, rain-streaked lenses', false),
('Technical', 'Pixel Priority', 'INSTRUCTION: PIXEL PRIORITY MODE. Maximum texture fidelity.', true),
('Technical', '4K Raw', '4K raw digital intermediate, photorealistic cinema render', true),
('Technical', '1.85:1 Ratio', 'aspect ratio 1.85:1, cinematic flat framing', true);
