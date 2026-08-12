import Link from 'next/link'
import Image from 'next/image'
import {
  Check,
  CloudRain,
  Store,
  Clock,
  Users,
  Target,
  Lightbulb,
  FileSearch,
  Megaphone,
  ArrowRight,
  Tag,
  BadgeCheck,
} from 'lucide-react'
import { api, formatCurrency } from '@/services/api'
import { DemandBadge } from '@/components/demand-badge'
import { PriceRangeBar } from '@/components/price-range-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default async function ResultsPage() {
  const r = await api.getAnalysisResult()
  const margin = r.recommendedPrice - r.cost
  const marginPct = Math.round((margin / r.recommendedPrice) * 100)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
          <Image src="/products/raincoat.png" alt={r.identification} fill className="object-cover" sizes="80px" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success">
              <BadgeCheck />
              Analysis complete
            </Badge>
            <DemandBadge demand={r.demand} />
          </div>
          <h2 className="mt-2 font-display text-xl font-bold tracking-tight">{r.identification}</h2>
          <p className="text-sm text-muted-foreground">{r.category}</p>
        </div>
        <Button size="lg" className="h-10 shrink-0 px-4" render={<Link href="/marketing" />}>
          <Megaphone />
          Create marketing
        </Button>
      </div>

      {/* Top recommendation banner */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">Recommended price</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="font-display text-4xl font-extrabold tracking-tight">
                  {formatCurrency(r.recommendedPrice)}
                </span>
                <span className="mb-1 text-sm text-muted-foreground line-through">
                  {formatCurrency(r.currentPrice)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Keeps a {formatCurrency(margin)} margin ({marginPct}%) per unit
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3">
              <Tag className="size-5 text-warning-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Suggested offer</p>
                <p className="font-display text-sm font-semibold">{r.offer}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col justify-center gap-2 p-6">
            <p className="text-sm font-medium text-muted-foreground">AI confidence</p>
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl font-bold">{r.confidence}%</span>
            </div>
            <Progress value={r.confidence} indicatorClassName="bg-success" />
            <p className="text-xs text-muted-foreground">High confidence in this identification</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Price positioning */}
          <Card>
            <CardHeader>
              <CardTitle>Where your price sits in the market</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceRangeBar
                min={r.marketRange.min}
                max={r.marketRange.max}
                current={r.currentPrice}
                recommended={r.recommendedPrice}
              />
            </CardContent>
          </Card>

          {/* Competitor prices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="size-4 text-primary" />
                Competitor prices nearby
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              {r.competitorPrices.map((c) => (
                <div
                  key={c.shop}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.shop}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.distanceKm === 0 ? 'Online' : `${c.distanceKm} km away`} · {c.note}
                    </p>
                  </div>
                  <span className="font-display text-lg font-semibold">{formatCurrency(c.price)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Reasoning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="size-4 text-primary" />
                Why this recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {r.reasoning.map((why, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{why}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Evidence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSearch className="size-4 text-primary" />
                Evidence behind the numbers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {r.evidence.map((e, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/30 p-3 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {e}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Product identification */}
          <Card>
            <CardHeader>
              <CardTitle>Product identification</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Category</p>
                <p className="mt-1 font-medium">{r.category}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Key features</p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {r.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Weather */}
          <Card>
            <CardContent className="flex gap-4 p-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CloudRain className="size-5" />
              </span>
              <div>
                <p className="font-display font-semibold">{r.weather.condition}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.weather.detail}</p>
                <p className="mt-2 text-sm font-medium text-primary">{r.weather.impact}</p>
              </div>
            </CardContent>
          </Card>

          {/* Strategy details */}
          <Card>
            <CardHeader>
              <CardTitle>Your game plan</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <InfoRow icon={Clock} label="Best time to sell" value={r.bestTime} />
              <InfoRow icon={Users} label="Target customer" value={r.targetCustomer} />
              <InfoRow icon={Target} label="Strategy" value={r.strategy} />
            </CardContent>
          </Card>

          <Card className="bg-secondary/50">
            <CardContent className="flex flex-col gap-3 p-6">
              <p className="font-display font-semibold">Ready to act on this?</p>
              <p className="text-sm text-muted-foreground">
                Turn this analysis into ready-to-share marketing and a launch plan.
              </p>
              <div className="flex flex-col gap-2">
                <Button className="w-full" render={<Link href="/marketing" />}>
                  Create marketing
                  <ArrowRight />
                </Button>
                <Button variant="outline" className="w-full" render={<Link href="/campaigns" />}>
                  Plan a campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm leading-relaxed">{value}</p>
      </div>
    </div>
  )
}
