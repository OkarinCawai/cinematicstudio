"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Layers, Image as ImageIcon, Video, Music, Settings, Sparkles, ChevronDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { IdentityUploader } from "@/components/cinematic/IdentityUploader"
import { PresetSelector } from "@/components/cinematic/PresetSelector"
import { CinematicPreset, AspectRatio, ASPECT_RATIOS } from "@/lib/constants"

interface SidebarProps {
    subjectAction: string
    setSubjectAction: (val: string) => void
    identityFiles: File[]
    setIdentityFiles: (files: File[]) => void
    selectedIds: string[]
    onTogglePreset: (id: string) => void
    onGenerate: () => void
    loading: boolean
    presets: CinematicPreset[]
    aspectRatio: AspectRatio
    setAspectRatio: (val: AspectRatio) => void
}

export function Sidebar({
    subjectAction,
    setSubjectAction,
    identityFiles,
    setIdentityFiles,
    selectedIds,
    onTogglePreset,
    onGenerate,
    loading,
    presets,
    aspectRatio,
    setAspectRatio
}: SidebarProps) {
    const [activeTab, setActiveTab] = useState<"image" | "video">("image")

    return (
        <div className="w-[400px] flex-shrink-0 border-r border-border bg-card/50 flex flex-col h-screen sticky top-0 bg-[#0F0F0F]"> {/* Discord/Midjourney dark layout */}
            {/* Top Navigation */}
            <div className="p-4 border-b border-border space-y-4">
                <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab("image")}
                        className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all", activeTab === "image" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                    >
                        <ImageIcon className="w-4 h-4" /> Image
                    </button>
                    <button
                        onClick={() => setActiveTab("video")}
                        className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all", activeTab === "video" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                    >
                        <Video className="w-4 h-4" /> Video
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">

                {/* Aspect Ratio */}
                <div className="space-y-3">
                    <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Aspect Ratio</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {ASPECT_RATIOS.map((ratio) => (
                            <button
                                key={ratio.value}
                                onClick={() => setAspectRatio(ratio.value)}
                                className={cn(
                                    "px-2 py-1.5 text-xs rounded-md border transition-all",
                                    aspectRatio === ratio.value
                                        ? "bg-primary text-black border-primary font-bold shadow-[0_0_10px_-2px_theme(colors.primary.DEFAULT / 0.5)]"
                                        : "bg-secondary/30 border-input text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                {ratio.label.split(' ')[0]} <span className="opacity-50 text-[10px]">{ratio.value}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Model Selection */}
                <div className="space-y-3">
                    <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Model</Label>
                    <div className="flex items-center justify-between px-3 py-2 bg-secondary/30 border border-input rounded-md text-sm cursor-pointer hover:border-primary/50 transition-colors">
                        <span className="font-mono text-primary">Gemini 2.5 Flash</span>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                    </div>
                </div>

                {/* Identity / References */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">References</Label>
                        <span className="text-[10px] text-muted-foreground">{identityFiles.length}/14</span>
                    </div>
                    <IdentityUploader onAssetsChange={setIdentityFiles} maxAssets={14} />
                </div>

                {/* Prompt Input */}
                <div className="space-y-3">
                    <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Prompt</Label>
                    <Textarea
                        placeholder="Describe your shot..."
                        className="min-h-[120px] bg-secondary/30 border-input resize-none focus-visible:ring-primary/50"
                        value={subjectAction}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSubjectAction(e.target.value)}
                    />
                </div>

                {/* Presets Accordion Style */}
                <div className="space-y-6">
                    <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Cinematic Style</Label>

                    {['Camera', 'Lens', 'Lighting'].map((cat) => (
                        <PresetSelector
                            key={cat}
                            category={cat as any}
                            presets={presets}
                            selectedIds={selectedIds}
                            onToggle={onTogglePreset}
                        />
                    ))}

                    <div className="pt-2 border-t border-border">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground mb-4">Advanced</div>
                        {['Aesthetic', 'Movement', 'Environment', 'Technical'].map((cat) => (
                            <div key={cat} className="mb-4">
                                <PresetSelector
                                    category={cat as any}
                                    presets={presets}
                                    selectedIds={selectedIds}
                                    onToggle={onTogglePreset}
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Footer / Generate */}
            <div className="p-4 border-t border-border bg-card">
                <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-amber-600 text-black font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
                    onClick={onGenerate}
                    disabled={loading || !subjectAction}
                >
                    {loading ? <Sparkles className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                    {loading ? "Generating..." : "Generate Cinematic"}
                </Button>
            </div>
        </div>
    )
}
