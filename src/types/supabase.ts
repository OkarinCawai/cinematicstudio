export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            identity_assets: {
                Row: {
                    id: string
                    user_id: string | null
                    name: string
                    physical_description: string | null
                    gemini_file_uris: Json | null
                    storage_paths: string[] | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    name: string
                    physical_description?: string | null
                    gemini_file_uris?: Json | null
                    storage_paths?: string[] | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    name?: string
                    physical_description?: string | null
                    gemini_file_uris?: Json | null
                    storage_paths?: string[] | null
                    created_at?: string | null
                }
            }
            cinematic_presets: {
                Row: {
                    id: string
                    category: 'Camera' | 'Lens' | 'Lighting' | 'Aesthetic' | 'Movement' | 'Environment' | 'Technical'
                    label: string
                    prompt_fragment: string
                    is_default: boolean | null
                }
                Insert: {
                    id?: string
                    category: 'Camera' | 'Lens' | 'Lighting' | 'Aesthetic' | 'Movement' | 'Environment' | 'Technical'
                    label: string
                    prompt_fragment: string
                    is_default?: boolean | null
                }
                Update: {
                    id?: string
                    category?: 'Camera' | 'Lens' | 'Lighting' | 'Aesthetic' | 'Movement' | 'Environment' | 'Technical'
                    label?: string
                    prompt_fragment?: string
                    is_default?: boolean | null
                }
            }
            storyboard_shots: {
                Row: {
                    id: string
                    user_id: string | null
                    project_name: string
                    subject_action: string
                    asset_id: string | null
                    preset_ids: string[] | null
                    final_prompt: string | null
                    output_image_url: string | null
                    metadata: Json | null
                    status: 'queued' | 'processing' | 'completed' | 'failed' | null
                    labels: string[] | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    project_name: string
                    subject_action: string
                    asset_id?: string | null
                    preset_ids?: string[] | null
                    final_prompt?: string | null
                    output_image_url?: string | null
                    metadata?: Json | null
                    status?: 'queued' | 'processing' | 'completed' | 'failed' | null
                    labels?: string[] | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    project_name?: string
                    subject_action?: string
                    asset_id?: string | null
                    preset_ids?: string[] | null
                    final_prompt?: string | null
                    output_image_url?: string | null
                    metadata?: Json | null
                    status?: 'queued' | 'processing' | 'completed' | 'failed' | null
                    labels?: string[] | null
                    created_at?: string | null
                }
            }
        }
    }
}
