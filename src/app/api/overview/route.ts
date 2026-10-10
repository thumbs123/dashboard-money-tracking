import { NextRequest, NextResponse } from 'next/server';
import { fetchDashboardData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month') || undefined;

    // Check query param first, then cookie
    const cookieTelegramId = request.cookies.get('finassist_telegram_id')?.value;
    const telegramId = (searchParams.get('telegramId') || cookieTelegramId || '').trim();

    if (!telegramId) {
      return NextResponse.json(
        { error: 'Unauthorized. Harap login terlebih dahulu dengan Telegram ID.' },
        { status: 401 }
      );
    }

    const data = await fetchDashboardData(month, telegramId);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil data overview', details: (error as Error).message },
      { status: 500 }
    );
  }
}
