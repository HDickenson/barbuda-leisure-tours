import { NextResponse } from 'next/server'
import { getAllTours } from '@/data/tours'

export async function GET() {
  const tours = getAllTours()
  return NextResponse.json(tours)
}
