import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Email to receive notifications
const NOTIFY_EMAIL = process.env.WAITLIST_NOTIFY_EMAIL || 'coreyrab@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Add to Convex waitlist
    const result = await convex.mutation(api.waitlist.join, {
      email,
      source: source || 'coming-soon',
    });

    // Send notification email (using a simple fetch to an email service)
    // You can replace this with SendGrid, Resend, or any email service
    if (!result.alreadyExists) {
      try {
        // Send notification via Resend if API key exists
        if (process.env.RESEND_API_KEY) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'StaticKit <notifications@statickit.com>',
              to: NOTIFY_EMAIL,
              subject: '🎉 New StaticKit Waitlist Signup!',
              html: `
                <h2>New Waitlist Signup</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Source:</strong> ${source || 'coming-soon'}</p>
                <p><strong>Time:</strong> ${new Date().toISOString()}</p>
              `,
            }),
          });
        } else {
          // Log to console if no email service configured
          console.log('📧 NEW WAITLIST SIGNUP:', email);
        }
      } catch (emailError) {
        // Don't fail the signup if notification fails
        console.error('Failed to send notification:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: result.alreadyExists
        ? "You're already on the list!"
        : "You're on the list!",
    });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}
