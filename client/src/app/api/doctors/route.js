import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET - получить всех врачей
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    return Response.json(data || []);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST - создать нового врача
export async function POST(request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('doctors')
      .insert([body])
      .select();

    if (error) throw error;

    return Response.json(data[0], { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// PUT - обновить врача
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const { data, error } = await supabase
      .from('doctors')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;

    return Response.json(data[0]);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - удалить врача
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
