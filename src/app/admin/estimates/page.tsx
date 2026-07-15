'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { FileCheck, Plus, CheckCircle2, AlertCircle, Loader2, ArrowRight, Trash2 } from 'lucide-react'

export default function AdminEstimatesPage() {
  const supabase = createClient()
  const [estimates, setEstimates] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    customerId: '',
    laborCost: '',
    materialsCost: '',
    total: '',
    status: 'draft',
    terms: ''
  })

  const loadEstimates = async () => {
    setLoading(true)
    const { data: ests } = await supabase
      .from('estimates')
      .select('*, customers(first_name, last_name, email)')
      .order('created_at', { ascending: false })

    const { data: custs } = await supabase
      .from('customers')
      .select('id, first_name, last_name')

    setEstimates(ests || [])
    setCustomers(custs || [])
    setLoading(false)
  }

  useEffect(() => {
    loadEstimates()
  }, [])

  const handleOpenNew = () => {
    setFormData({
      customerId: '',
      laborCost: '',
      materialsCost: '',
      total: '',
      status: 'draft',
      terms: ''
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    const labor = Number(formData.laborCost || 0)
    const materials = Number(formData.materialsCost || 0)
    const computedTotal = Number(formData.total) || (labor + materials)

    const { error: insertErr } = await supabase
      .from('estimates')
      .insert([
        {
          customer_id: formData.customerId,
          labor_cost: labor,
          materials_cost: materials,
          total: computedTotal,
          status: formData.status,
          terms_conditions: formData.terms
        }
      ])

    if (insertErr) {
      setError(insertErr.message)
    } else {
      setSuccess('Estimate draft created successfully!')
      setShowModal(false)
      loadEstimates()
    }
    setSaving(false)
  }

  const handleConvertToJob = async (est: any) => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    // Convert approved estimate to job
    const { data: newJob, error: jobErr } = await supabase
      .from('jobs')
      .insert([
        {
          customer_id: est.customer_id,
          title: `Project: Converted Estimate #${est.estimate_number}`,
          description: `Automatically created from approved Estimate. Terms: ${est.terms_conditions || ''}`,
          total_amount: est.total,
          status: 'approved',
          payment_status: 'unpaid'
        }
      ])
      .select()
      .single()

    if (jobErr) {
      setError(jobErr.message)
    } else {
      // Update estimate status
      await supabase
        .from('estimates')
        .update({ status: 'converted', job_id: newJob.id })
        .eq('id', est.id)

      setSuccess(`Success! Converted approved Estimate #${est.estimate_number} into a live Project/Job.`);
      loadEstimates()
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this estimate?')) return
    const { error: delErr } = await supabase
      .from('estimates')
      .delete()
      .eq('id', id)

    if (delErr) {
      setError(delErr.message)
    } else {
      setSuccess('Estimate removed.')
      loadEstimates()
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contract Estimating & Proposals</h1>
          <p className="text-slate-500 mt-1">Draft bid estimates, set materials costs, labor, and convert to Jobs instantly upon approval.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center space-x-1.5 shadow-md shadow-blue-100"
        >
          <Plus size={16} />
          <span>New Proposal Estimate</span>
        </button>
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
        <div className="p-12 flex justify-center items-center">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800">Proposal Estimates</span>
            <span className="text-xs font-semibold text-slate-500">{estimates.length} Proposals Total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Proposal ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Labor / Mat</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Est</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {estimates.map((est) => (
                  <tr key={est.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-slate-700">
                      EST-{est.estimate_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-semibold">
                      {est.customers?.first_name} {est.customers?.last_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        est.status === 'converted'
                          ? 'bg-purple-50 text-purple-700 border-purple-100'
                          : est.status === 'approved'
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {est.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 space-y-0.5">
                      <p>Labor: ${Number(est.labor_cost || 0).toFixed(2)}</p>
                      <p>Materials: ${Number(est.materials_cost || 0).toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-900">
                      ${Number(est.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Convert approved estimates */}
                        {est.status === 'approved' && (
                          <button
                            onClick={() => handleConvertToJob(est)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg flex items-center space-x-1"
                          >
                            <ArrowRight size={12} />
                            <span>Convert to Job</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(est.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {estimates.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                      No proposal estimates found. Click "New Proposal Estimate" to compose a bid.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Draft Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-6">
              <h2 className="text-xl font-bold">Compose Proposal Estimate</h2>
              <p className="text-xs text-slate-400 mt-1">Setup client mapping, itemization bids, and labor fees.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select CRM Customer</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  required
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Estimated Labor ($)</label>
                  <input
                    type="number"
                    value={formData.laborCost}
                    onChange={(e) => setFormData({ ...formData, laborCost: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g. 500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Materials Budget ($)</label>
                  <input
                    type="number"
                    value={formData.materialsCost}
                    onChange={(e) => setFormData({ ...formData, materialsCost: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g. 250"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Custom Override Total ($)</label>
                  <input
                    type="number"
                    value={formData.total}
                    onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Auto-calculates if blank"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Terms & Scope</label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-20"
                  placeholder="Payment upon completion, valid for 30 days..."
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-md text-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Estimate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
