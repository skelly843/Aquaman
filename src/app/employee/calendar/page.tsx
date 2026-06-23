'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'

export default function EmployeeCalendar() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchAppointments() {
      if (!selectedDay || !supabase.from) return

      const startOfDay = new Date(selectedDay)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(selectedDay)
      endOfDay.setHours(23, 59, 59, 999)

      const { data } = await supabase
        .from('appointments')
        .select('*, profiles(full_name)')
        .gte('scheduled_at', startOfDay.toISOString())
        .lte('scheduled_at', endOfDay.toISOString())
        .order('scheduled_at', { ascending: true })

      setAppointments(data || [])
    }

    fetchAppointments()
  }, [selectedDay, supabase])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          <span>New Appointment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            className="mx-auto"
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedDay ? format(selectedDay, 'PPPP') : 'Select a day'}
          </h2>

          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((app) => (
                <div key={app.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-blue-500 border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-blue-600">{format(new Date(app.scheduled_at), 'p')}</p>
                    <p className="font-medium text-gray-900">{app.profiles?.full_name}</p>
                    <p className="text-sm text-gray-500">{app.service_type}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 uppercase">
                      {app.status}
                    </span>
                    <button className="text-sm text-blue-600 hover:underline">Details</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-500">
                No appointments for this day.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
