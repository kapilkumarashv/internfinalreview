// app/api/posts/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';

export async function GET() {
  await dbConnect();
  try {
    const allPosts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(allPosts);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching posts', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();

    // ✅ Debug log: check what's being received
    console.log('POST BODY:', body);

    const { title, content, imageUrl } = body;

    if (!title || !content || !imageUrl) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newPost = await Post.create({
      title,
      content,
      imageUrl,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating post', error: error.message }, { status: 400 });
  }
}
