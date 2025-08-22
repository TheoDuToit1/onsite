import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import AuthLayout from './AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({ 
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(/^(\+?27|0)[6-8][0-9]{8}$/, 'Enter a valid SA number').optional()
}).refine(data => data.email || data.phone, {
  message: 'Enter either email or phone number',
  path: ['email']
})

export default function ResetPage() {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', phone: '' }
  })

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await new Promise(r=>setTimeout(r, 700))
    if (data.email) {
      toast.success('If an account exists, a reset link has been sent to your email')
    } else if (data.phone) {
      toast.success('An SMS with reset instructions has been sent to your phone')
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Reset your password</h1>
          <p className="text-sm text-neutral-700">Enter your email or mobile number to receive reset instructions.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Email or Phone</Label>
            <div className="grid gap-3">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-8">
                  <Input 
                    type="email" 
                    className="w-full" 
                    placeholder="your@email.co.za" 
                    {...register('email')} 
                    onChange={(e) => {
                      setValue('email', e.target.value);
                      if (e.target.value) setValue('phone', '');
                    }}
                  />
                </div>
                <div className="col-span-4 text-center text-sm text-gray-500 flex items-center justify-center">
                  or
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">+27</span>
                </div>
                <Input 
                  type="tel" 
                  className="pl-12"
                  placeholder="82 123 4567" 
                  {...register('phone')}
                  onChange={(e) => {
                    setValue('phone', e.target.value);
                    if (e.target.value) setValue('email', '');
                  }}
                />
              </div>
            </div>
            
            {(errors.email || errors.phone) && (
              <p className="text-danger text-sm mt-1">
                {errors.email?.message || errors.phone?.message || 'Please enter either email or phone number'}
              </p>
            )}
          </div>
          
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Sending…' : 'Send Reset Instructions'}
          </Button>
          
          <p className="text-xs text-neutral-500 mt-2">
            For security, we'll send instructions to reset your password. Standard SMS rates may apply.
          </p>
        </form>
        <p className="text-sm text-center">
          Remember your password?{' '}
          <Link to="/login" className="text-brand-orange hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
