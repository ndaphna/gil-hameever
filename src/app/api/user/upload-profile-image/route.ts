import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/get-auth-user';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Log headers for debugging
    const authHeader = request.headers.get('authorization');
    console.log('📋 Upload request - Authorization header:', authHeader ? 'Present' : 'Missing');
    
    const user = await getAuthUser();

    if (!user) {
      console.error('❌ Upload failed - No authenticated user');
      return NextResponse.json(
        { error: 'Unauthorized - Please log in again' },
        { status: 401 }
      );
    }
    
    console.log('✅ Upload request - User authenticated:', user.id);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Use file directly as Blob (Supabase Storage accepts Blob)
    // No need to convert to Buffer - the File object is already a Blob
    const fileData = file;

    // Generate unique filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    console.log('📤 Uploading file:', { fileName, fileSize: file.size, fileType: file.type });

    // Check if bucket exists, create if it doesn't
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();
    let bucketExists = false;
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
    } else {
      bucketExists = buckets?.some(b => b.name === 'profile-images') || false;
      console.log('📦 Bucket exists:', bucketExists);
    }
    
    // If bucket doesn't exist, try to create it
    if (!bucketExists) {
      console.log('📦 Creating profile-images bucket...');
      const { data: createData, error: createError } = await supabaseAdmin.storage.createBucket('profile-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      });
      
      if (createError) {
        console.error('❌ Error creating bucket:', createError);
        // If creation fails, return helpful error message
        return NextResponse.json(
          { 
            error: 'Storage bucket not found', 
            details: 'The profile-images bucket does not exist and could not be created automatically.',
            instructions: 'Please create it manually: 1. Go to Supabase Dashboard → Storage\n2. Click "New bucket"\n3. Name: profile-images\n4. Set as Public bucket\n5. See guides/SETUP_PROFILE_IMAGES.md for full instructions'
          },
          { status: 500 }
        );
      }
      
      console.log('✅ Bucket created successfully:', createData);
      
      // After creating the bucket, we need to set up RLS policies
      // Note: RLS policies need to be set up via SQL, but we'll log a message
      console.log('⚠️ Note: RLS policies need to be set up. See guides/SETUP_PROFILE_IMAGES.md for the SQL policies.');
    }

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('profile-images')
      .upload(fileName, fileData, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      console.error('Upload error details:', JSON.stringify(uploadError, null, 2));
      return NextResponse.json(
        { error: 'Failed to upload image', details: uploadError.message || 'Unknown error' },
        { status: 500 }
      );
    }

    console.log('✅ File uploaded successfully:', uploadData);

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // Update user profile with image URL
    const { error: updateError } = await supabaseAdmin
      .from('user_profile')
      .update({ profile_image_url: imageUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('Update error:', updateError);
      // Try to delete uploaded file if update fails
      await supabaseAdmin.storage
        .from('profile-images')
        .remove([fileName]);
      
      return NextResponse.json(
        { error: 'Failed to update profile', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Profile image uploaded successfully'
    });

  } catch (error: any) {
    console.error('❌ Upload profile image error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Delete profile image
export async function DELETE() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current profile image URL
    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('profile_image_url')
      .eq('id', user.id)
      .single();

    if (profile?.profile_image_url) {
      // Extract file path from URL
      const urlParts = profile.profile_image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user.id}/${fileName}`;

      // Delete from storage
      await supabaseAdmin.storage
        .from('profile-images')
        .remove([filePath]);
    }

    // Update profile to remove image URL
    const { error } = await supabaseAdmin
      .from('user_profile')
      .update({ profile_image_url: null })
      .eq('id', user.id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete image', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile image deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete profile image error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

