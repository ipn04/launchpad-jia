import React, { useState } from 'react';
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import InterviewQuestionGeneratorV2 from '../../CareerComponents/InterviewQuestionGeneratorV2';

interface PreScreeningProps {
    screeningSettingList: { name: string }[];
    screeningSetting: string;
    setScreeningSetting: (value: string) => void;
    requireVideo: boolean;
    setRequireVideo: (value: boolean) => void;
}

function PreScreening({
    screeningSettingList,
    screeningSetting,
    setScreeningSetting,
    requireVideo,
    setRequireVideo
}: PreScreeningProps) {
  return (
    <div>
        <div className="layered-card-middle">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 26, marginLeft: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>1</span>
                </div>
                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>AI Review Settings</span>
            </div>
            <div className="layered-card-content">
                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>AI Interview Screening</span>
                <span>Jia automatically endorses candidates who meet the chosen criteria.</span>
                <div className='w-50'>
                    <CustomDropdown
                        onSelectSetting={(setting) => {
                            setScreeningSetting(setting);
                        }}
                        screeningSetting={screeningSetting}
                        settingList={screeningSettingList}
                    />
                </div>
                <div className='py-3 my-3' style={{ borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
                    <div className='py-2' style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                        <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Require Video on Interview </span>
                    </div>
                    <span>This settings allows Jia to automatically endorse candidates who meet the chosen criteria.</span>
                    <div className='py-2' style={{ display: "flex", flexDirection: "row",justifyContent: "space-between", gap: 8 }}>
                        <div style={{ display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
                            <i className="la la-video" style={{ color: "#414651", fontSize: 20 }}></i>
                            <span>Require Video Interview</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                            <label className="switch m-0">
                                <input type="checkbox" checked={requireVideo} onChange={() => setRequireVideo(!requireVideo)} />
                                <span className="slider round"></span>
                            </label>
                            <span>{requireVideo ? "Yes" : "No"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default PreScreening;