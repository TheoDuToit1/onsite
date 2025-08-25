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
    await new Promise(r=>setTimeout(r, 700))
    login({ id: 'u_demo', name: 'Alex Contractor', email: values.email })
    toast.success('Welcome back!')
    navigate('/dashboard')
  }

  return (
    <AuthLayout>
      <div className="space-y-4 sm:space-y-5">
        <div className="flex flex-col">
          <BackButton className="self-start" onClick={() => navigate('/welcome')} />
        </div>

        {/* Heading block (normalized spacing after removing typewriter) */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-xl sm:text-2xl font-semibold">Welcome back to OnSite</h1>
          <p className="text-sm sm:text-base text-neutral-700">Your all-in-one solution for South African businesses</p>
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
                  placeholder="your@business.co.za" 
                  {...register('email')} 
                />
                {errors.email && <p className="text-danger text-xs sm:text-sm mt-1">{errors.email.message}</p>}
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
                  <Link to="/auth/reset" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:underline">Forgot?</Link>
                </div>
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
            <div className="space-y-2 text-center">
              <p className="text-xs text-neutral-500">Or explore with a demo account</p>
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
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
          >
            {isSubmitting ? 'Signing in…' : 'Continue'}
          </Button>
        </form>

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
