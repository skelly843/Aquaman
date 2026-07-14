'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ShieldCheck, Loader2 } from 'lucide-react'

export default function AdminAuditLogPage() {
  const supabase = createClient()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLogs() {
      setLoading(true)
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
      setLogs(data || [])
      setLoading(false)
    }
    loadLogs()
  }, [])

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
          <ShieldCheck className="mr-2 text-blue-600" size={32} />
          System Audit Log
        </h1>
        <p className="text-slate-500 mt-1">Immutable ledger tracing customer creations, invoice issues, role alterations, and content adjustments.</p>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800">Operational Log Records</span>
            <span className="text-xs font-semibold text-slate-500">{logs.length} Operations Traced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action Event</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Target Entity</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">JSON Meta Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-400 font-semibold font-mono">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">
                      {log.action.replace('_', ' ').toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                      {log.target_type || 'system'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-mono bg-slate-50/50">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                      No system events logged under audit trail yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
