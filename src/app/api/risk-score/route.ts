import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')
    
    // Generate fictional risk score (random number between 0-100)
    const riskScore = Math.floor(Math.random() * 101) // 0–100
    
    return NextResponse.json({
      tenantId: tenantId || null,
      riskScore
    })
    
  } catch (error) {
    console.error('Error generating risk score:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
