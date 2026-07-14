import { NextResponse } from 'next/server'
import { stripe } from '@/utils/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { invoiceId } = await request.json()
    const supabase = await createClient()

    if (!supabase.from) {
       return NextResponse.json({ error: 'Supabase client error' }, { status: 500 })
    }

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*, profiles(full_name)')
      .eq('id', invoiceId)
      .single()

    if (error || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: invoice.description || 'Service Invoice',
            },
            unit_amount: Math.round(invoice.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/portal/invoices?success=true`,
      cancel_url: `${request.headers.get('origin')}/portal/invoices?canceled=true`,
      metadata: {
        invoiceId: invoice.id,
        customerId: invoice.customer_id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
