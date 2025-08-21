import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthLayout from './AuthLayout'
import { useAuthStore } from '../../state/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import TypeTagline from '@/components/TypeTagline'
import BackButton from '@/components/BackButton'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'

const schema = z.object({
  business: z.string().min(2,'Business name required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8,'Use at least 8 characters with numbers & symbols'),
  niche: z.string().min(2, 'Choose your trade')
})

export default function SignupPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s)=>s.login)
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  })

  const [nicheQuery, setNicheQuery] = useState('')
  const trades = useMemo(() => [
    'Electrician', 'Plumber', 'HVAC Technician', 'Carpenter', 'Painter', 'Roofer',
    'Landscaper', 'Cleaner', 'Handyman', 'Locksmith', 'Flooring Installer', 'Tiler',
    'Bricklayer', 'Plasterer', 'Glazier', 'Pest Control', 'Pool Service', 'Solar Installer',
    'Appliance Repair', 'General Contractor', 'Fencing', 'Guttering', 'Tree Service',
    'Window Cleaning', 'Garage Door', 'Decking'
  ], [])
  const filteredTrades = useMemo(() => trades.filter(t => t.toLowerCase().includes(nicheQuery.toLowerCase())), [trades, nicheQuery])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await new Promise(r=>setTimeout(r, 700))
    login({ id: 'u_new', name: values.business, email: values.email, niche: values.niche }, { needsOnboarding: true })
    toast.success('Account created')
    navigate('/onboarding')
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <BackButton className="mb-2" onClick={() => navigate('/welcome')} />
        <div className="space-y-2">
          <TypeTagline mobilePinned="top" />
          <h1 className="text-xl font-semibold">Run your business. All OnSite.</h1>
          <p className="text-sm text-neutral-700">Simple tools for quotes, jobs, and payments.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label>Business name</Label>
            <Input className="mt-1" placeholder="OnSite Heating & Air" {...register('business')} />
            {errors.business && <p className="text-danger text-sm mt-1">{errors.business.message}</p>}
          </div>
          <div>
            <Label>Industry</Label>
            {/* Hidden input binds to form */}
            <input type="hidden" {...register('niche')} />
            <p className="text-xs text-neutral-700 mt-1">Pick your trade — you can change this later in Settings.</p>
            <div className="mt-2">
              <Select value={watch('niche') || undefined} onValueChange={(val)=> setValue('niche', val, { shouldValidate: true, shouldDirty: true })}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your trade" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input
                      placeholder="Search trade..."
                      value={nicheQuery}
                      onChange={(e)=> setNicheQuery(e.target.value)}
                      onKeyDown={(e)=> e.stopPropagation()}
                      className="h-9"
                    />
                  </div>
                  <SelectGroup>
                    <SelectLabel>{nicheQuery ? 'Results' : 'Popular trades'}</SelectLabel>
                    {filteredTrades.length === 0 ? (
                      <div className="px-2 py-2 text-sm text-neutral-600">No results</div>
                    ) : (
                      filteredTrades.map((trade)=> (
                        <SelectItem key={trade} value={trade}>{trade}</SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-neutral-700">Selected:</span>
                <span className="inline-flex items-center rounded-full bg-brand-navy text-white px-2.5 py-1 text-xs">
                  {watch('niche') || 'None'}
                </span>
              </div>
            </div>
            {errors.niche && <p className="text-danger text-sm mt-1">{errors.niche.message}</p>}
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" className="mt-1" placeholder="owner@business.com" {...register('email')} />
            {errors.email && <p className="text-danger text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" className="mt-1" placeholder="Strong password" {...register('password')} />
            {errors.password && <p className="text-danger text-sm mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Creating…' : 'Create account'}
          </Button>
        </form>
        <p className="text-sm">Already have an account? <Link className="text-brand-sky" to="/login">Log in</Link></p>
      </div>
    </AuthLayout>
  )
}
