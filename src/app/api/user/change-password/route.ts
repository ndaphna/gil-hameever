import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthUser } from '@/lib/get-auth-user';
import { supabaseAdmin } from '@/lib/supabase-server';

/**
 * API endpoint to change user password
 * Requires:
 * - currentPassword: current password for verification
 * - newPassword: new password to set
 */
export async function POST(request: NextRequest) {
  try {
    // Try to get user from Authorization header first (more reliable)
    const authHeader = request.headers.get('authorization');
    let user = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      
      const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
      
      const { data: { user: tokenUser }, error: userError } = await supabaseClient.auth.getUser();
      if (!userError && tokenUser) {
        user = tokenUser;
      }
    }
    
    // Fallback to getAuthUser if no token in header
    if (!user) {
      user = await getAuthUser();
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'לא מחוברת. אנא התחברי מחדש' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'סיסמה נוכחית וסיסמה חדשה נדרשות' },
        { status: 400 }
      );
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'הסיסמה החדשה חייבת להכיל לפחות 6 תווים' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Verify current password by attempting to sign in
    const verifyClient = createClient(supabaseUrl, supabaseAnonKey);
    const { error: verifyError } = await verifyClient.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (verifyError) {
      return NextResponse.json(
        { error: 'הסיסמה הנוכחית שגויה' },
        { status: 401 }
      );
    }

    // Update password using Supabase Admin API
    // This requires service role key and bypasses the need for a session
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        password: newPassword,
      }
    );

    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        { error: updateError.message || 'שגיאה בעדכון הסיסמה' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'הסיסמה עודכנה בהצלחה',
    });

  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה פנימית' },
      { status: 500 }
    );
  }
}

