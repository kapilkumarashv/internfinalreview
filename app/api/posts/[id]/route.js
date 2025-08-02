// app/api/posts/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Post from '../../../../models/Post';

// ✅ GET: Fetch a post by ID
export async function GET(_, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching post', error: error.message }, { status: 500 });
  }
}

// ✅ PUT: Update blog post by ID
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const body = await request.json();
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl,
      },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating post', error: error.message }, { status: 500 });
  }
}

// ✅ DELETE: Delete blog post by ID
export async function DELETE(_, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting post', error: error.message }, { status: 500 });
  }
}
