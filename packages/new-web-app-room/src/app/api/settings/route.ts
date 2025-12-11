import { NextRequest, NextResponse } from 'next/server';

// GET settings
export async function GET() {
  try {
    const storage = await getCloudflareStorage();
    const data = await storage.get('settings');
    
    if (!data) {
      // Return default settings
      return NextResponse.json({
        userEmail: '',
        userName: '',
        businessName: '',
        timezone: 'UTC',
        businessHours: { start: '09:00', end: '17:00' },
        respectWeekends: true,
        respectHolidays: true,
        apiKey: ''
      });
    }
    
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST update settings
export async function POST(request: NextRequest) {
  try {
    const settings = await request.json();
    const storage = await getCloudflareStorage();
    
    await storage.put('settings', JSON.stringify(settings));
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

// Helper function to get Cloudflare storage
async function getCloudflareStorage() {
  // @ts-ignore - Cloudflare Workers KV
  return globalThis.INVOICE_STORAGE;
}

