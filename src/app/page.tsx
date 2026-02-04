"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { IdentityUploader } from "@/components/cinematic/IdentityUploader"
import { StoryboardGallery } from "@/components/cinematic/StoryboardGallery"
import { SEED_PRESETS, CinematicPreset } from "@/lib/constants"
import { constructCinematicPrompt } from "@/lib/prompt-formula"
import { PresetSelector } from "@/components/cinematic/PresetSelector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles, Terminal, Loader2, AlertCircle } from "lucide-react"
import { generateShot } from "./actions"

export default function ShotBuilderPage() {
  const [subjectAction, setSubjectAction] = useState("")
  const [identityFiles, setIdentityFiles] = useState<File[]>([]) // New state
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
      const response = await generateShot(finalPrompt)
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
    <div className="flex flex-col gap-6 p-6 md:p-12 max-w-7xl mx-auto">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Cinematic Vision Engine</h1>
        <p className="text-muted-foreground text-lg">Build high-fidelity AI storyboards with professional film logic.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Controls */}
        <div className="lg:col-span-2 space-y-8">

          {/* Identity Uploader Section (New) */}
          <Card className="border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle>Identity Locking</CardTitle>
              <CardDescription>Upload character references (max 14) to maintain consistency.</CardDescription>
            </CardHeader>
            <CardContent>
              <IdentityUploader onAssetsChange={setIdentityFiles} />
            </CardContent>
          </Card>

          {/* Subject Input */}
          <Card className="border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle>Subject & Action</CardTitle>
              <CardDescription>Describe what is happening in the shot.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., Cyberpunk detective walking through rain..."
                className="text-lg py-6"
                value={subjectAction}
                onChange={(e) => setSubjectAction(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Presets Grid */}
          <div className="space-y-6">
            {categories.map((category) => (
              <PresetSelector
                key={category}
                category={category}
                presets={SEED_PRESETS}
                selectedIds={selectedIds}
                onToggle={handleTogglePreset}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Preview & Action */}
        <div className="space-y-6">
          <Card className="sticky top-6 border-accent/20 overflow-hidden">
            <div className="bg-accent/10 p-4 border-b border-accent/10 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-accent" />
              <span className="text-xs font-mono text-accent uppercase tracking-widest">Prompt Formula</span>
            </div>
            <CardContent className="p-0">
              <div className="bg-black/50 p-6 font-mono text-sm text-muted-foreground leading-relaxed h-[300px] overflow-y-auto">
                <span className="text-foreground">{subjectAction || "[Subject Action]"}</span>
                {selectedPresets.length > 0 && <span className="text-primary/70">{" + " + selectedPresets.map(p => p.prompt_fragment).join(" + ")}</span>}

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">FINAL COMPILED PROMPT:</p>
                  <p className="text-foreground">{finalPrompt}</p>
                </div>
              </div>
            </CardContent>
            <div className="p-6 border-t border-border bg-card">
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground font-bold text-md shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50"
                onClick={handleGenerate}
                disabled={loading || !subjectAction}
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-5 h-5 mr-2" /> Generate Shot</>
                )}
              </Button>
            </div>
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-b-lg border-t border-destructive/20 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            {result && (
              <div className="p-4 bg-green-500/10 text-green-500 text-sm border-t border-green-500/20">
                <p className="font-bold mb-1">Result:</p>
                {result.startsWith("data:image") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={result} alt="Generated Shot" className="w-full rounded-md shadow-lg mt-2" />
                ) : (
                  <p className="font-mono text-xs break-all">{result}</p>
                )}
              </div>
            )}
          </Card>

          {/* Quick Stats / Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/30 p-4 rounded-lg border border-border">
              <div className="text-xs uppercase text-muted-foreground">Model</div>
              <div className="font-mono text-sm font-bold text-foreground">Gemini 2.5 Flash</div>
            </div>
            <div className="bg-secondary/30 p-4 rounded-lg border border-border">
              <div className="text-xs uppercase text-muted-foreground">Est. Cost</div>
              <div className="font-mono text-sm font-bold text-foreground">~0.04 / img</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="mt-12 md:mt-24 border-t border-border pt-12">
        <StoryboardGallery />
      </div>

    </div>
  )
}
