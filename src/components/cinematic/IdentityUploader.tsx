"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
// import { uploadIdentityAsset } from "@/app/actions" // We'll need a server action or client-side upload

interface IdentityUploaderProps {
    onAssetsChange: (assets: File[]) => void
    maxAssets?: number
}

export function IdentityUploader({ onAssetsChange, maxAssets = 14 }: IdentityUploaderProps) {
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => {
            const newFiles = [...prev, ...acceptedFiles].slice(0, maxAssets)
            onAssetsChange(newFiles)
            return newFiles
        })
    }, [maxAssets, onAssetsChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: maxAssets,
        disabled: files.length >= maxAssets || uploading
    })

    const removeFile = (index: number) => {
        setFiles((prev) => {
            const newFiles = prev.filter((_, i) => i !== index)
            onAssetsChange(newFiles)
            return newFiles
        })
    }

    return (
        <div className="w-full space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-12 text-center transition-all hover:bg-muted/10",
                    isDragActive && "border-primary bg-primary/5",
                    (files.length >= maxAssets) && "opacity-50 cursor-not-allowed"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    <div className="p-4 bg-background rounded-full border border-border">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                            {files.length >= maxAssets
                                ? "Max assets reached"
                                : "Drag & drop reference images"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Supports JPG, PNG (Max {maxAssets} images)
                        </p>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-4 gap-4"
                    >
                        {files.map((file, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted"
                            >
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                />
                                <button
                                    onClick={() => removeFile(i)}
                                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-destructive group-hover:opacity-100"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
