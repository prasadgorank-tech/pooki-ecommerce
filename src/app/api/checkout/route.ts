import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Or better, a service root key on InsForge
);

export async function POST(req: Request) {
  try {
    const { items, userId } = await req.json();

    let orderId = "mock_order_" + Math.floor(Math.random()*1000);

    if (userId) {
      const orderTotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      const { data, error } = await supabaseAdmin.from('orders').insert({
        user_id: userId,
        status: 'PENDING',
        total: orderTotal,
      }).select().single();
      
      if (data) {
        orderId = data.id;
      }
    }

    return NextResponse.json({ url: `/payment/${orderId}` });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
