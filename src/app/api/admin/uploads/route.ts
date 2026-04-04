import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
} from '@/lib/admin-auth';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: '관리자 인증이 필요합니다.' }, { status: 401 });
  }

  const expectedSession = await createAdminSessionValue();

  if (sessionCookie !== expectedSession) {
    return NextResponse.json({ error: '관리자 인증이 필요합니다.' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: '업로드할 파일이 없습니다.' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: '이미지 파일만 업로드할 수 있습니다.' }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: '이미지는 10MB 이하만 업로드할 수 있습니다.' }, { status: 400 });
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'post-images';
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'png';
  const safeExt = ext?.toLowerCase() || 'png';
  const filePath = `posts/${Date.now()}-${crypto.randomUUID()}.${safeExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const supabase = createAdminSupabase();
    const { error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : '이미지 업로드 중 문제가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
