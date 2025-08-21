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
import TypeTagline from '@/components/TypeTagline'
import BackButton from '@/components/BackButton'

const schema = z.object({
  mode: z.enum(['email', 'phone']).default('email'),
  email: z.string().email('Enter a valid email').optional(),
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/,{ message: 'Use E.164, e.g. +15551234567'}).optional(),
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
    await new Promise(r=>setTimeout(r, 700))
    login({ id: 'u_demo', name: 'Alex Contractor', email: values.email })
    toast.success('Welcome back!')
    navigate('/dashboard')
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

        <div className="flex gap-1 bg-neutral-200 p-1 rounded-xl text-sm">
          <Button type="button" variant={mode==='email' ? 'default' : 'secondary'} className="flex-1" onClick={()=>setValue('mode','email')}>Email</Button>
          <Button type="button" variant={mode==='phone' ? 'default' : 'secondary'} className="flex-1" onClick={()=>setValue('mode','phone')}>Phone</Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {mode==='email' ? (
            <>
              <div>
                <Label>Email</Label>
                <Input type="email" className="mt-1" placeholder="you@business.com" {...register('email')} />
                {errors.email && <p className="text-danger text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" className="mt-1" placeholder="••••••••" {...register('password')} />
                {errors.password && <p className="text-danger text-sm mt-1">{errors.password.message}</p>}
              </div>
            </>
          ) : (
            <div>
              <Label>Phone</Label>
              <Input type="tel" className="mt-1" placeholder="+15551234567" {...register('phone')} />
              {errors.phone && <p className="text-danger text-sm mt-1">{errors.phone.message}</p>}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button type="button" variant="link" className="px-0" onClick={()=>navigate('/reset')}>Forgot password?</Button>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Signing in…' : 'Continue'}
          </Button>

          <Button type="button" variant="secondary" onClick={()=>{ demoLogin(); toast('Autofilled demo'); navigate('/dashboard') }} className="w-full">
            Demo Autofill
          </Button>
        </form>

        <p className="text-sm">No account? <Link className="text-brand-sky" to="/signup">Sign up</Link></p>
      </div>
    </AuthLayout>
  )
}
