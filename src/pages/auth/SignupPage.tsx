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
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8,'Use at least 8 characters with numbers & symbols'),
  niche: z.string().min(2, 'Choose your trade'),
  bbee: z.boolean().default(false).refine(val => val === true, {
    message: 'Please confirm B-BBEE compliance',
  })
})

export default function SignupPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s)=>s.login)
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  })

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
    await new Promise(r=>setTimeout(r, 700))
    login({ id: 'u_new', name: values.business, email: values.email, niche: values.niche }, { needsOnboarding: true })
    toast.success('Account created')
    navigate('/onboarding')
  }

  return (
    <AuthLayout>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col space-y-1">
          <BackButton className="self-start" onClick={() => navigate('/welcome')} />
          <div className="min-h-6 sm:min-h-8">
            <TypeTagline />
          </div>
        </div>
        
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">Register your business</h1>
          <p className="text-sm sm:text-base text-neutral-700">Join thousands of South African businesses growing with OnSite</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Row: Business + Industry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business" className="text-sm sm:text-base">Business name</Label>
              <Input 
                id="business"
                aria-describedby="business_help business_err"
                className="mt-1 h-11 sm:h-12 text-base" 
                placeholder="e.g. Mzansi Electrical Services" 
                {...register('business')} 
              />
              <p id="business_help" className="text-xs text-neutral-500 mt-1">Your business name as it appears to clients</p>
              {errors.business && <p id="business_err" className="text-danger text-xs sm:text-sm mt-1">{errors.business.message}</p>}
            </div>

            <div>
              <Label htmlFor="niche" className="text-sm sm:text-base">Industry</Label>
              <input id="niche" type="hidden" {...register('niche')} />
              <p className="text-xs sm:text-sm text-neutral-700 mt-1">
                Pick your trade — you can change this later in Settings.
              </p>
              <div className="mt-2">
                <Select 
                  value={watch('niche') || undefined} 
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
                
                {errors.niche && (
                  <p className="text-danger text-xs sm:text-sm mt-1">
                    {errors.niche.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-neutral-200" />
          
          {/* Row: Email + Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input 
                id="email"
                type="email" 
                aria-describedby="email_help email_err"
                className="mt-1 h-11 sm:h-12 text-base" 
                placeholder="your@business.co.za" 
                {...register('email')} 
              />
              <p id="email_help" className="text-xs text-neutral-500 mt-1">We'll send important updates to this address</p>
              {errors.email && <p id="email_err" className="text-danger text-xs sm:text-sm mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
              <Input 
                id="password"
                type="password" 
                aria-describedby="password_help password_err"
                className="mt-1 h-11 sm:h-12 text-base" 
                placeholder="Strong password" 
                {...register('password')} 
              />
              <p id="password_help" className="text-xs text-neutral-600 mt-1">
                Use at least 8 characters with numbers & symbols
              </p>
              {errors.password && <p id="password_err" className="text-danger text-xs sm:text-sm mt-1">{errors.password.message}</p>}
            </div>
          </div>
          {/* Selected trade summary (relocated) */}
          <div className="flex justify-end -mt-2 text-xs sm:text-sm text-neutral-600">
            Trade: <span className="ml-1 font-medium">{watch('niche') || 'None'}</span>
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
