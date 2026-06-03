import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const superAdminEmail = process.env.SUPER_ADMIN;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

    if (email === superAdminEmail && password === superAdminPassword) {
      const response = NextResponse.json(
        { success: true, message: 'Logged in successfully' },
        { status: 200 }
      );

      response.cookies.set({
        name: 'admin_token',
        value: 'authenticated',
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
