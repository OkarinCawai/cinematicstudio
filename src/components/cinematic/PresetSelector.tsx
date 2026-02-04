"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CinematicPreset } from "@/lib/constants"

interface PresetSelectorProps {
    category: CinematicPreset['category']
    presets: CinematicPreset[]
    selectedIds: string[]
    onToggle: (id: string) => void
}

export function PresetSelector({ category, presets, selectedIds, onToggle }: PresetSelectorProps) {
    const categoryPresets = presets.filter((p) => p.category === category)

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {category}
            </h3>
            <div className="flex flex-wrap gap-2">
                {categoryPresets.map((preset) => {
                    const isSelected = selectedIds.includes(preset.id)
                    return (
                        <motion.button
                            key={preset.id}
                            onClick={() => onToggle(preset.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "group relative flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-all",
                                isSelected
                                    ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]"
                                    : "border-input bg-card hover:border-primary/50 hover:bg-accent"
                            )}
                        >
                            <span>{preset.label}</span>
                            {isSelected && (
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="rounded-full bg-primary/20 p-0.5"
                                >
                                    <Check className="h-3 w-3" />
                                </motion.span>
                            )}
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}
