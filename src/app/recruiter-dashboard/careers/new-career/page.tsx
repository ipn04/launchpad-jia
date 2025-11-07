"use client";

import React from "react";
import HeaderBar from "@/lib/PageComponent/HeaderBar";
import SegmentedCareerForm from "@/lib/components/CareerComponents/SegmentedCareerForm";
// import CareerForm from "@/lib/components/CareerComponents/CareerForm";

export default function NewCareerPage() {
    return (
        <>
        <HeaderBar activeLink="Careers" currentPage="Add new career" icon="la la-suitcase" />
        <div className="container-fluid mt--7" style={{ paddingTop: "6rem" }}>
          <div className="row">
            {/* <CareerForm formType="add" /> */}
            <SegmentedCareerForm formType="add" />
          </div>
        </div>
      </>
    )
}
