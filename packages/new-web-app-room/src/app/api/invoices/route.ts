import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage (replace with real database later)
let invoices: any[] = [];

export async function GET() {
  return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
  try {
    const invoice = await request.json();
    invoices.push(invoice);
    return NextResponse.json({ success: true, invoice });
  } catch {
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedInvoice = await request.json();
    const index = invoices.findIndex(inv => inv.id === updatedInvoice.id);
    if (index !== -1) {
      invoices[index] = updatedInvoice;
      return NextResponse.json({ success: true, invoice: updatedInvoice });
    }
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    invoices = invoices.filter(inv => inv.id !== id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}

