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
import ProgressTracker from "./ProgressTracker";
import Interview from "../formSteps/Interview/Interview";
import CustomDropdown from "./CustomDropdown";
import Accordion from "./Accordion";

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

export const interviewTips = [
  {
    header: "Add a Secret Prompt",
    body: "to fine-tune how Jia scores and evaluates submitted CVs."
  },
  {
    header: "Use “Generate Questions”",
    body: "to quickly create tailored interview questions, then refine or mix them with your own for balanced results."
  },
];

export default function SegmentedCareerForm({ career, formType, setShowEditModal, draftId }: { career?: any, formType: string, setShowEditModal?: (show: boolean) => void, draftId?: string | null }) {
    const { user, orgID } = useAppContext();
    const [jobTitle, setJobTitle] = useState(career?.jobTitle || "");
    const [description, setDescription] = useState(career?.description || "");
    console.log("draftId:", draftId);
    const [workSetup, setWorkSetup] = useState(career?.workSetup || "");
    const [workSetupRemarks, setWorkSetupRemarks] = useState(career?.workSetupRemarks || "");
    const [screeningSetting, setScreeningSetting] = useState(career?.screeningSetting || "Good Fit and above");
    const [employmentType, setEmploymentType] = useState(career?.employmentType || "");
    const [requireVideo, setRequireVideo] = useState(career?.requireVideo || true);
    const [salaryNegotiable, setSalaryNegotiable] = useState(career?.salaryNegotiable || true);
    const [minimumSalary, setMinimumSalary] = useState(career?.minimumSalary || "");
    const [maximumSalary, setMaximumSalary] = useState(career?.maximumSalary || "");
    const [isEditing, setIsEditing] = useState(false);
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
        questions: false,
    });
    const [preScreeningQuestions, setPreScreeningQuestions] = useState<any[]>(
        career?.preScreeningQuestions || []
    );

    const [currentStep, setCurrentStep] = useState<number>(1);
    const [maxCompletedStep, setMaxCompletedStep] = useState<number>(career?.currentStep || 1);

    useEffect(() => {
        if (career) {
            setJobTitle(career.jobTitle || "");
            setDescription(career.description || "");
            setWorkSetup(career.workSetup || "");
            setWorkSetupRemarks(career.workSetupRemarks || "");
            setScreeningSetting(career.screeningSetting || "Good Fit and above");
            setEmploymentType(career.employmentType || "");
            setRequireVideo(career.requireVideo ?? true);
            setSalaryNegotiable(career.salaryNegotiable ?? true);
            setMinimumSalary(career.minimumSalary ?? "");
            setMaximumSalary(career.maximumSalary ?? "");
            setQuestions(career.questions || [
                { id: 1, category: "CV Validation / Experience", questionCountToAsk: null, questions: [] },
                { id: 2, category: "Technical", questionCountToAsk: null, questions: [] },
                { id: 3, category: "Behavioral", questionCountToAsk: null, questions: [] },
                { id: 4, category: "Analytical", questionCountToAsk: null, questions: [] },
                { id: 5, category: "Others", questionCountToAsk: null, questions: [] },
            ]);
            setPreScreeningQuestions(career.preScreeningQuestions || []);
            setCurrentStep(career.currentStep ?? 1);
            setMaxCompletedStep(career.currentStep ?? 1);
        }
    }, [career]);

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

    const validateStep = (step: number) => {
        const newErrors = { ...errors };

        if (step === 1) {
            newErrors.jobTitle = !jobTitle?.trim();
            newErrors.employmentType = !employmentType?.trim();
            newErrors.arrangement = !workSetup?.trim();
            newErrors.country = !country?.trim();
            newErrors.province = !province?.trim();
            newErrors.city = !city?.trim();
            newErrors.minimumSalary = !salaryNegotiable && !String(minimumSalary || "").trim();
            newErrors.maximumSalary = !salaryNegotiable && !String(maximumSalary || "").trim();
            newErrors.description = !description?.trim();
            newErrors.salaryRange =
                !salaryNegotiable &&
                minimumSalary &&
                maximumSalary &&
                Number(minimumSalary) > Number(maximumSalary);
        }

        if (step === 3) {
            const totalQuestions = questions.reduce((acc, q) => acc + (q.questions?.length || 0), 0);
            newErrors.questions = totalQuestions < 5;
        }

        setErrors(newErrors);

        // Return true if no errors for this step
        return !Object.entries(newErrors)
            .filter(([key]) => (step === 1 ? key !== "questions" : key === "questions"))
            .some(([_, value]) => value === true);
    };

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
            preScreeningQuestions,
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

            const response = await axios.post("/api/add-career", {
                ...career,
                draftId: draftId || null,
            });
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

    const saveDraft = async (step: number) => {
        setIsSavingCareer(true);

        const careerDraft = {
            draftId,
            jobTitle,
            description,
            workSetup,
            workSetupRemarks,
            questions,
            preScreeningQuestions,
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
            currentStep: step + 1,
        };

        try {
            const response = await axios.post("/api/save-career-draft", careerDraft);
            if (response.status === 200) {
                setCurrentStep(step + 1);
                setMaxCompletedStep(Math.max(maxCompletedStep, step + 1));
            }
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
        <div className="career-parent col">
        {formType === "add" ? (
            <div>
                <div className="add-new-career-top-container" style={{ marginBottom: "35px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>Add new career</h1>
                    <div className="btn-grp" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
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
                        disabled={isSavingCareer || (currentStep < 4 && currentStep < maxCompletedStep)}
                        style={{
                            width: "fit-content",
                            background: isSavingCareer || (currentStep < 4 && currentStep < maxCompletedStep) ? "#D5D7DA" : "black",
                            color: "#fff",
                            border: "1px solid #E9EAEB",
                            padding: "8px 16px",
                            borderRadius: "60px",
                            cursor: isSavingCareer || (currentStep < 4 && currentStep < maxCompletedStep) ? "not-allowed" : "pointer",
                            whiteSpace: "nowrap",
                        }}
                        onClick={async () => {
                            if (!validateStep(currentStep)) return;

                            if (currentStep === 4) {
                                confirmSaveCareer("active");
                            } else {
                                await saveDraft(currentStep);
                            }
                        }}
                        >
                        <i
                            className="la la-check-circle"
                            style={{ color: "#fff", fontSize: 20, marginRight: 8 }}
                        ></i>
                        {currentStep === 4 ? "Publish" : "Save & Continue"}
                    </button>
                    </div>
                </div>
                <div className="progress-tracker">
                    <ProgressTracker
                        currentStep={currentStep}
                        maxStep={maxCompletedStep}
                        onStepClick={(stepId) => {
                            if (stepId <= maxCompletedStep) {
                                setCurrentStep(stepId);
                            }
                        }}
                    />
                </div>
            </div>
            ) : (
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
        <div
            className="career-components-container"
            style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 16, alignItems: "flex-start", marginTop: 16 }}>
        <div
            className="career-info"
            style={{
                width: currentStep === 4 ? "100%" : "60%",
                display: "flex",
                flexDirection: "column",
                gap: 8,
            }}
        >
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
                    preScreeningQuestions={preScreeningQuestions}
                    setPreScreeningQuestions={setPreScreeningQuestions}
                />
            )}

            {currentStep === 3 && (
                <div>
                    <Interview
                        screeningSettingList={screeningSettingList}
                        screeningSetting={screeningSetting}
                        setScreeningSetting={setScreeningSetting}
                        requireVideo={requireVideo}
                        setRequireVideo={setRequireVideo}
                    />
                    <InterviewQuestionGeneratorV2 questions={questions} setQuestions={(questions) => setQuestions(questions)} jobTitle={jobTitle} description={description} error={errors.questions} />
                </div>
            )}

            {currentStep === 4 && (
                <>
                 <Accordion
                    title="Career Details & Team Access"
                    onEdit={() => setIsEditing((prev) => !prev)}
                    >
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, backgroundColor: "#FFFFFF", padding: 16, borderRadius: 20 }}>
                        <div className="p-2">
                            <div className="d-flex flex-column pb-3" style={{ borderBottom: "1px solid #E9EAEB" }}>
                                <span style={{ fontWeight: 700, fontSize: 14, paddingBottom: 4 }}>Job Title</span>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    readOnly={!isEditing}
                                    className="form-control"
                                    style={{
                                        background: 'none',
                                        border: `${isEditing ? '1px solid #D5D7DA' : 'none'}`,
                                        paddingLeft: `${isEditing ? '12px' : 0}`,
                                        paddingRight: 0,
                                    }}
                                />
                            </div>

                            <div className="row mr-0 ml-0 py-3" style={{ borderBottom: "1px solid #E9EAEB", gap: 16 }}>
                                <div className="d-flex flex-column col-sm px-0">
                                <span style={{ fontWeight: 700, fontSize: 14, paddingBottom: 4 }}>Employment Type</span>
                                <input
                                    type="text"
                                    value={employmentType}
                                    onChange={(e) => setEmploymentType(e.target.value)}
                                    readOnly={!isEditing}
                                    className="form-control"
                                    style={{
                                        background: 'none',
                                        border: `${isEditing ? '1px solid #D5D7DA' : 'none'}`,
                                        paddingLeft: `${isEditing ? '12px' : 0}`,
                                        paddingRight: 0,
                                    }}
                                />
                                </div>
                                <div className="d-flex flex-column col-sm px-0">
                                <span style={{ fontWeight: 700, fontSize: 14, paddingBottom: 4 }}>Work Arrangement</span>
                                <input
                                    type="text"
                                    value={workSetup}
                                    onChange={(e) => setWorkSetup(e.target.value)}
                                    readOnly={!isEditing}
                                    className="form-control"
                                    style={{
                                        background: 'none',
                                        border: `${isEditing ? '1px solid #D5D7DA' : 'none'}`,
                                        paddingLeft: `${isEditing ? '12px' : 0}`,
                                        paddingRight: 0,
                                    }}
                                />
                                </div>
                                <div className="d-flex flex-column col-sm px-0" />
                            </div>

                            <div className="row mr-0 ml-0 py-3" style={{ borderBottom: "1px solid #E9EAEB", gap: 16 }}>
                                <div className="d-flex flex-column col-sm px-0">
                                <span style={{ fontWeight: 700, fontSize: 14, paddingBottom: 4 }}>Country</span>
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    readOnly={!isEditing}
                                    className="form-control"
                                    style={{
                                        background: 'none',
                                        border: `${isEditing ? '1px solid #D5D7DA' : 'none'}`,
                                        paddingLeft: `${isEditing ? '12px' : 0}`,
                                        paddingRight: 0,
                                    }}
                                />
                                </div>
                                <div className="d-flex flex-column col-sm px-0">
                                <span style={{ fontWeight: 700, fontSize: 14, paddingBottom: 4 }}>Province</span>
                                <input
                                    type="text"
                                    value={province}
                                    onChange={(e) => setProvince(e.target.value)}
                                    readOnly={!isEditing}
                                    className="form-control"
                                    style={{
                                        background: 'none',
                                        border: `${isEditing ? '1px solid #D5D7DA' : 'none'}`,
                                        paddingLeft: `${isEditing ? '12px' : 0}`,
                                        paddingRight: 0,
                                    }}
                                />
                                </div>
                                <div className="d-flex flex-column col-sm px-0">
                                <span style={{ fontWeight: 700, fontSize: 14, paddingBottom: 4 }}>City</span>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    readOnly={!isEditing}
                                    className="form-control"
                                    style={{
                                        background: 'none',
                                        border: `${isEditing ? '1px solid #D5D7DA' : 'none'}`,
                                        paddingLeft: `${isEditing ? '12px' : 0}`,
                                        paddingRight: 0,
                                    }}
                                />
                                </div>
                            </div>


                            <div className="row mr-0 ml-0 py-3"  style={{borderBottom: "1px solid #E9EAEB"}}>
                                <div className="d-flex flex-column col-sm px-0">
                                    <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 4}}>
                                        Minimum Salary
                                    </span>
                                    <span style={{fontWeight: 500, fontSize: 14, paddingBottom: 4}}>
                                        {salaryNegotiable ? "Negotiable" : minimumSalary || "0"}
                                    </span>
                                </div>
                                <div className="d-flex flex-column col-sm px-0">
                                    <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 4}}>
                                        Maximum Salary
                                    </span>
                                    <span style={{fontWeight: 500, fontSize: 14, paddingBottom: 4}}>
                                        {salaryNegotiable ? "Negotiable" : maximumSalary || "0"}
                                    </span>
                                </div>
                                <div className="d-flex flex-column col-sm px-0"/>
                            </div>
                        </div>

                        <div className="px-2">
                            <span style={{ fontWeight: 700, fontSize: 14, paddingBottom: 4 }}>Job Description</span>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                readOnly={!isEditing}
                                className="form-control"
                                rows={4}
                                style={{
                                    background: 'none',
                                    border: `${isEditing ? '1px solid #D5D7DA' : 'none'}`,
                                    paddingLeft: `${isEditing ? '12px' : 0}`,
                                    paddingRight: 0,
                                }}
                            />
                        </div>
                    </div>
                </Accordion>

                <Accordion
                    title="CV Review & Pre-Screening Questions"
                    onEdit={() => alert('Edit CV Review')}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, backgroundColor: "#FFFFFF", padding: 16, borderRadius: 20 }}>
                        <div className="p-2" >
                            <div className="d-flex flex-column">
                                <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 6}}>
                                    CV Screening
                                </span>
                                <span style={{fontWeight: 500, fontSize: 16, paddingBottom: 6}}>
                                    Automatically endorse candidates who are Good Fit and above
                                </span>
                                <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 6}}>
                                    Pre-Screening Questions {preScreeningQuestions && preScreeningQuestions.length > 0 ? `(${preScreeningQuestions.length})` : ""}
                                </span>
                            </div>
                            {preScreeningQuestions && preScreeningQuestions.length > 0 ? (
                                <ul className="space-y-2 list-unstyled">
                                    {preScreeningQuestions.map((q, index) => (
                                    <li
                                        key={index}
                                        className="py-1 flex flex-col gap-1"
                                    >
                                        <span className="font-semibold text-gray-800" style={{fontSize: 16, fontWeight: 500}}>
                                            {index + 1}. {q.question || "Untitled question"}
                                        </span>
                                        {q.type === "dropdown" && q.options && q.options.length > 0 ? (
                                            <div className="ml-4">
                                                <ul className="list-disc pl-3 text-gray-700 text-sm"
                                                     style={{
                                                        fontSize: 15,
                                                        fontWeight: 500,
                                                        listStyleType: "disc",
                                                        listStylePosition: "outside"
                                                    }}
                                                >
                                                    {q.options.map((option: string, idx: number) => (
                                                        <li className="py-1" key={idx}>{option}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            ) : (
                                            <p className="ml-4 text-gray-400 text-sm italic">
                                                No options added.
                                            </p>
                                        )}
                                    </li>
                                    ))}
                                </ul>
                                ) : (
                                <p className="text-gray-500 text-sm italic">
                                    No pre-screening questions added yet.
                                </p>
                            )}
                        </div>
                    </div>
                </Accordion>
                <Accordion
                    title="AI Interview Setup"
                    onEdit={() => alert('AI Interview Setup')}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, backgroundColor: "#FFFFFF", padding: 16, borderRadius: 20 }}>
                        <div className="p-2" >
                             <div className="d-flex flex-column">
                                <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 6}}>
                                    AI Interview Screening
                                </span>
                                <span style={{fontWeight: 500, fontSize: 16, paddingBottom: 6}}>
                                    Automatically endorse candidates who are Good Fit and above
                                </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center py-3 my-3" style={{borderBottom: "1px solid #E9EAEB", borderTop: "1px solid #E9EAEB"}}>
                                <span style={{fontWeight: 700, fontSize: 14}}>
                                    Require Video on Interview
                                </span>
                                <span style={{fontWeight: 500, fontSize: 16}}>
                                    {requireVideo ? "Yes" : "No"}
                                </span>
                            </div>
                            <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 6}}>
                                AI Interview Screening {questions && questions.length > 0 ? `(${questions.reduce((acc, q) => acc + (q.questions?.length || 0), 0)})` : ""}
                            </span>
                            {questions && questions.length > 0 ? (
                                questions.map((category) => (
                                <div
                                    key={category.id}
                                    style={{
                                        borderRadius: 12,
                                        margin: "8px 0",
                                    }}
                                >
                                    <h4
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 700,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {category.category}
                                    </h4>

                                    {category.questions && category.questions.length > 0 ? (
                                    <ol style={{ paddingLeft: 16, margin: 0 }}>
                                        {category.questions.map((q, i) => (
                                        <li
                                            key={q.id || i}
                                            style={{
                                            fontSize: 16,
                                            color: "#414651",
                                            marginBottom: 4,
                                            fontWeight: 500,
                                            marginLeft: 18,
                                            }}
                                        >
                                            {q.question}
                                        </li>
                                        ))}
                                    </ol>
                                    ) : (
                                    <p style={{ fontSize: 14, fontWeight: 500, color: "#9E9E9E" }}>
                                        No questions added for this category.
                                    </p>
                                    )}
                                </div>
                                ))
                            ) : (
                                <p style={{ fontSize: 16, fontWeight: 500, color: "#9E9E9E" }}>
                                    No interview questions available.
                                </p>
                            )}
                        </div>
                    </div>
                </Accordion>
                </>
            )}
          </div>
          {/* <InterviewQuestionGeneratorV2 questions={questions} setQuestions={(questions) => setQuestions(questions)} jobTitle={jobTitle} description={description} /> */}
        </div>
        {currentStep <= 3 && (
            <div
                className="career-info"
                style={{ width: "40%", display: "flex", flexDirection: "column", gap: 8 }}
            >
                <TipCard
                    CareerDetails={jobTitleTips}
                    ScreeningDetails={screeningTips}
                    interviewTips={interviewTips}
                    step={currentStep}
                />
            </div>
        )}
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