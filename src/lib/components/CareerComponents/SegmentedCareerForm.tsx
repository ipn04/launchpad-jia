"use client"

import { useEffect, useRef, useState } from "react";
import InterviewQuestionGeneratorV2 from "./InterviewQuestionGeneratorV2";
import philippineCitiesAndProvinces from "../../../../public/philippines-locations.json";
import { candidateActionToast, errorToast } from "@/lib/Utils";
import { useAppContext } from "@/lib/context/AppContext";
import axios from "axios";
import CareerActionModal from "./CareerActionModal";
import FullScreenLoadingAnimation from "./FullScreenLoadingAnimation";
import TipCard from "@/lib/components/TipCard/TipCard";
import CareerDetails from "@/lib/components/formSteps/CareerDetails/CareerDetails";
import PreScreening from "@/lib/components/formSteps/ReviewPreScreening/PreScreening";

  // Setting List icons
  const screeningSettingList = [
    {
        name: "Good Fit and above",
        icon: "la la-check",
    },
    {
        name: "Only Strong Fit",
        icon: "la la-check-double",
    },
    {
        name: "No Automatic Promotion",
        icon: "la la-times",
    },
];
const workSetupOptions = [
    {
        name: "Fully Remote",
    },
    {
        name: "Onsite",
    },
    {
        name: "Hybrid",
    },
];

const employmentTypeOptions = [
    {
        name: "Full-Time",
    },
    {
        name: "Part-Time",
    },
];

export const jobTitleTips = [
  {
    header: "Use clear, standard job titles",
    body: "for better searchability (e.g., “Software Engineer” instead of “Code Ninja” or “Tech Rockstar”)."
  },
  {
    header: "Avoid abbreviations",
    body: "or internal role codes that applicants may not understand (e.g., use “QA Engineer” instead of “QE II” or “QA-TL”)."
  },
  {
    header: "Keep it Concise",
    body: "- job titles should be no more than a few words (2–4 max), avoiding fluff or marketing terms."
  }
];

export const screeningTips = [
  {
    header: "Add a Secret Prompt",
    body: "to fine-tune how Jia scores and evaluates submitted CVs."
  },
  {
    header: "Add Pre-Screening questions",
    body: "to collect key details such as notice period, work setup, or salary expectations to guide your review and candidate discussions."
  },
];

export default function SegmentedCareerForm({ career, formType, setShowEditModal }: { career?: any, formType: string, setShowEditModal?: (show: boolean) => void }) {
    const { user, orgID } = useAppContext();
    const [jobTitle, setJobTitle] = useState(career?.jobTitle || "");
    const [description, setDescription] = useState(career?.description || "");
    const [workSetup, setWorkSetup] = useState(career?.workSetup || "");
    const [workSetupRemarks, setWorkSetupRemarks] = useState(career?.workSetupRemarks || "");
    const [screeningSetting, setScreeningSetting] = useState(career?.screeningSetting || "Good Fit and above");
    const [employmentType, setEmploymentType] = useState(career?.employmentType || "");
    const [requireVideo, setRequireVideo] = useState(career?.requireVideo || true);
    const [salaryNegotiable, setSalaryNegotiable] = useState(career?.salaryNegotiable || true);
    const [minimumSalary, setMinimumSalary] = useState(career?.minimumSalary || "");
    const [maximumSalary, setMaximumSalary] = useState(career?.maximumSalary || "");
    const [questions, setQuestions] = useState(career?.questions || [
      {
        id: 1,
        category: "CV Validation / Experience",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 2,
        category: "Technical",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 3,
        category: "Behavioral",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 4,
        category: "Analytical",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 5,
        category: "Others",
        questionCountToAsk: null,
        questions: [],
      },
    ]);
    const [country, setCountry] = useState(career?.country || "Philippines");
    const [province, setProvince] = useState(career?.province ||"");
    const [city, setCity] = useState(career?.location || "");
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [showSaveModal, setShowSaveModal] = useState("");
    const [isSavingCareer, setIsSavingCareer] = useState(false);
    const savingCareerRef = useRef(false);
    const [errors, setErrors] = useState({
        jobTitle: false,
        employmentType: false,
        arrangement: false,
        country: false,
        province: false,
        city: false,
        minimumSalary: false,
        maximumSalary: false,
        description: false,
        salaryRange: false,
    });
    const [currentStep, setCurrentStep] = useState<number>(() => {
    const savedDraft = sessionStorage.getItem("careerDraft");
        if (savedDraft) {
            const draft = JSON.parse(savedDraft);
            return draft.currentStep ?? 1;
        }
        return 1;
    });
    console.log("currentStep:", currentStep);
    const isFormValid = () => {
        // return jobTitle?.trim().length > 0 && description?.trim().length > 0 && questions.some((q) => q.questions.length > 0) && workSetup?.trim().length > 0;
        return jobTitle?.trim().length > 0 && description?.trim().length > 0 && workSetup?.trim().length > 0;
    }

    const updateCareer = async (status: string) => {
        if (Number(minimumSalary) && Number(maximumSalary) && Number(minimumSalary) > Number(maximumSalary)) {
            errorToast("Minimum salary cannot be greater than maximum salary", 1300);
            return;
        }
        let userInfoSlice = {
            image: user.image,
            name: user.name,
            email: user.email,
        };
        const updatedCareer = {
            _id: career._id,
            jobTitle,
            description,
            workSetup,
            workSetupRemarks,
            questions,
            lastEditedBy: userInfoSlice,
            status,
            updatedAt: Date.now(),
            screeningSetting,
            requireVideo,
            salaryNegotiable,
            minimumSalary: isNaN(Number(minimumSalary)) ? null : Number(minimumSalary),
            maximumSalary: isNaN(Number(maximumSalary)) ? null : Number(maximumSalary),
            country,
            province,
            // Backwards compatibility
            location: city,
            employmentType,
        }
        try {
            setIsSavingCareer(true);
            const response = await axios.post("/api/update-career", updatedCareer);
            if (response.status === 200) {
                candidateActionToast(
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>Career updated</span>
                    </div>,
                    1300,
                <i className="la la-check-circle" style={{ color: "#039855", fontSize: 32 }}></i>)
                setTimeout(() => {
                    window.location.href = `/recruiter-dashboard/careers/manage/${career._id}`;
                }, 1300);
            }
        } catch (error) {
            console.error(error);
            errorToast("Failed to update career", 1300);
        } finally {
            setIsSavingCareer(false);
        }
    }


    const confirmSaveCareer = (status: string) => {
        if (Number(minimumSalary) && Number(maximumSalary) && Number(minimumSalary) > Number(maximumSalary)) {
        errorToast("Minimum salary cannot be greater than maximum salary", 1300);
        return;
        }

        setShowSaveModal(status);
    }

    const validateBasicInfo = () => {
        const newErrors = {
            jobTitle: !jobTitle?.trim(),
            employmentType: !employmentType?.trim(),
            arrangement: !workSetup?.trim(),
            country: !country?.trim(),
            province: !province?.trim(),
            city: !city?.trim(),
            minimumSalary: !String(minimumSalary || "").trim(),
            maximumSalary: !String(maximumSalary || "").trim(),
            description: !description?.trim(),
            salaryRange: false,
        }

         if (
            minimumSalary &&
            maximumSalary &&
            Number(minimumSalary) > Number(maximumSalary)
        ) {
            newErrors.salaryRange = true;
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((e) => e === true);
    }

    const saveCareer = async (status: string) => {
        setShowSaveModal("");
        if (!status) {
          return;
        }

        if (!savingCareerRef.current) {
        setIsSavingCareer(true);
        savingCareerRef.current = true;
        let userInfoSlice = {
            image: user.image,
            name: user.name,
            email: user.email,
        };
        const career = {
            jobTitle,
            description,
            workSetup,
            workSetupRemarks,
            questions,
            lastEditedBy: userInfoSlice,
            createdBy: userInfoSlice,
            screeningSetting,
            orgID,
            requireVideo,
            salaryNegotiable,
            minimumSalary: isNaN(Number(minimumSalary)) ? null : Number(minimumSalary),
            maximumSalary: isNaN(Number(maximumSalary)) ? null : Number(maximumSalary),
            country,
            province,
            // Backwards compatibility
            location: city,
            status,
            employmentType,
        }

        try {

            const response = await axios.post("/api/add-career", career);
            if (response.status === 200) {
            candidateActionToast(
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>Career added {status === "active" ? "and published" : ""}</span>
                </div>,
                1300,
            <i className="la la-check-circle" style={{ color: "#039855", fontSize: 32 }}></i>)
            setTimeout(() => {
                window.location.href = `/recruiter-dashboard/careers`;
            }, 1300);
            }
        } catch (error) {
            errorToast("Failed to add career", 1300);
        } finally {
            savingCareerRef.current = false;
            setIsSavingCareer(false);
        }
      }
    }

    useEffect(() => {
        const savedDraft = sessionStorage.getItem("careerDraft");
        if (savedDraft) {
            const draft = JSON.parse(savedDraft);
            setJobTitle(draft.jobTitle || "");
            setDescription(draft.description || "");
            setWorkSetup(draft.workSetup || "");
            setWorkSetupRemarks(draft.workSetupRemarks || "");
            setQuestions(draft.questions || []);
            setScreeningSetting(draft.screeningSetting || "Good Fit and above");
            setRequireVideo(draft.requireVideo ?? true);
            setSalaryNegotiable(draft.salaryNegotiable ?? true);
            setMinimumSalary(draft.minimumSalary ?? "");
            setMaximumSalary(draft.maximumSalary ?? "");
            setCountry(draft.country || "Philippines");
            setProvince(draft.province || "");
            setCity(draft.location || "");
            setEmploymentType(draft.employmentType || "");
        }
    }, []);

    const saveDraft = async (step: number) => {
        setIsSavingCareer(true);

        const nextStep = step + 1;

        const careerDraft = {
            jobTitle,
            description,
            workSetup,
            workSetupRemarks,
            questions,
            lastEditedBy: { image: user.image, name: user.name, email: user.email },
            createdBy: { image: user.image, name: user.name, email: user.email },
            screeningSetting,
            orgID,
            requireVideo,
            salaryNegotiable,
            minimumSalary: isNaN(Number(minimumSalary)) ? null : Number(minimumSalary),
            maximumSalary: isNaN(Number(maximumSalary)) ? null : Number(maximumSalary),
            country,
            province,
            location: city,
            employmentType,
            currentStep: nextStep,
        };

        try {
            sessionStorage.setItem("careerDraft", JSON.stringify(careerDraft));
            console.log("Draft saved to sessionStorage:", careerDraft);

            setCurrentStep(step + 1);
        } catch (error) {
            errorToast("Failed to save draft", 1300);
        } finally {
            setIsSavingCareer(false);
        }
    };

    useEffect(() => {
        const parseProvinces = () => {
          setProvinceList(philippineCitiesAndProvinces.provinces);
          const defaultProvince = philippineCitiesAndProvinces.provinces[0];
          if (!career?.province) {
            setProvince(defaultProvince.name);
          }
          const cities = philippineCitiesAndProvinces.cities.filter((city) => city.province === defaultProvince.key);
          setCityList(cities);
          if (!career?.location) {
            setCity(cities[0].name);
          }
        }
        parseProvinces();
      },[career])

    return (
        <div className="col">
        {formType === "add" ? (<div style={{ marginBottom: "35px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>Add new career</h1>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                  <button
                    disabled={!isFormValid() || isSavingCareer}
                    style={{ width: "fit-content", color: "#414651", background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: "60px", cursor: !isFormValid() || isSavingCareer ? "not-allowed" : "pointer", whiteSpace: "nowrap" }} onClick={() => {
                        confirmSaveCareer("inactive");
                    }}>
                    Save as Unpublished
                  </button>
                  {/* <button
                    disabled={isSavingCareer}
                    style={{ width: "fit-content", background: isSavingCareer ? "#D5D7DA" : "black", color: "#fff", border: "1px solid #E9EAEB", padding: "8px 16px", borderRadius: "60px", cursor: !isFormValid() || isSavingCareer ? "not-allowed" : "pointer", whiteSpace: "nowrap"}} onClick={() => {
                        confirmSaveCareer("active");
                    }}>
                    <i className="la la-check-circle" style={{ color: "#fff", fontSize: 20, marginRight: 8 }}></i>
                    Save & Continue
                  </button> */}
                   <button
                    disabled={isSavingCareer}
                    style={{ width: "fit-content", background: isSavingCareer ? "#D5D7DA" : "black", color: "#fff", border: "1px solid #E9EAEB", padding: "8px 16px", borderRadius: "60px", cursor: "pointer", whiteSpace: "nowrap"}}
                        onClick={async () => {
                            if (!validateBasicInfo()) return;
                            await saveDraft(currentStep);
                        }}
                    >
                    <i className="la la-check-circle" style={{ color: "#fff", fontSize: 20, marginRight: 8 }}></i>
                    Save & Continue
                  </button>
                </div>
        </div>) : (
            <div style={{ marginBottom: "35px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>Edit Career Details</h1>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <button
                 style={{ width: "fit-content", color: "#414651", background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: "60px", cursor: "pointer", whiteSpace: "nowrap" }} onClick={() => {
                  setShowEditModal?.(false);
                    }}>
                        Cancel
                </button>
                <button
                  disabled={!isFormValid() || isSavingCareer}
                   style={{ width: "fit-content", color: "#414651", background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: "60px", cursor: !isFormValid() || isSavingCareer ? "not-allowed" : "pointer", whiteSpace: "nowrap" }} onClick={() => {
                    updateCareer("inactive");
                    }}>
                          Save Changes as Unpublished
                  </button>
                  <button
                  disabled={!isFormValid() || isSavingCareer}
                  style={{ width: "fit-content", background: !isFormValid() || isSavingCareer ? "#D5D7DA" : "black", color: "#fff", border: "1px solid #E9EAEB", padding: "8px 16px", borderRadius: "60px", cursor: !isFormValid() || isSavingCareer ? "not-allowed" : "pointer", whiteSpace: "nowrap"}} onClick={() => {
                    updateCareer("active");
                  }}>
                    <i className="la la-check-circle" style={{ color: "#fff", fontSize: 20, marginRight: 8 }}></i>
                      Save Changes as Published
                  </button>
              </div>
       </div>
        )}
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 16, alignItems: "flex-start", marginTop: 16 }}>
        <div style={{ width: "60%", display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="layered-card-outer">
            {currentStep === 1 && (
                <CareerDetails
                    jobTitle={jobTitle}
                    setJobTitle={setJobTitle}
                    description={description}
                    setDescription={setDescription}
                    workSetup={workSetup}
                    setWorkSetup={setWorkSetup}
                    workSetupRemarks={workSetupRemarks}
                    setWorkSetupRemarks={setWorkSetupRemarks}
                    screeningSetting={screeningSetting}
                    setScreeningSetting={setScreeningSetting}
                    employmentType={employmentType}
                    setEmploymentType={setEmploymentType}
                    requireVideo={requireVideo}
                    setRequireVideo={setRequireVideo}
                    salaryNegotiable={salaryNegotiable}
                    setSalaryNegotiable={setSalaryNegotiable}
                    minimumSalary={minimumSalary}
                    setMinimumSalary={setMinimumSalary}
                    maximumSalary={maximumSalary}
                    setMaximumSalary={setMaximumSalary}
                    country={country}
                    setCountry={setCountry}
                    province={province}
                    setProvince={setProvince}
                    provinceList={provinceList}
                    setProvinceList={setProvinceList}
                    city={city}
                    setCity={setCity}
                    cityList={cityList}
                    setCityList={setCityList}
                    errors={errors}
                    workSetupOptions={workSetupOptions}
                    employmentTypeOptions={employmentTypeOptions}
                />
            )}

            {currentStep === 2 && (
                <PreScreening
                    screeningSettingList={screeningSettingList}
                    screeningSetting={screeningSetting}
                    setScreeningSetting={setScreeningSetting}
                />
            )}
          </div>
          {/* <InterviewQuestionGeneratorV2 questions={questions} setQuestions={(questions) => setQuestions(questions)} jobTitle={jobTitle} description={description} /> */}
        </div>
        <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: 8 }}>
            <TipCard CareerDetails={jobTitleTips} ScreeningDetails={screeningTips} step={currentStep} />
        </div>
        </div>
        {showSaveModal && (
            <CareerActionModal action={showSaveModal} onAction={(action) => saveCareer(action)} />
        )}
    {isSavingCareer && (
        <FullScreenLoadingAnimation title={formType === "add" ? "Saving career..." : "Updating career..."} subtext={`Please wait while we are ${formType === "add" ? "saving" : "updating"} the career`} />
    )}
    </div>
    )
}