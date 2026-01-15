"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragging ? "border-blue-500 bg-blue-500/10" : "border-slate-600 bg-slate-700/20 hover:border-slate-500"
      }`}
    >
      <Upload className="mx-auto mb-4 text-slate-400" size={40} />
      <p className="text-slate-200 font-semibold mb-2">Drop video here or click to select</p>
      <p className="text-sm text-slate-400 mb-4">Supports MP4, WebM, MOV (up to 2GB)</p>
      <input type="file" accept="video/*" onChange={handleFileInput} className="hidden" id="file-input" />
      <label htmlFor="file-input" className="cursor-pointer text-blue-400 text-sm hover:underline">
        Browse files
      </label>
    </div>
  )
}
