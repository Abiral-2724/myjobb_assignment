import { sendOTPEmail } from "@/lib/email";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email }: { email: string } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json(
          { error: 'Cannot resend OTP. User does not exist.' },
          { status: 400 }
        );
      }

    if (user && user.isVerified) {
      return NextResponse.json(
        { error: 'User already exists and is already verified' },
        { status: 400 }
      );
    }

    if (!user.otp || !user.otp.code) {
        return NextResponse.json(
          { error: 'Cannot resend OTP. No OTP was previously generated for this user.' },
          { status: 400 }
        );
      }


    // Check if last OTP was sent less than 60 seconds ago (rate limiting)
    if (user.otp && user.otp.sentAt) {
        const timeSinceLastOTP = Date.now() - user.otp.sentAt.getTime();
        const rateLimitDuration = 60 * 1000; // 60 seconds in milliseconds
        
        if (timeSinceLastOTP < rateLimitDuration) {
          const timeLeft = Math.ceil((rateLimitDuration - timeSinceLastOTP) / 1000);
          return NextResponse.json({
            error: `Please wait ${timeLeft} seconds before requesting a new OTP`
          }, { status: 429 });
        }
      }

    // Generate OTP
    const otp: string = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt: Date = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    const sentAt: Date = new Date();
    // Upsert user with new OTP
    await User.findOneAndUpdate(
      { email },
      {
        email,
        otp: { code: otp, expiresAt ,sentAt},
        isVerified: false,
      },
      { upsert: true, new: true }
    );

    // Send OTP email
    await sendOTPEmail(email, otp);

    return NextResponse.json({ message: 'OTP resent successfully' });

  } catch (error) {
    console.error('Error resending OTP:', error);
    return NextResponse.json({ error: 'Failed to resend OTP' }, { status: 500 });
  }
}
