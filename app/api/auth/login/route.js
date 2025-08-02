import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Credential from '../../../../models/Credential';

export async function POST(request) {
  await dbConnect();
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ message: 'Username and password required' }, { status: 400 });
  }

  const user = await Credential.findOne({ username, password });

  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Login success', user }, { status: 200 });
}
