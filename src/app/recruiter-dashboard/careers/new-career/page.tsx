"use client";

import React, { useEffect, useState } from "react";
import HeaderBar from "@/lib/PageComponent/HeaderBar";
import SegmentedCareerForm from "@/lib/components/CareerComponents/SegmentedCareerForm";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import '@/lib/styles/career.scss';

export default function NewCareerPage() {
  const searchParams = useSearchParams();

  const draftId = searchParams.get("draftId");
  const orgID = searchParams.get("orgID");

  const [draftCareer, setDraftCareer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  console.log("Draft ID:", draftId);

  useEffect(() => {
    if (draftId) {
      const fetchDraft = async () => {
        try {
          const res = await axios.get("/api/get-draft", {
            params: { draftId, orgID },
          });
          setDraftCareer(res.data.draft);
        } catch (err) {
          console.error("Error fetching draft:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDraft();
    } else {
      setLoading(false);
    }
  }, [draftId, orgID]);

  return (
    <>
      <HeaderBar
        activeLink="Careers"
        currentPage={draftId ? "Edit Draft Career" : "Add New Career"}
        icon="la la-suitcase"
      />
      <div className="container-fluid mt-lg--7 mt-md-0" style={{ paddingTop: "6rem" }}>
        <div className="row mr-sm-0 mr-md-0 ml-sm-0 ml-md-0">
          <SegmentedCareerForm career={draftCareer} formType="add" draftId={draftId} />
        </div>
      </div>
    </>
  );
}
