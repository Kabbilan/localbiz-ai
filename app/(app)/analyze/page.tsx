'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Upload, ImageIcon, MapPin, Sparkles, Loader2, X, Info } from 'lucide-react'
import { api } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const analyzeSteps = [
  'Identifying the product from your photo',
  'Checking nearby competitor prices',
  'Reading local weather & demand signals',
  'Calculating your best price & offer',
]

export default function AnalyzePage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>('/products/raincoat.png')
  const [analyzing, setAnalyzing] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const [form, setForm] = useState({
    name: 'Premium Rain Coat',
    cost: '500',
    price: '700',
    stock: '25',
    location: 'Andheri, Mumbai',
  })

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    setAnalyzing(true)
    setActiveStep(0)
    const interval = setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, analyzeSteps.length - 1))
    }, 380)
    await api.analyzeProduct({
      name: form.name,
      cost: Number(form.cost),
      price: Number(form.price),
      stock: Number(form.stock),
      location: form.location,
      imageDataUrl: preview ?? undefined,
    })
    clearInterval(interval)
    router.push('/analyze/results')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">
          Add a product photo and a few details. Our AI will tell you the best price, demand, and
          how to market it. We&apos;ve pre-filled a sample raincoat so you can try it instantly.
        </p>
      </div>

      <form onSubmit={handleAnalyze}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Image upload */}
          <Card>
            <CardHeader>
              <CardTitle>Product photo</CardTitle>
              <CardDescription>A clear photo helps the AI identify your product.</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFile}
                aria-label="Upload product photo"
              />
              {preview ? (
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted">
                  <Image src={preview} alt="Product preview" fill className="object-cover" sizes="400px" />
                  <button
                    type="button"
                    onClick={() => setPreview(null)}
                    className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg bg-background/90 text-muted-foreground shadow-sm hover:text-foreground"
                    aria-label="Remove photo"
                  >
                    <X className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-background/90 px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-background"
                  >
                    <Upload className="size-4" />
                    Change
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/40 text-center transition-colors hover:border-primary/50 hover:bg-muted"
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                    <ImageIcon className="size-6" />
                  </span>
                  <span className="text-sm font-medium">Tap to upload a photo</span>
                  <span className="text-xs text-muted-foreground">JPG or PNG, up to 10MB</span>
                </button>
              )}
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product details</CardTitle>
              <CardDescription>Prices in rupees (₹). All fields are required.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Product name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Premium Rain Coat"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="cost">Purchase cost (₹)</Label>
                  <Input
                    id="cost"
                    type="number"
                    min={0}
                    required
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="price">Selling price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="stock">Stock available</Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  required
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="location">
                  <MapPin className="size-3.5" />
                  Shop location
                </Label>
                <Input
                  id="location"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Andheri, Mumbai"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <Button
            type="submit"
            size="lg"
            disabled={analyzing}
            className="h-12 w-full max-w-sm px-6 text-base"
          >
            {analyzing ? (
              <>
                <Loader2 className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles />
                Analyze product
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">Takes just a few seconds</p>
        </div>
      </form>

      {analyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <p className="font-display font-semibold">Analyzing your product</p>
                  <p className="text-sm text-muted-foreground">This won&apos;t take long</p>
                </div>
              </div>
              <ul className="mt-5 flex flex-col gap-3">
                {analyzeSteps.map((step, i) => {
                  const done = i < activeStep
                  const active = i === activeStep
                  return (
                    <li key={step} className="flex items-center gap-3 text-sm">
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                          done
                            ? 'border-success bg-success/15 text-success'
                            : active
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-muted-foreground'
                        }`}
                      >
                        {done ? '✓' : active ? <Loader2 className="size-3.5 animate-spin" /> : i + 1}
                      </span>
                      <span className={done || active ? 'text-foreground' : 'text-muted-foreground'}>
                        {step}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
