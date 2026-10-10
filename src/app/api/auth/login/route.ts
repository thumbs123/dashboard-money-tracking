import { NextRequest, NextResponse } from 'next/server';
import { verifyTelegramUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const telegramId = String(body.telegramId || '').trim();

    if (!telegramId) {
      return NextResponse.json(
        { ok: false, error: 'Telegram ID wajib diisi.' },
        { status: 400 }
      );
    }

    const user = await verifyTelegramUser(telegramId);

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: `Telegram ID "${telegramId}" belum terdaftar di database. Silakan kirim pesan ke bot Telegram terlebih dahulu agar akun dibuatkan otomatis.`,
        },
        { status: 404 }
      );
    }

    const response = NextResponse.json({ ok: true, user });

    // Set cookie for session persistence (30 days)
    response.cookies.set('finassist_telegram_id', user.telegramId, {
      httpOnly: false, // accessible to client for greeting display
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Terjadi kesalahan sistem saat verifikasi login.' },
      { status: 500 }
    );
  }
}
