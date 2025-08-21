import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import AuthLayout from './AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({ email: z.string().email('Enter a valid email') })

export default function ResetPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string}>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async ({ email }: { email: string }) => {
    await new Promise(r=>setTimeout(r, 700))
    toast.success('If an account exists, a reset link has been sent')
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Reset your password</h1>
          <p className="text-sm text-neutral-700">Enter your email to receive a reset link.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label>Email</Label>
            <Input type="email" className="mt-1" placeholder="you@business.com" {...register('email')} />
            {errors.email && <p className="text-danger text-sm mt-1">{errors.email.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
        <p className="text-sm"><Link className="text-brand-sky" to="/login">Back to login</Link></p>
      </div>
    </AuthLayout>
  )
}
