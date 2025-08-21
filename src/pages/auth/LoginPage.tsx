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
      <div className="space-y-5 sm:space-y-6">
        <div className="flex flex-col space-y-2">
          <BackButton className="self-start" onClick={() => navigate('/welcome')} />
          <TypeTagline />
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-xl sm:text-2xl font-semibold">Run your business. All OnSite.</h1>
          <p className="text-sm sm:text-base text-neutral-700">Simple tools for quotes, jobs, and payments.</p>
        </div>

        <div className="flex gap-1 bg-neutral-200 p-1 rounded-xl text-sm sm:text-base">
          <Button 
            type="button" 
            variant={mode==='email' ? 'default' : 'secondary'} 
            className="flex-1 py-2 text-sm sm:text-base" 
            onClick={()=>setValue('mode','email')}
          >
            Email
          </Button>
          <Button 
            type="button" 
            variant={mode==='phone' ? 'default' : 'secondary'} 
            className="flex-1 py-2 text-sm sm:text-base" 
            onClick={()=>setValue('mode','phone')}
          >
            Phone
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          {mode==='email' ? (
            <>
              <div>
                <Label className="text-sm sm:text-base">Email</Label>
                <Input 
                  type="email" 
                  className="mt-1 h-11 sm:h-12 text-base" 
                  placeholder="you@business.com" 
                  {...register('email')} 
                />
                {errors.email && <p className="text-danger text-xs sm:text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label className="text-sm sm:text-base">Password</Label>
                <Input 
                  type="password" 
                  className="mt-1 h-11 sm:h-12 text-base" 
                  placeholder="••••••••" 
                  {...register('password')} 
                />
                {errors.password && <p className="text-danger text-xs sm:text-sm mt-1">{errors.password.message}</p>}
              </div>
            </>
          ) : (
            <div>
              <Label className="text-sm sm:text-base">Phone</Label>
              <Input 
                type="tel" 
                className="mt-1 h-11 sm:h-12 text-base" 
                placeholder="+15551234567" 
                {...register('phone')} 
              />
              {errors.phone && <p className="text-danger text-xs sm:text-sm mt-1">{errors.phone.message}</p>}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <Button 
              type="button" 
              variant="link" 
              className="px-0 text-xs sm:text-sm h-auto" 
              onClick={()=>navigate('/reset')}
            >
              Forgot password?
            </Button>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
          >
            {isSubmitting ? 'Signing in…' : 'Continue'}
          </Button>

          <Button 
            type="button" 
            variant="outline" 
            onClick={()=>{ demoLogin(); toast('Autofilled demo'); navigate('/dashboard') }} 
            className="w-full h-11 sm:h-12 text-sm sm:text-base"
          >
            Demo Autofill
          </Button>
        </form>

        <p className="text-sm sm:text-base text-center">
          No account?{' '}
          <Link className="text-brand-sky font-medium" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
