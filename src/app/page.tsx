"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/layout/Sidebar"
import { StoryboardGallery } from "@/components/cinematic/StoryboardGallery"
import { SEED_PRESETS, CinematicPreset, AspectRatio } from "@/lib/constants" // Updated import
import { constructCinematicPrompt } from "@/lib/prompt-formula"
import { generateShot } from "./actions"

export default function ShotBuilderPage() {
  const [subjectAction, setSubjectAction] = useState("")
  const [identityFiles, setIdentityFiles] = useState<File[]>([])
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9") // New state
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize with default presets
  const [selectedIds, setSelectedIds] = useState<string[]>(
    SEED_PRESETS.filter((p) => p.is_default).map((p) => p.id)
  )

  const selectedPresets = useMemo(() => {
    return SEED_PRESETS.filter((p) => selectedIds.includes(p.id))
  }, [selectedIds])

  // Update prompt construction to include identity context if needed
  // For now, we just pass the subject. Real identity locking requires uploading to Gemini Files API.
  // We will simulate the "Identity Description" part in the prompt for now.

  const finalPrompt = useMemo(() => {
    // If we have files, we might append a note, but for now just the subject and presets.
    // In a real implementation, we'd process the files to get a URI or description.
    const identityNote = identityFiles.length > 0 ? " [Identity: Reference Images Attached] " : "";
    return constructCinematicPrompt(subjectAction + identityNote, selectedPresets)
  }, [subjectAction, selectedPresets, identityFiles])

  const handleTogglePreset = (id: string) => {
    setSelectedIds((prev) => {
      // Logic: allow multiple? The spec implies we swap presets instantly for granular control.
      // But maybe some categories allow multiple? "Users click a label to swap presets instantly."
      // Let's assume one per category for simplicity, OR toggle.
      // "Granular Controls: Every preset... should be a 'label'... Users click a label to swap presets instantly."
      // This implies single selection per category usually, e.g. you don't use 2 cameras.
      // But maybe multiple "Environment" elements?
      // Let's implement logic: 
      // Camera, Lens, Movement, Ratio -> Single Select (swap)
      // Lighting, Aesthetic, Environment -> Multi Select?
      // For now, let's just toggle. If it's the same category, we might want to unselect others if it's strictly single.
      // Let's do simple toggle for now, user can decide.
      // Actually, standard "Radio" behavior for Camera implies swapping.

      const clickedPreset = SEED_PRESETS.find(p => p.id === id);
      if (!clickedPreset) return prev;

      const isMultiCategory = ['Lighting', 'Environment', 'Aesthetic'].includes(clickedPreset.category);

      if (prev.includes(id)) {
        return prev.filter(pId => pId !== id);
      } else {
        if (!isMultiCategory) {
          // Remove other presets of same category
          const others = prev.filter(pId => {
            const p = SEED_PRESETS.find(sp => sp.id === pId);
            return p?.category !== clickedPreset.category;
          });
          return [...others, id];
        }
        return [...prev, id];
      }
    })
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await generateShot(finalPrompt, aspectRatio) // Pass aspect ratio
      if (response.success && response.data) {
        setResult(response.data)
      } else {
        setError(response.error || "Unknown error")
      }
    } catch (err) {
      setError("Failed to connect to generation service.")
    } finally {
      setLoading(false)
    }
  }

  const categories: CinematicPreset['category'][] = [
    'Camera', 'Lens', 'Lighting', 'Aesthetic', 'Movement', 'Environment', 'Technical'
  ];

  return (
    <div className="flex min-h-screen">

      {/* Sidebar Controls */}
      <Sidebar
        subjectAction={subjectAction}
        setSubjectAction={setSubjectAction}
        identityFiles={identityFiles}
        setIdentityFiles={setIdentityFiles}
        selectedIds={selectedIds}
        onTogglePreset={handleTogglePreset}
        onGenerate={handleGenerate}
        loading={loading}
        presets={SEED_PRESETS}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen bg-background">
        <header className="h-[64px] border-b border-border flex items-center justify-between px-6 bg-card/30 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-black text-xl">C</div>
            <h1 className="text-xl font-bold tracking-tight">Cinematic Vision</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Workspace: <span className="text-foreground font-medium">Concept Art</span></div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {/* Generation Result (Temporary Highlighting) */}
          {result && (
            <div className="mb-12">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Latest Generation</h2>
              <div className="relative aspect-video max-w-4xl bg-black border border-primary/30 rounded-lg overflow-hidden shadow-[0_0_50px_-10px_theme(colors.primary.DEFAULT / 0.2)]">
                {result.startsWith("data:image") ? (
                  <img src={result} alt="Latest" className="w-full h-full object-contain" />
                ) : (
                  <div className="p-10 text-mono text-green-500">{result}</div>
                )}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-white/10 text-white">
                  Generated just now
                </div>
              </div>
            </div>
          )}

          {/* Gallery */}
          <StoryboardGallery />
        </main>
      </div>

    </div>
  )
}
