import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/state/auth'

export default function SettingsPage() {
  const navigate = useNavigate()
  const logout = useAuthStore(s => s.logout)
  const onSave = (e: React.FormEvent) => { e.preventDefault(); toast.success('Settings saved') }
  const onInvite = (e: React.FormEvent) => { e.preventDefault(); toast.success('Invitation sent') }
  const onLogout = () => { logout(); navigate('/welcome', { replace: true }) }
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          <TabsTrigger value="profile" className="flex-1 sm:flex-none">Profile</TabsTrigger>
          <TabsTrigger value="business" className="flex-1 sm:flex-none">Business</TabsTrigger>
          <TabsTrigger value="team" className="flex-1 sm:flex-none">Team</TabsTrigger>
          <TabsTrigger value="templates" className="flex-1 sm:flex-none">Templates</TabsTrigger>
          <TabsTrigger value="integrations" className="flex-1 sm:flex-none">Integrations</TabsTrigger>
          <TabsTrigger value="billing" className="flex-1 sm:flex-none">Billing</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 sm:flex-none">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Personal details visible to your team and on documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSave} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Name</Label>
                    <Input placeholder="Alex Contractor" className="mt-1" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" placeholder="owner@business.com" className="mt-1" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input placeholder="+15551234567" className="mt-1" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" className="sm:w-auto">Save changes</Button>
                  <Button type="button" variant="secondary" className="text-red-600 sm:w-auto" onClick={onLogout}>Log out</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Business</CardTitle>
              <CardDescription>Your company identity used on quotes and invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSave} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <Label>Business name</Label>
                    <Input placeholder="OnSite Heating & Air" className="mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Address</Label>
                    <Input placeholder="123 Main St" className="mt-1" />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input placeholder="San Jose" className="mt-1" />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input placeholder="CA" className="mt-1" />
                  </div>
                  <div>
                    <Label>ZIP</Label>
                    <Input placeholder="95112" className="mt-1" />
                  </div>
                  <div>
                    <Label>Tax rate</Label>
                    <Input placeholder="8.25%" className="mt-1" />
                  </div>
                </div>
                <Button type="submit">Save changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Invite teammates and manage roles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={onInvite} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <Input type="email" placeholder="teammate@business.com" className="flex-1" />
                <Button type="submit" className="w-full sm:w-auto">Invite</Button>
              </form>
              <div className="grid sm:grid-cols-2 gap-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="font-medium">Alex Contractor</div>
                    <div className="text-sm text-neutral-700">Owner</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="font-medium">Sam Tech</div>
                    <div className="text-sm text-neutral-700">Technician</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>Default texts used on quotes and invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSave} className="space-y-4">
                <div>
                  <Label>Quote footer</Label>
                  <Textarea placeholder="Thanks for the opportunity…" className="mt-1" />
                </div>
                <div>
                  <Label>Invoice footer</Label>
                  <Textarea placeholder="Thank you for your business!" className="mt-1" />
                </div>
                <Button type="submit">Save changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect your favorite tools.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-xl border p-3">
                <div>
                  <div className="font-medium">Stripe</div>
                  <div className="text-sm text-neutral-700">Accept payments online</div>
                </div>
                <Button className="w-full sm:w-auto">Connect</Button>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-xl border p-3">
                <div>
                  <div className="font-medium">QuickBooks</div>
                  <div className="text-sm text-neutral-700">Sync invoices and clients</div>
                </div>
                <Button variant="secondary" className="w-full sm:w-auto">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Manage your subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">Current plan</div>
                    <div className="text-sm text-neutral-700">Pro — $29/mo</div>
                  </div>
                  <Button className="w-full sm:w-auto">Manage billing</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSave} className="space-y-4 max-w-md">
                <div>
                  <Label>Email notifications</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="important">Important only</SelectItem>
                      <SelectItem value="all">All activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Mobile push</Label>
                  <Select defaultValue="important">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="important">Important only</SelectItem>
                      <SelectItem value="all">All activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Save changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
