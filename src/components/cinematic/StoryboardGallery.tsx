"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Maximize2, MoreHorizontal, Copy, Info } from "lucide-react"
import { cn } from "@/lib/utils"
// import { Database } from "@/types/supabase" // If using real types
// Placeholder type for valid build without Supabase connected yet
type Shot = {
    id: string
    image_url: string
    prompt: string
    ratio: "16:9" | "2.39:1"
    timestamp: string
    metadata: Record<string, any>
}

// Mock data for display
const MOCK_SHOTS: Shot[] = [
    {
        id: "1",
        image_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop",
        prompt: "Cyberpunk detective rain neon lights...",
        ratio: "2.39:1",
        timestamp: "10 mins ago",
        metadata: { camera: "Alexa 65", lens: "35mm Anamorphic" }
    },
    {
        id: "2",
        image_url: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=2487&auto=format&fit=crop",
        prompt: "Golden hour field wide angle...",
        ratio: "16:9",
        timestamp: "1 hour ago",
        metadata: { camera: "RED V-Raptor", lens: "14mm Wide" }
    },
    {
        id: "3",
        image_url: "https://images.unsplash.com/photo-1542259685-9a84acb6797b?q=80&w=2609&auto=format&fit=crop",
        prompt: "Misty forest mystery...",
        ratio: "2.39:1",
        timestamp: "2 hours ago",
        metadata: { camera: "35mm Film", lens: "85mm Prime" }
    }
]

interface StoryboardGalleryProps {
    shots?: Shot[] // On real implementation, pass shots here
}

export function StoryboardGallery({ shots = MOCK_SHOTS }: StoryboardGalleryProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Storyboard Gallery</h2>
                <div className="flex gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-1 rounded bg-secondary">16:9</span>
                    <span className="px-2 py-1 rounded bg-secondary">2.39:1</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {shots.map((shot) => (
                    <motion.div
                        key={shot.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredId(shot.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        {/* Aspect Ratio Container */}
                        <div
                            className={cn(
                                "relative w-full overflow-hidden rounded-lg bg-black border border-border transition-all duration-500",
                                shot.ratio === "2.39:1" ? "aspect-[2.39/1]" : "aspect-video",
                                "group-hover:shadow-[0_0_30px_-5px_theme(colors.primary.DEFAULT / 0.3)] group-hover:border-primary/50"
                            )}
                        >
                            <img
                                src={shot.image_url}
                                alt="shot"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay HUD */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end transition-opacity duration-300",
                                hoveredId === shot.id ? "opacity-100" : "opacity-0"
                            )}>
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-xs font-mono text-primary uppercase tracking-widest leading-none mb-2">
                                            {shot.metadata.camera} · {shot.metadata.lens}
                                        </p>
                                        <p className="text-sm font-medium text-white line-clamp-2 w-3/4">
                                            {shot.prompt}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 rounded-full bg-primary hover:bg-primary/90 text-black shadow-lg transition-colors">
                                            <Maximize2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Status Indicator (if needed) */}
                            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white/50 backdrop-blur-sm border border-white/10">
                                DONE
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
