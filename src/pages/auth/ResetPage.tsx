import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AuthLayout from './AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Form error handler (must be below imports)
const onError = (errs: any) => {
  const first = errs?.email?.message || 'Please enter a valid email'
  toast.error(first)
}

const schema = z.object({ 
  email: z.string().email('Enter a valid email address'),
})

export default function ResetPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' }
  })
  const [isRecovery, setIsRecovery] = useState(false)
  const [sent, setSent] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  // Detect recovery landing from Supabase email link
  useEffect(() => {
    try {
      const hash = window.location.hash || ''
      // Supabase appends params like #access_token=...&type=recovery
      if (hash.includes('type=recovery') || hash.includes('access_token=')) {
        setIsRecovery(true)
      }
    } catch {}
  }, [])

  const redirectTo = useMemo(() => `${window.location.origin}/reset`, [])

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      console.debug('Sending password reset for', data.email, 'redirectTo', redirectTo)
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, { redirectTo })
      if (error) throw error
      toast.success('If an account exists, a reset link has been sent to your email')
      setSent(true)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Could not send reset instructions')
    }
  }

  const onUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      toast.success('Password updated. Please sign in.')
      navigate('/login', { replace: true })
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Failed to update password')
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {!isRecovery ? (
          <>
            <div>
              <h1 className="text-xl font-semibold">Reset your password</h1>
              <p className="text-sm text-neutral-700">Enter your email to receive reset instructions.</p>
            </div>
            {!sent ? (
            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
              <div>
                <Label>Email</Label>
                <div className="grid gap-3">
                  <div>
                    <Input 
                      type="email" 
                      className="w-full" 
                      placeholder="your@email.co.za" 
                      required
                      {...register('email')} 
                      onChange={(e) => {
                        setValue('email', e.target.value)
                      }}
                    />
                  </div>
                </div>
                {(errors.email) && (
                  <p className="text-danger text-sm mt-1">{errors.email?.message}</p>
                )}
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending…' : 'Send Reset Instructions'}
              </Button>
              
              <p className="text-xs text-neutral-500 mt-2">
                We’ll email you a secure link to set a new password.
              </p>
            </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border p-4 bg-neutral-50">
                  <p className="font-medium">Check your email</p>
                  <p className="text-sm text-neutral-600 mt-1">If an account exists, we’ve sent a link to reset your password. It may take a minute to arrive and could be in your spam folder.</p>
                </div>
                <Button onClick={()=>setSent(false)} variant="ghost" className="w-full">Send again</Button>
                <p className="text-sm text-center">
                  Remember your password?{' '}
                  <Link to="/login" className="text-brand-orange hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
            <p className="text-sm text-center">
              Remember your password?{' '}
              <Link to="/login" className="text-brand-orange hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-xl font-semibold">Choose a new password</h1>
              <p className="text-sm text-neutral-700">Enter a new password for your account.</p>
            </div>
            <form onSubmit={onUpdatePassword} className="space-y-4">
              <div>
                <Label>New Password</Label>
                <Input 
                  type="password"
                  className="w-full"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e)=> setNewPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Update Password</Button>
              <p className="text-xs text-neutral-500 mt-2">
                After updating, you’ll be redirected to sign in.
              </p>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
