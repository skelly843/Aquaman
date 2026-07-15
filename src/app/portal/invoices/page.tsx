'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Droplet, ArrowLeft, Loader2, FileText, CheckCircle2, AlertCircle } from 'lucide-react'

export default function CustomerInvoicesPage() {
  const supabase = createClient()
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadInvoices = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user.email || '')
        .limit(1)
        .maybeSingle()

      if (customer) {
        const { data } = await supabase
          .from('invoices')
          .select('*')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false })
        setInvoices(data || [])
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  const handleSimulatePayment = async (id: string, total: number) => {
    setPaying(id)
    setError(null)
    setSuccess(null)

    const { data: { user } } = await supabase.auth.getUser()
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', user?.email || '')
      .limit(1)
      .maybeSingle()

    // 1. Record payment in database
    const { error: payErr } = await supabase
      .from('payments')
      .insert([
        {
          customer_id: customer?.id,
          invoice_id: id,
          amount: total,
          payment_method: 'stripe',
          reference_number: `SIM-STRIPE-${Math.random().toString(36).substring(2,10).toUpperCase()}`
        }
      ])

    if (payErr) {
      setError(payErr.message)
    } else {
      // 2. Update invoice status to paid
      await supabase
        .from('invoices')
        .update({ status: 'paid', amount_paid: total })
        .eq('id', id)

      setSuccess('Payment processed successfully! Thank you for your business.')
      loadInvoices()
    }
    setPaying(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b bg-white sticky top-0 z-50">
        <Link href="/" className="flex items-center space-x-2">
          <Droplet className="text-blue-600" size={32} />
          <span className="text-2xl font-bold text-slate-900">Aquaman Client Portal</span>
        </Link>
        <Link href="/portal" className="text-sm font-bold text-blue-600 hover:underline">
          Portal Dashboard
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 w-full space-y-6">
        <Link href="/portal" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-800">
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Invoices</h1>
          <p className="text-slate-500 mt-1">Review your service bills, transaction logs, and process secure payments.</p>
        </div>

        {success && (
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-sm font-semibold text-green-700 flex items-center">
            <CheckCircle2 size={16} className="mr-2" /> {success}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm font-semibold text-red-700 flex items-center">
            <AlertCircle size={16} className="mr-2" /> {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 flex justify-center items-center bg-white rounded-2xl border border-slate-200">
            <Loader2 className="animate-spin text-blue-600" size={24} />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">Outstanding & Paid Invoices</span>
              <span className="text-xs font-semibold text-slate-500">{invoices.length} Invoices Total</span>
            </div>

            <div className="divide-y divide-slate-100 p-6 space-y-4">
              {invoices.map((inv) => (
                <div key={inv.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                      <FileText size={22} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-extrabold text-slate-800 text-lg">Invoice #INV-{inv.invoice_number}</p>
                      <p className="text-xs text-slate-400">Issued: {inv.issue_date || new Date(inv.created_at).toLocaleDateString()}</p>
                      {inv.notes && <p className="text-xs text-slate-500 font-semibold">{inv.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Amount</p>
                      <p className="text-lg font-black text-slate-900">${Number(inv.total || inv.amount).toFixed(2)}</p>
                    </div>

                    {inv.status === 'unpaid' || inv.status === 'sent' || inv.status === 'draft' ? (
                      <button
                        onClick={() => handleSimulatePayment(inv.id, Number(inv.total || inv.amount))}
                        disabled={paying === inv.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
                      >
                        {paying === inv.id ? 'Paying...' : 'Pay Online'}
                      </button>
                    ) : (
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                        inv.status === 'paid'
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {inv.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {invoices.length === 0 && (
                <div className="text-center py-12 text-slate-400 italic">
                  No billing history found. All clean!
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
