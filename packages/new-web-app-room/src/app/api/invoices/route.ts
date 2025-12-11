import { NextRequest, NextResponse } from 'next/server';

// GET all invoices
export async function GET() {
  try {
    const storage = await getCloudflareStorage();
    const invoices = await storage.list({ prefix: 'invoice:' });
    
    const allInvoices = await Promise.all(
      invoices.keys.map(async (key) => {
        const data = await storage.get(key.name);
        return data ? JSON.parse(data) : null;
      })
    );
    
    return NextResponse.json(allInvoices.filter(Boolean));
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

// POST create new invoice
export async function POST(request: NextRequest) {
  try {
    const invoice = await request.json();
    const storage = await getCloudflareStorage();
    
    await storage.put(`invoice:${invoice.id}`, JSON.stringify(invoice));
    
    // Update client pattern
    await updateClientPattern(storage, invoice);
    
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

// Helper function to get Cloudflare storage
async function getCloudflareStorage() {
  // @ts-ignore - Cloudflare Workers KV
  return globalThis.INVOICE_STORAGE;
}

// Helper function to update client payment patterns
async function updateClientPattern(storage: any, invoice: any) {
  const clientKey = `client:${invoice.clientName}`;
  const existingData = await storage.get(clientKey);
  
  let clientData = existingData ? JSON.parse(existingData) : {
    name: invoice.clientName,
    totalInvoices: 0,
    averageDaysToPayment: 0,
    paymentReliability: 100,
    invoices: []
  };
  
  clientData.totalInvoices += 1;
  clientData.invoices.push(invoice.id);
  
  await storage.put(clientKey, JSON.stringify(clientData));
}

