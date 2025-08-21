import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthLayout from './AuthLayout'
import { useAuthStore } from '../../state/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import TypeTagline from '@/components/TypeTagline'

const schema = z.object({
  business: z.string().min(2,'Business name required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8,'Use at least 8 characters with numbers & symbols')
})

export default function SignupPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s)=>s.login)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await new Promise(r=>setTimeout(r, 700))
    login({ id: 'u_new', name: values.business, email: values.email }, { needsOnboarding: true })
    toast.success('Account created')
    navigate('/onboarding')
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
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
