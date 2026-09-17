import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import { signToken } from '@/lib/auth';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    let sessionPayload = null;

    // ── 1. Check DB users first ──────────────────────────────────────────
    try {
      await connectDB();
      const user = await User.findOne({ email: email.toLowerCase(), status: 'Active' }).select('+password').populate('outletId', 'name slug');
      
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
          );
        }

        // Update lastActive
        await User.findByIdAndUpdate(user._id, { lastActive: new Date() });

        sessionPayload = {
          userId: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          outletId: user.outletId?._id?.toString() || null,
          outletName: user.outletId?.name || null,
          outletSlug: user.outletId?.slug || null,
        };
      }
    } catch (dbErr) {
      console.error('DB lookup error during login:', dbErr);
      // Fall through to env check
    }

    // ── 2. Fall back to env Super Admin ─────────────────────────────────
    if (!sessionPayload) {
      const superAdminEmail = process.env.SUPER_ADMIN;
      const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

      if (email === superAdminEmail && password === superAdminPassword) {
        sessionPayload = {
          userId: 'env-super-admin',
          name: 'Super Admin',
          email: superAdminEmail,
          role: 'SUPER_ADMIN',
          outletId: null,
          outletName: null,
          outletSlug: null,
        };
      }
    }

    // ── 3. No match ──────────────────────────────────────────────────────
    if (!sessionPayload) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // ── 4. Sign JWT and set cookie ───────────────────────────────────────
    const token = signToken(sessionPayload);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        user: {
          name: sessionPayload.name,
          email: sessionPayload.email,
          role: sessionPayload.role,
          outletName: sessionPayload.outletName,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
