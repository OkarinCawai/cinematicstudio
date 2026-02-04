import { Database } from "@/types/supabase";

export type CinematicPreset = Database['public']['Tables']['cinematic_presets']['Row'];

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export const ASPECT_RATIOS: { label: string; value: AspectRatio }[] = [
    { label: 'Square (1:1)', value: '1:1' },
    { label: 'Cinematic (16:9)', value: '16:9' },
    { label: 'Portrait (9:16)', value: '9:16' },
    { label: 'Standard (4:3)', value: '4:3' },
    { label: 'Vertical (3:4)', value: '3:4' },
];

export const SEED_PRESETS: CinematicPreset[] = [
    { id: '1', category: 'Camera', label: 'ARRI Alexa 65', prompt_fragment: 'shot on ARRI Alexa 65, large format digital cinema', is_default: true },
    { id: '2', category: 'Camera', label: 'RED V-Raptor', prompt_fragment: 'captured on RED V-Raptor, 8K crisp digital cinema', is_default: false },
    { id: '3', category: 'Camera', label: '35mm Film', prompt_fragment: 'shot on Kodak Vision3 5219, 35mm film stock, organic grain', is_default: false },
    { id: '4', category: 'Lens', label: '35mm Anamorphic', prompt_fragment: 'anamorphic 35mm, oval bokeh, horizontal blue flares', is_default: true },
    { id: '5', category: 'Lens', label: '85mm Prime', prompt_fragment: '85mm prime lens, shallow depth of field, creamy bokeh', is_default: false },
    { id: '6', category: 'Lens', label: '14mm Wide', prompt_fragment: '14mm ultra-wide lens, dynamic perspective, wide scale', is_default: false },
    { id: '7', category: 'Lighting', label: 'High Noir', prompt_fragment: 'chiaroscuro lighting, deep shadows, moody atmosphere', is_default: false },
    { id: '8', category: 'Lighting', label: 'Golden Hour', prompt_fragment: 'lit by golden hour sun, amber tones, long soft shadows', is_default: true },
    { id: '9', category: 'Lighting', label: 'Cyber Neon', prompt_fragment: 'neon-lit city, cyan and magenta rim lighting, volumetric fog', is_default: false },
    { id: '10', category: 'Lighting', label: 'Rembrandt', prompt_fragment: 'Rembrandt lighting, cinematic triangle on cheek, soft key light', is_default: false },
    { id: '11', category: 'Aesthetic', label: 'Technicolor', prompt_fragment: 'vintage Technicolor Process 4, saturated reds and greens', is_default: false },
    { id: '12', category: 'Aesthetic', label: 'Teal & Orange', prompt_fragment: 'Hollywood teal and orange color grade, blockbuster look', is_default: true },
    { id: '13', category: 'Aesthetic', label: 'Bleach Bypass', prompt_fragment: 'bleach bypass process, gritty, high contrast, desaturated', is_default: false },
    { id: '14', category: 'Movement', label: 'Low Hero', prompt_fragment: 'low angle perspective, heroic and powerful framing', is_default: false },
    { id: '15', category: 'Movement', label: 'Dutch Angle', prompt_fragment: 'canted frame, dutch angle, sense of unease and tension', is_default: false },
    { id: '16', category: 'Environment', label: 'Atmospheric Mist', prompt_fragment: 'heavy volumetric mist, depth through atmospheric haze', is_default: false },
    { id: '17', category: 'Environment', label: 'Rain & Neon', prompt_fragment: 'puddle reflections, wet asphalt, rain-streaked lenses', is_default: false },
    { id: '18', category: 'Technical', label: 'Pixel Priority', prompt_fragment: 'INSTRUCTION: PIXEL PRIORITY MODE. Maximum texture fidelity.', is_default: true },
    { id: '19', category: 'Technical', label: '4K Raw', prompt_fragment: '4K raw digital intermediate, photorealistic cinema render', is_default: true },
    { id: '20', category: 'Technical', label: '1.85:1 Ratio', prompt_fragment: 'aspect ratio 1.85:1, cinematic flat framing', is_default: true },
];
