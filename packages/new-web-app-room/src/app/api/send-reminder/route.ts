import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, body: emailBody, invoiceId, amount, clientName } = body;

    // Log the email details (in production, this would actually send via email service)
    console.log('📧 Sending reminder email:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', emailBody);
    console.log('Invoice ID:', invoiceId);
    console.log('Amount:', amount);
    console.log('Client:', clientName);

    // TODO: Integrate with actual email service (Resend, SendGrid, etc.)
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'invoices@yourdomain.com',
    //   to: to,
    //   subject: subject,
    //   text: emailBody,
    // });

    // For now, simulate successful email send
    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully (demo mode - check console for details)' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

