import React from 'react'
import Image from 'next/image'

interface TipCardProps {
    CareerDetails: any[]
    ScreeningDetails: any[]
    step: number
}

function TipCard({ CareerDetails, ScreeningDetails, step }: TipCardProps) {
  return (
     <div className="layered-card-outer">
        <div className="layered-card-middle">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Image src="/tip.png" alt="Tips" width={18} height={18} />
                </div>
                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Tips</span>
            </div>
            <div className="layered-card-content">
                {step === 1
                ? CareerDetails.map((detail, index) => (
                    <div className="d-flex" key={index} style={{ marginBottom: 12 }}>
                        <span style={{ fontSize: 14, color: "#555B6E" }}>
                            <span style={{ fontWeight: 700 }}>{detail.header}</span> {detail.body}
                        </span>
                    </div>
                ))
                : ScreeningDetails.map((detail, index) => (
                    <div className="d-flex" key={index} style={{ marginBottom: 12 }}>
                        <span style={{ fontSize: 14, color: "#555B6E" }}>
                            <span style={{ fontWeight: 700 }}>{detail.header}</span> {detail.body}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default TipCard