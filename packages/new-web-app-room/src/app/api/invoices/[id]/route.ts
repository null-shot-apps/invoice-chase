import { NextRequest, NextResponse } from 'next/server';

// GET single invoice
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storage = await getCloudflareStorage();
    const data = await storage.get(`invoice:${params.id}`);
    
    if (!data) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

// PUT update invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await request.json();
    const storage = await getCloudflareStorage();
    
    await storage.put(`invoice:${params.id}`, JSON.stringify(invoice));
    
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

// DELETE invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storage = await getCloudflareStorage();
    await storage.delete(`invoice:${params.id}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}

// Helper function to get Cloudflare storage
async function getCloudflareStorage() {
  // @ts-expect-error - Cloudflare Workers KV
  return globalThis.INVOICE_STORAGE;
}

