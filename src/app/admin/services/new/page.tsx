import ServiceForm from '@/components/admin/ServiceForm'

export default function NewServicePage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Add New Service</h1>
        <p className="text-slate-500 mt-1">Create a new service offering for your website.</p>
      </div>
      <ServiceForm />
    </div>
  )
}
