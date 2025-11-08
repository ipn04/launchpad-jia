import React, { useState } from 'react';
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import InterviewQuestionGeneratorV2 from '../../CareerComponents/InterviewQuestionGeneratorV2';

interface PreScreeningProps {
    screeningSettingList: { name: string }[];
    screeningSetting: string;
    setScreeningSetting: (value: string) => void;
}

function PreScreening({
    screeningSettingList,
    screeningSetting,
    setScreeningSetting,
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
            </div>
        </div>
    </div>
  );
}

export default PreScreening;