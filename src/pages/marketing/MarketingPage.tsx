import PageHeader from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageIntro from '@/components/PageIntro'

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing"
        actions={(
          <PageIntro
            pageKey="marketing"
            title="Marketing"
            intro="Stay top-of-mind with clients using campaigns, reviews, and referrals. Start with templates, schedule seasonal messages, and track performance."
            bullets={[
              'Campaigns: announcements, promos, reminders',
              'Reviews: request and monitor ratings',
              'Referrals: reward customers who refer you'
            ]}
          />
        )}
      />

      {/* Campaigns */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="text-sm text-neutral-700">Campaigns</div>
            <div className="text-xl font-semibold">Stay top-of-mind with clients</div>
            <div className="text-neutral-700 text-sm">Send seasonal offers, reminders, and service plans.</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">View templates</Button>
            <Button className="bg-orange-600 hover:bg-orange-700">Create campaign</Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews & Referrals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Reviews</div>
              <Button variant="outline" size="sm">Request reviews</Button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border p-3">
                <div className="text-neutral-700">Avg. rating</div>
                <div className="text-2xl font-bold">4.8★</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-neutral-700">New this month</div>
                <div className="text-2xl font-bold">12</div>
              </div>
            </div>
            <Tabs defaultValue="all" className="space-y-2">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unreplied">Unreplied</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="space-y-2 text-sm">
                  <div className="rounded-xl border p-3">
                    <div className="font-medium">“Great service and fast response.”</div>
                    <div className="text-neutral-700">Smith Family • 5★</div>
                  </div>
                  <div className="rounded-xl border p-3">
                    <div className="font-medium">“Technician was professional and tidy.”</div>
                    <div className="text-neutral-700">Acme LLC • 5★</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="unreplied">
                <div className="text-sm text-neutral-700">No unreplied reviews.</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Referrals</div>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Enable program</Button>
            </div>
            <div className="text-sm text-neutral-700">Reward customers for referrals and grow organically.</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border p-3">
                <div className="text-neutral-700">Referrals this month</div>
                <div className="text-2xl font-bold">8</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-neutral-700">Conversion rate</div>
                <div className="text-2xl font-bold">32%</div>
              </div>
            </div>
            <div className="rounded-xl border p-3 text-sm">
              <div className="font-medium">Your link</div>
              <div className="text-neutral-700 break-all">https://onsite.app/your-business/referral</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
