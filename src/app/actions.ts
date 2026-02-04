"use server"

import { GoogleGenAI } from "@google/genai"

export async function generateShot(prompt: string, aspectRatio: string = "1:1") {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing Gemini API Key")
    }

    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    try {
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
            config: {
                // The documentation recommends this for image-only generation
                responseModalities: ["Image"],
                // Supported aspect ratios: "1:1", "3:4", "4:3", "9:16", "16:9"
                // @ts-ignore - SDK types might not be up to date
                imageConfig: {
                    aspectRatio: aspectRatio,
                },
            },
        });

        // Parse response according to documentation
        // "Nano Banana" (Gemini 2.5 Flash Image) returns inlineData
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64Image = part.inlineData.data;
                const dataUrl = `data:image/png;base64,${base64Image}`;
                return { success: true, data: dataUrl };
            }
        }

        // If no image found in response
        return { success: false, error: "No image generated in response." }

    } catch (error) {
        console.error("Error generating shot:", error)
        // Extract more detailed error info if possible
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: `Failed to generate shot: ${errorMessage}` }
    }
}
