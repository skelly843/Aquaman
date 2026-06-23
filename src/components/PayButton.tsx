'use client'

import { useState } from 'react'

interface PayButtonProps {
  invoiceId: string
  amount: number
  status: string
}

export default function PayButton({ invoiceId, amount, status }: PayButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoiceId }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to initiate payment')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'paid') {
    return <span className="text-gray-400">Paid</span>
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="text-blue-600 hover:text-blue-900 font-bold disabled:opacity-50"
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  )
}
