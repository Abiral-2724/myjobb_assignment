import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { sendConfirmationEmail } from '@/lib/email';

// Ensure environment variable is properly typed
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: NextRequest) {
  try {
    const { email, otp }: { email: string; otp: string } = await request.json();

    if (!email || typeof email !== 'string' || !otp || typeof otp !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user || !user.otp || user.otp.code !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (user.otp.expiresAt < new Date()) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }

    // Mark user as verified and remove OTP
    await User.findOneAndUpdate(
      { email },
      {
        isVerified: true,
        $unset: { otp: 1 },
      }
    );

    await sendConfirmationEmail(email);

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({ message: 'Verification successful' });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
