import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email }: { email: string } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });

if (existingUser && existingUser.isVerified) {
  return NextResponse.json(
    { error: 'User already exists with this email' },
    { status: 400 }
  );
}

// Generate 6-digit OTP
    const otp: string = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt: Date = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
 const sentAt: Date = new Date();
    // Update or create user
    await User.findOneAndUpdate(
      { email },
      {
        email,
        otp: {
             code: otp, 
             expiresAt ,
             sentAt},
        isVerified: false,
      },
      { upsert: true, new: true }
    );

    // Send OTP email
    await sendOTPEmail(email, otp);

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
