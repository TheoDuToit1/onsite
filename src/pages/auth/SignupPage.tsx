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
import BackButton from '@/components/BackButton'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'
 import { supabase } from '../../lib/supabase'

const schema = z.object({
  business: z.string().min(2,'Business name required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8,'Use at least 8 characters with numbers & symbols'),
  niche: z.string().min(2, 'Choose your trade'),
  countryCode: z.string().min(1, 'Select country code'),
  phone: z.string().min(7, 'Enter a valid phone'),
  bbee: z.boolean().default(false).refine(val => val === true, {
    message: 'Please confirm B-BBEE compliance',
  })
})

export default function SignupPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s)=>s.login)
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      business: '',
      email: '',
      password: '',
      niche: '', // ensure Select is controlled from first render
      countryCode: '+27',
      phone: '',
      bbee: false,
    }
  })

  const onInvalid = (errs: typeof errors) => {
    const firstKey = Object.keys(errs)[0] as keyof typeof errs | undefined
    const msg = firstKey ? errs[firstKey]?.message : undefined
    if (msg) toast.error(String(msg))
    // Try scroll to first invalid field
    if (firstKey) {
      const el = document.querySelector(`[name="${String(firstKey)}"]`) as HTMLElement | null
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const [nicheQuery, setNicheQuery] = useState('')
  const trades = useMemo(() => [
    'Electrician', 'Plumber', 'Aircon Technician', 'Carpenter', 'Painter', 'Roofer',
    'Gardener', 'Domestic Worker', 'Handyman', 'Locksmith', 'Flooring Installer', 'Tiler',
    'Bricklayer', 'Plasterer', 'Glazier', 'Pest Control', 'Pool Service', 'Solar Installer',
    'Appliance Repair', 'Builder', 'Fencing', 'Guttering', 'Tree Felling',
    'Window Cleaning', 'Gate & Garage', 'Paving', 'Security Installer', 'Alarm Technician',
    'Electric Fencing', 'Borehole & Irrigation', 'Paving & Driveways', 'Thatching',
    'Swimming Pool Maintenance', 'Geyser Installations', 'Generator Installations'
  ], [])
  const filteredTrades = useMemo(() => trades.filter(t => t.toLowerCase().includes(nicheQuery.toLowerCase())), [trades, nicheQuery])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      // Normalize phone to E.164
      const code = values.countryCode.startsWith('+') ? values.countryCode : `+${values.countryCode}`
      const digits = values.phone.replace(/\D/g, '')
      let national = digits
      // Example rule: ZA often starts with leading 0, drop it for E.164
      if (code === '+27' && national.startsWith('0')) national = national.slice(1)
      const phoneE164 = `${code}${national}`

      // 1) Create Supabase Auth user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            niche: values.niche,
            business: values.business,
            bbee: values.bbee,
            country_code: code,
            phone: phoneE164,
          },
        },
      })
      if (signUpError) throw signUpError
      const user = signUpData.user
      if (!user) throw new Error('Signup failed: no user returned')

      // If email confirmations are enabled, Supabase won't return a session yet.
      // In that case, skip RPC (requires auth) and ask user to verify email before continuing.
      if (!signUpData.session) {
        toast.success('Account created. Please check your email to confirm your account.')
        navigate('/login')
        return
      }

      // 2) Call RPC to create org/profile/membership and store niche, phone & onboarding
      const { error: rpcError } = await supabase.rpc('create_account', {
        p_user_id: user.id,
        p_org_name: values.business,
        p_full_name: values.business, // no separate full name field; use business for now
        p_phone: phoneE164,
        p_niche: values.niche,
        p_onboarding: {
          bbee: values.bbee,
          completed: false,
          created_at: new Date().toISOString(),
        },
        p_role: 'owner',
      })
      if (rpcError) throw rpcError

      // 3) Set local auth state and proceed to onboarding
      login({ id: user.id, name: values.business, email: values.email, niche: values.niche }, { needsOnboarding: true })
      toast.success('Account created')
      navigate('/onboarding')
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Failed to create account')
    }
  }

  return (
    <AuthLayout>
      <div className="max-w-lg mx-auto space-y-6 sm:space-y-7">
        <div className="flex flex-col">
          <BackButton className="self-start" onClick={() => navigate('/welcome')} />
        </div>
        
        <div className="space-y-2 sm:space-y-3 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">Register your business</h1>
          <p className="text-[13px] text-neutral-600">Create your account to get started</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
          {/* Section: Business & Industry */}
          <h2 className="text-xs uppercase tracking-wide text-neutral-500">Business & Industry</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-lg p-4 bg-neutral-50">
            <div>
              <Label htmlFor="business" className="text-sm sm:text-base">Business name</Label>
              <Input 
                id="business"
                aria-describedby="business_help business_err"
                className="mt-1 h-11 sm:h-12 text-base" 
                placeholder="e.g. Mzansi Electrical Services" 
                required
                {...register('business')} 
              />
              <p id="business_help" className="help-text mt-1">Your business name as it appears to clients</p>
              {errors.business && <p id="business_err" className="text-danger text-[13px] mt-1">{errors.business.message}</p>}
            </div>

            <div>
              <Label htmlFor="niche" className="text-sm sm:text-base">Industry</Label>
              <input id="niche" type="hidden" {...register('niche')} />
              <div className="mt-1">
                <Select 
                  value={watch('niche') ?? ''}
                  onValueChange={(val)=> setValue('niche', val, { shouldValidate: true, shouldDirty: true })}
                >
                  <SelectTrigger className="h-11 sm:h-12 text-base">
                    <SelectValue placeholder="Select your trade" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[320px] overflow-y-auto">
                    <div className="sticky top-0 z-10 bg-white p-2 border-b">
                      <Input
                        placeholder="Search trade..."
                        value={nicheQuery}
                        onChange={(e)=> setNicheQuery(e.target.value)}
                        onKeyDown={(e)=> e.stopPropagation()}
                        className="h-9 text-sm sm:text-base"
                      />
                    </div>
                    <SelectGroup>
                      <SelectLabel className="text-xs sm:text-sm px-2 py-1">
                        {nicheQuery ? 'Results' : 'Popular trades'}
                      </SelectLabel>
                      {filteredTrades.length === 0 ? (
                        <div className="px-2 py-2 text-sm text-neutral-600">No results</div>
                      ) : (
                        filteredTrades.map((trade) => (
                          <SelectItem 
                            key={trade} 
                            value={trade}
                            className="text-sm sm:text-base"
                          >
                            {trade}
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                
                {/* Removed inline selected chip to reduce vertical spacing */}
                
                <p className="help-text mt-1">
                  Pick your trade — you can change this later in Settings.
                </p>
                {errors.niche && (
                  <p className="text-danger text-[13px] mt-1">
                    {errors.niche.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-neutral-200" />
          
          {/* Section: Contact */}
          <h2 className="text-xs uppercase tracking-wide text-neutral-500">Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-lg p-4 bg-neutral-50">
            <div>
              <Label htmlFor="countryCode" className="text-sm sm:text-base">Country</Label>
              <input id="countryCode" type="hidden" {...register('countryCode')} />
              <div className="mt-1">
                <Select
                  value={watch('countryCode') ?? ''}
                  onValueChange={(val) => setValue('countryCode', val, { shouldValidate: true, shouldDirty: true })}
                >
                  <SelectTrigger className="h-11 sm:h-12 text-base">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[280px] overflow-y-auto">
                    <SelectGroup>
                      <SelectLabel className="text-xs sm:text-sm px-2 py-1">Popular</SelectLabel>
                      <SelectItem value="+27">South Africa (+27)</SelectItem>
                      <SelectItem value="+84">Vietnam (+84)</SelectItem>
                      <SelectItem value="+1">United States (+1)</SelectItem>
                      <SelectItem value="+44">United Kingdom (+44)</SelectItem>
                      <SelectItem value="+91">India (+91)</SelectItem>
                      <SelectItem value="+234">Nigeria (+234)</SelectItem>
                      <SelectItem value="+254">Kenya (+254)</SelectItem>
                      <SelectItem value="+49">Germany (+49)</SelectItem>
                      <SelectItem value="+61">Australia (+61)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.countryCode && (
                  <p className="text-danger text-[13px] mt-1">{errors.countryCode.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm sm:text-base">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                aria-describedby="phone_err"
                className="mt-1 h-11 sm:h-12 text-base"
                placeholder="e.g. 812345678"
                required
                {...register('phone')}
              />
              <p className="help-text mt-1">We will format to E.164 automatically (e.g. {watch('countryCode') || '+27'}812345678)</p>
              {errors.phone && <p id="phone_err" className="text-danger text-[13px] mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Section: Account Security */}
          <h2 className="text-xs uppercase tracking-wide text-neutral-500">Account Security</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-lg p-4 bg-neutral-50">
            <div>
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input 
                id="email"
                type="email" 
                aria-describedby="email_help email_err"
                className="mt-1 h-11 sm:h-12 text-base" 
                placeholder="your@business.co.za" 
                required
                {...register('email')} 
              />
              <p id="email_help" className="help-text mt-1">We'll send important updates to this address</p>
              {errors.email && <p id="email_err" className="text-danger text-[13px] mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
              <Input 
                id="password"
                type="password" 
                aria-describedby="password_help password_err"
                className="mt-1 h-11 sm:h-12 text-base" 
                placeholder="Strong password" 
                required
                {...register('password')} 
              />
              <p id="password_help" className="help-text mt-1">
                Use at least 8 characters with numbers & symbols
              </p>
              {errors.password && <p id="password_err" className="text-danger text-[13px] mt-1">{errors.password.message}</p>}
            </div>
          </div>
          {/* Selected trade summary (relocated) */}
          <div className="flex justify-end -mt-2 text-xs sm:text-sm text-neutral-600">
            Trade: <span className="ml-1 font-medium">{watch('niche') || 'None'}</span>
          </div>

          {/* B-BBEE compliance confirmation */}
          <div className="flex items-start gap-3 border rounded-md p-3 bg-neutral-50">
            <input
              id="bbee"
              type="checkbox"
              className="mt-1 h-4 w-4"
              {...register('bbee')}
            />
            <div className="flex-1">
              <Label htmlFor="bbee" className="text-sm sm:text-base">I confirm B-BBEE compliance</Label>
              <p className="help-text">This helps us tailor documents for South African regulations.</p>
              {errors.bbee && (
                <p className="text-danger text-[13px] mt-1">{errors.bbee.message}</p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
          >
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
        
        <p className="text-sm sm:text-base text-center">
          Already have an account?{' '}
          <Link className="text-brand-sky font-medium" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
