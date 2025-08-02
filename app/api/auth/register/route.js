import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Credential from '../../../../models/Credential';

export async function POST(request) {
  await dbConnect();
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ message: 'Username and password required' }, { status: 400 });
  }

  const existing = await Credential.findOne({ username });
  if (existing) {
    return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
  }

  const newUser = await Credential.create({ username, password });

  return NextResponse.json({ message: 'Registered successfully', user: newUser }, { status: 201 });
}
