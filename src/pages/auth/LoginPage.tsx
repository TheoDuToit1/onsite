import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { demoLogin, useAuthStore } from '../../state/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from './AuthLayout'
import BackButton from '@/components/BackButton'
import { supabase } from '@/lib/supabase'

const schema = z.object({
  mode: z.enum(['email', 'phone']).default('email'),
  email: z.string().email('Enter a valid email').optional(),
  phone: z.string().regex(/^(\+?27|0)[6-8][0-9]{8}$/,{ message: 'Enter a valid SA number, e.g. 0821234567'}).optional(),
  password: z.string().min(6,'Minimum 6 characters').optional(),
})
.refine((val)=> (val.mode==='email' ? !!val.email && !!val.password : !!val.phone), {
  message: 'Fill required fields',
  path: ['email']
})

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s)=>s.login)
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { mode: 'email' }
  })

  const mode = watch('mode')
  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      if (mode === 'email') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email!,
          password: values.password!,
        })
        if (error) throw error
        const user = data.user
        if (!user) throw new Error('Login failed')
        // Try to fetch organization name from DB (authoritative)
        let company = (user.user_metadata as any)?.business || user.email || 'Your Business'
        try {
          const { data: profile, error: profileErr } = await supabase
            .from('core.profiles')
            .select('default_org_id')
            .eq('id', user.id)
            .single()
          if (!profileErr && profile?.default_org_id) {
            const { data: org, error: orgErr } = await supabase
              .from('core.organizations')
              .select('name')
              .eq('id', profile.default_org_id)
              .single()
            if (!orgErr && org?.name) company = org.name
          }
        } catch {}
        const niche = (user.user_metadata as any)?.niche as string | undefined
        login({ id: user.id, name: company, email: user.email || undefined, niche })
        try { localStorage.setItem('businessName', company) } catch {}
        toast.success('Welcome back!')
        navigate('/dashboard')
      } else {
        toast.error('Phone login not implemented yet')
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Failed to sign in')
    }
  }

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto space-y-6 sm:space-y-7">
        <div className="flex flex-col">
          <BackButton className="self-start" onClick={() => navigate('/welcome')} />
        </div>

        {/* Heading */}
        <div className="space-y-2 sm:space-y-3 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold">Welcome back</h1>
          <p className="text-[13px] text-neutral-600">Sign in to continue to your dashboard</p>
        </div>

        {/* Mode toggle */}
        <div className="rounded-xl border bg-neutral-50 p-1 flex gap-1 text-sm sm:text-base">
          <Button
            type="button"
            variant={mode==='email' ? 'default' : 'ghost'}
            className="flex-1 py-2"
            onClick={()=>setValue('mode','email')}
          >Email</Button>
          <Button
            type="button"
            variant={mode==='phone' ? 'default' : 'ghost'}
            className="flex-1 py-2"
            onClick={()=>setValue('mode','phone')}
          >Phone</Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
          {mode==='email' ? (
            <>
              <div>
                <Label className="text-sm sm:text-base">Email</Label>
                <Input 
                  type="email" 
                  className="mt-1 h-11 sm:h-12 text-base" 
                  placeholder="your@business.co.za" 
                  {...register('email')} 
                />
                {errors.email && <p className="text-danger text-[13px] mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label className="text-sm sm:text-base">Password</Label>
                <div className="relative">
                  <Input 
                    type="password" 
                    className="mt-1 h-11 sm:h-12 text-base pr-10" 
                    placeholder="••••••••" 
                    {...register('password')} 
                  />
                  <Link to="/reset" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:underline">Forgot?</Link>
                </div>
                {errors.password && <p className="text-danger text-[13px] mt-1">{errors.password.message}</p>}
              </div>
            </>
          ) : (
            <div>
              <Label className="text-sm sm:text-base">Phone</Label>
              <Input 
                type="tel" 
                className="mt-1 h-11 sm:h-12 text-base" 
                placeholder="e.g. +84123456789" 
                {...register('phone')} 
              />
              {errors.phone && <p className="text-danger text-[13px] mt-1">{errors.phone.message}</p>}
            </div>
          )}

          {/* Actions */}
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
          >
            {isSubmitting ? 'Signing in…' : 'Continue'}
          </Button>
        </form>

        {/* Demo section */}
        <div className="border rounded-lg p-4 bg-neutral-50 space-y-3">
          <p className="text-[13px] text-neutral-600 text-center">Or explore with a demo account</p>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={async ()=>{
              await demoLogin()
              navigate('/dashboard')
            }}
          >
            View Demo
          </Button>
        </div>

        <div className="text-center text-sm text-neutral-600">
          New to OnSite?{' '}
          <Link to="/signup" className="font-medium text-brand-orange hover:underline">
            Register your business
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
