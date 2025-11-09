"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import InterviewQuestionGeneratorV2 from "./InterviewQuestionGeneratorV2";
import { useAppContext } from "../../context/AppContext";
import DirectInterviewLinkV2 from "./DirectInterviewLinkV2";
import CareerForm from "./CareerForm";
import CareerLink from "./CareerLink";
import Accordion from "./Accordion";

export default function JobDescription({ formData, setFormData, editModal, isEditing, setIsEditing, handleCancelEdit }: { formData: any, setFormData: (formData: any) => void, editModal: boolean, isEditing: boolean, setIsEditing: (isEditing: boolean) => void, handleCancelEdit: () => void }) {
    const { user } = useAppContext();
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (editModal) {
            setShowEditModal(true);
        }
    }, [editModal]);

    const handleEdit = () => {
        setShowEditModal(true);
    }

    async function updateCareer() {
      const userInfoSlice = {
        image: user.image,
        name: user.name,
        email: user.email,
      };
        const input = {
            _id: formData._id,
            jobTitle: formData.jobTitle,
            updatedAt: Date.now(),
            questions: formData.questions,
            status: formData.status,
            screeningSetting: formData.screeningSetting,
            requireVideo: formData.requireVideo,
            description: formData.description,
            lastEditedBy: userInfoSlice,
            createdBy: userInfoSlice,
        };

        Swal.fire({
            title: "Updating career...",
            text: "Please wait while we update the career...",
            allowOutsideClick: false,
        });

        try {
            const response = await axios.post("/api/update-career", input);

            if (response.status === 200) {
                Swal.fire({
                    title: "Success",
                    text: "Career updated successfully",
                    icon: "success",
                    allowOutsideClick: false,
                }).then(() => {
                   setIsEditing(false);
                   window.location.reload();
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Failed to update career",
                icon: "error",
                allowOutsideClick: false,
            });
        }
    }

    async function deleteCareer() {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Deleting career...",
              text: "Please wait while we delete the career...",
              allowOutsideClick: false,
              showConfirmButton: false,
              willOpen: () => {
                Swal.showLoading();
              },
            });

            try {
              const response = await axios.post("/api/delete-career", {
                id: formData._id,
              });

              if (response.data.success) {
                Swal.fire({
                  title: "Deleted!",
                  text: "The career has been deleted.",
                  icon: "success",
                  allowOutsideClick: false,
                }).then(() => {
                  window.location.href = "/recruiter-dashboard/careers";
                });
              } else {
                Swal.fire({
                  title: "Error!",
                  text: response.data.error || "Failed to delete the career",
                  icon: "error",
                });
              }
            } catch (error) {
              console.error("Error deleting career:", error);
              Swal.fire({
                title: "Error!",
                text: "An error occurred while deleting the career",
                icon: "error",
              });
            }
          }
        });
      }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16 }}>
          {/* <button style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: "60px", cursor: "pointer", whiteSpace: "nowrap" }} onClick={handleEdit}>
              <i className="la la-edit" style={{ marginRight: 8 }}></i>
              Edit details
          </button> */}
            <div className="thread-set">
                <div className="left-thread">
                    <Accordion
                        title="Career Details & Team Access"
                        onEdit={() => alert('Edit Career Details')}
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, backgroundColor: "#FFFFFF", padding: 16, borderRadius: 20 }}>
                            <div className="p-2">
                                <div className="d-flex flex-column pb-3"  style={{borderBottom: "1px solid #E9EAEB"}}>
                                    <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 4}}>
                                        Job Title
                                    </span>
                                    <span style={{fontWeight: 500, fontSize: 14, paddingBottom: 4}}>
                                        {formData.jobTitle}
                                    </span>
                                </div>
                                <div className="row mr-0 ml-0 py-3"  style={{borderBottom: "1px solid #E9EAEB"}}>
                                    <div className="d-flex flex-column col-sm px-0">
                                        <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 4}}>
                                            Employment Type
                                        </span>
                                        <span style={{fontWeight: 500, fontSize: 14, paddingBottom: 4}}>
                                            {formData.employmentType}
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column col-sm px-0">
                                        <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 4}}>
                                            Work Arrangement
                                        </span>
                                        <span style={{fontWeight: 500, fontSize: 14, paddingBottom: 4}}>
                                            {formData.workSetup}
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column col-sm px-0"/>
                                </div>
                                <div className="row mr-0 ml-0 py-3"  style={{borderBottom: "1px solid #E9EAEB"}}>
                                    <div className="d-flex flex-column col-sm px-0">
                                        <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 4}}>
                                            Country
                                        </span>
                                        <span style={{fontWeight: 500, fontSize: 14, paddingBottom: 4}}>
                                            {formData.country}
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column col-sm px-0">
                                        <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 4}}>
                                            Province
                                        </span>
                                        <span style={{fontWeight: 500, fontSize: 14, paddingBottom: 4}}>
                                            {formData.province}
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column col-sm px-0">
                                        <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 4}}>
                                            City
                                        </span>
                                        <span style={{fontWeight: 500, fontSize: 14, paddingBottom: 4}}>
                                            {formData.city}
                                        </span>
                                    </div>
                                </div>
                                <div className="row mr-0 ml-0 py-3"  style={{borderBottom: "1px solid #E9EAEB"}}>
                                    <div className="d-flex flex-column col-sm px-0">
                                        <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 4}}>
                                            Minimum Salary
                                        </span>
                                        <span style={{fontWeight: 500, fontSize: 14, paddingBottom: 4}}>
                                            {formData.minimumSalary}
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column col-sm px-0">
                                        <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 4}}>
                                            Maximum Salary
                                        </span>
                                        <span style={{fontWeight: 500, fontSize: 14, paddingBottom: 4}}>
                                            {formData.maximumSalary}
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column col-sm px-0"/>
                                </div>
                            </div>
                            <div className="px-2">
                                <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 4}}>
                                    Job Description
                                </span>
                                <p className="my-2" style={{fontWeight: 700, fontSize: 14}}>
                                    {formData.description}
                                </p>
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
                                        Pre-Screening Questions {formData.preScreeningQuestions && formData.preScreeningQuestions.length > 0 ? `(${formData.preScreeningQuestions.length})` : ""}
                                    </span>
                                </div>
                                {formData.preScreeningQuestions && formData.preScreeningQuestions.length > 0 ? (
                                    <ul className="space-y-2 list-unstyled">
                                        {formData.preScreeningQuestions.map((q, index) => (
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
                                        {formData.requireVideo ? "Yes" : "No"}
                                    </span>
                                </div>
                                <span style={{fontWeight: 700, fontSize: 14, paddingBottom: 6}}>
                                    AI Interview Screening {formData.questions && formData.questions.length > 0 ? `(${formData.questions.reduce((acc, q) => acc + (q.questions?.length || 0), 0)})` : ""}
                                </span>
                                {formData.questions && formData.questions.length > 0 ? (
                                    formData.questions.map((category) => (
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
                    {/* {!isEditing ?
                    <div className="layered-card-outer">
                        <div className="layered-card-middle">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%", gap: 8 }}>
                          <div style={{ width: 32, height: 32, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, background: "#181D27", borderRadius: "60px" }}>
                          <i className="la la-comment-alt" style={{ fontSize: 20, color: "#FFFFFF"}} />
                          </div>
                          <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>
                            Interview Questions
                          </span>
                          <div style={{ borderRadius: "50%", width: 30, height: 22, border: "1px solid #D5D9EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, backgroundColor: "#F8F9FC", color: "#181D27", fontWeight: 700 }}>
                            {formData.questions.reduce((acc, group) => acc + group.questions.length, 0)}
                          </div>
                        </div>

                    <div className="layered-card-content">
                        {formData.questions?.length > 0 && formData.questions?.map((questionGroup: any, index: number) => (
                            <div key={index}>
                                <h4>{questionGroup.category}</h4>
                                {questionGroup?.questions?.length > 0 && questionGroup?.questions?.map((question: any, index: number) => (
                                    <ul key={index}>
                                        <li>{question.question}</li>
                                    </ul>
                                ))}
                            </div>
                        ))}
                    </div>
                    </div>
                    </div> : <InterviewQuestionGeneratorV2 questions={formData.questions} setQuestions={(questions) => setFormData({ ...formData, questions: questions })} jobTitle={formData.jobTitle} description={formData.description} />} */}
                </div>
                <div className="right-thread">
                    <CareerLink career={formData} />
                    {/* Card for direct interview link */}
                    <DirectInterviewLinkV2 formData={formData} setFormData={setFormData} />
                    {isEditing &&
                    <div style={{ display: "flex", justifyContent: "center", gap: 16, alignItems: "center", marginBottom: "16px", width: "100%" }}>
                         <button className="button-primary" style={{ width: "50%" }} onClick={handleCancelEdit}>Cancel</button>
                        <button className="button-primary" style={{ width: "50%" }} onClick={updateCareer}>Save Changes</button>
                    </div>}
                    <div className="layered-card-outer">
                      <div className="layered-card-middle">
                      <div className="px-2" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%", gap: 8 }}>
                        <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>Advanced Settings</span>
                      </div>

                      <div className="layered-card-content">
                        <button
                        onClick={() => {
                          deleteCareer();
                        }}
                        style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,backgroundColor: "#FFFFFF", color: "#B32318", borderRadius: "60px", padding: "5px 10px", border: "1px solid #B32318", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
                                <i className="la la-trash" style={{ color: "#B32318", fontSize: 16 }}></i>
                                <span>Delete this career</span>
                        </button>
                        <span style={{ fontSize: "14px", color: "#717680", textAlign: "center" }}>Be careful, this action cannot be undone.</span>
                    </div>
                  </div>
                </div>
                </div>
            </div>
            {showEditModal && (
                <div
                className="modal show fade-in-bottom"
                style={{
                  display: "block",
                  background: "rgba(0,0,0,0.45)",
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  zIndex: 1050,
                }}
                >
                    <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        width: "100vw",
                    }}>

                    <div className="modal-content" style={{ overflowY: "scroll", height: "100vh", width: "90vw", background: "#fff", border: `1.5px solid #E9EAEB`, borderRadius: 14, boxShadow: "0 8px 32px rgba(30,32,60,0.18)", padding: "24px" }}>
                      <CareerForm career={formData} formType="edit" setShowEditModal={setShowEditModal} />
                    </div>
                  </div>
                </div>
            )}
        </div>
    )
}

function ScreeningSettingButton(props) {
    const { onSelectSetting, screeningSetting } = props;
    const [dropdownOpen, setDropdownOpen] = useState(false);
     // Setting List icons
    const settingList = [
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
    return (
        <div className="dropdown w-100">
        <button
          className="dropdown-btn fade-in-bottom"
          style={{ width: "100%" }}
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
        >
          <span>
            <i
              className={
                settingList.find(
                  (setting) => setting.name === screeningSetting
                )?.icon
              }
            ></i>{" "}
            {screeningSetting}
          </span>
          <i className="la la-angle-down ml-10"></i>
        </button>
        <div
          className={`dropdown-menu w-100 mt-1 org-dropdown-anim${
            dropdownOpen ? " show" : ""
          }`}
          style={{
            padding: "10px",
          }}
        >
          {settingList.map((setting, index) => (
            <div style={{ borderBottom: "1px solid #ddd" }} key={index}>
              <button
                className={`dropdown-item d-flex align-items-center${
                  screeningSetting === setting.name
                    ? " bg-primary text-white active-org"
                    : ""
                }`}
                style={{
                  minWidth: 220,
                  borderRadius: screeningSetting === setting.name ? 0 : 10,
                  overflow: "hidden",
                  paddingBottom: 10,
                  paddingTop: 10,
                }}
                onClick={() => {
                  onSelectSetting(setting.name);
                  setDropdownOpen(false);
                }}
              >
                <i className={setting.icon}></i> {setting.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    )
}