import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { LandingHero } from '@/components/landing/hero'
import { LandingFeatures } from '@/components/landing/features'
import { LandingQuote } from '@/components/landing/quote'
import { LandingCTA } from '@/components/landing/cta'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/')

  return (
    <>
      <LandingHero />
      <LandingFeatures />
      <LandingQuote />
      <LandingCTA />
    </>
  )
}