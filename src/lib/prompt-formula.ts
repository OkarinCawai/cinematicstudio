import { CinematicPreset } from "./constants";

export function constructCinematicPrompt(
    subjectAction: string,
    selectedPresets: CinematicPreset[]
): string {
    // Order matters: Subject -> Camera -> Lens -> Lighting -> Aesthetic -> Movement -> Environment -> Technical
    const categoryOrder: CinematicPreset['category'][] = [
        'Camera',
        'Lens',
        'Lighting',
        'Aesthetic',
        'Movement',
        'Environment',
        'Technical'
    ];

    let prompt = subjectAction.trim();
    if (prompt && !prompt.endsWith(',')) prompt += ',';

    categoryOrder.forEach((cat) => {
        const presets = selectedPresets.filter((p) => p.category === cat);
        if (presets.length > 0) {
            const fragments = presets.map((p) => p.prompt_fragment).join(', ');
            prompt += ` ${fragments},`;
        }
    });

    // Cleanup trailing comma
    if (prompt.endsWith(',')) {
        prompt = prompt.slice(0, -1);
    }

    return prompt;
}
