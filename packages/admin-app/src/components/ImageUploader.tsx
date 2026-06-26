import { useRef, useState, type DragEvent, type ChangeEvent } from 'react'

interface Props {
  images: string[]   // base64 data URLs
  onChange: (images: string[]) => void
  max?: number
  accept?: string
}

export default function ImageUploader({ images, onChange, max = 5, accept = 'image/*' }: Props) {
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const process = (files: FileList) => {
    const remaining = max - images.length
    const batch = Array.from(files).slice(0, remaining)
    batch.forEach(f => {
      if (!f.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => onChange([...images, reader.result as string])
      reader.readAsDataURL(f)
    })
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault(); setDragging(false)
    if (e.dataTransfer.files) process(e.dataTransfer.files)
  }
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) process(e.target.files)
  }
  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i))
  const move = (from: number, to: number) => {
    const copy = [...images]
    const [item] = copy.splice(from, 1)
    copy.splice(to, 0, item)
    onChange(copy)
  }

  return (
    <div>
      {/* Upload zone */}
      {images.length < max && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-outline-variant/40 hover:border-primary/50 hover:bg-surface-container-low'
          }`}
        >
          <div className="text-3xl mb-2 text-outline-variant">📷</div>
          <p className="text-sm font-semibold text-secondary">拖放图片到此处或点击上传</p>
          <p className="text-[10px] text-outline mt-1">支持 JPG / PNG / WebP，单张不超过 5MB</p>
          <p className="text-[10px] text-outline">建议尺寸 800×1067px（3:4 比例）</p>
          <input ref={fileRef} type="file" accept={accept} multiple onChange={handleFile} className="hidden" />
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-3">
          {images.map((src, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-outline-variant/20 aspect-[3/4] bg-surface-container">
              <img src={src} alt={`预览 ${i + 1}`} className="w-full h-full object-cover" />
              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                {i > 0 && (
                  <button onClick={() => move(i, i - 1)} className="w-7 h-7 rounded-full bg-white/80 text-xs flex items-center justify-center hover:bg-white">←</button>
                )}
                {i < images.length - 1 && (
                  <button onClick={() => move(i, i + 1)} className="w-7 h-7 rounded-full bg-white/80 text-xs flex items-center justify-center hover:bg-white">→</button>
                )}
                <button onClick={() => remove(i)} className="w-7 h-7 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500">×</button>
              </div>
              {i === 0 && (
                <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">封面</span>
              )}
              <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">{i + 1}/{images.length}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
