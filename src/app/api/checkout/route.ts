import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseAdmin = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function POST(req: Request) {
  try {
    const { items, userId } = await req.json();

    let orderId = "mock_order_" + Math.floor(Math.random()*1000);

    if (userId && supabaseAdmin) {
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
