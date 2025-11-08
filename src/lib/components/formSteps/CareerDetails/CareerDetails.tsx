import React from 'react'
import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import philippineCitiesAndProvinces from "../../../../../public/philippines-locations.json";

interface CareerDetailsProps {
    jobTitle: string;
    setJobTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    workSetup: string;
    setWorkSetup: (value: string) => void;
    workSetupRemarks: string;
    setWorkSetupRemarks: (value: string) => void;
    screeningSetting: string;
    setScreeningSetting: (value: string) => void;
    employmentType: string;
    setEmploymentType: (value: string) => void;
    requireVideo: boolean;
    setRequireVideo: (value: boolean) => void;
    salaryNegotiable: boolean;
    setSalaryNegotiable: (value: boolean) => void;
    minimumSalary: string | number;
    setMinimumSalary: (value: string) => void;
    maximumSalary: string | number;
    setMaximumSalary: (value: string) => void;
    country: string;
    setCountry: (value: string) => void;
    province: string;
    setProvince: (value: string) => void;
    city: string;
    setCity: (value: string) => void;
    provinceList: { key: string; name: string }[];
    setProvinceList: (list: { key: string; name: string }[]) => void;
    cityList: { name: string }[];
    setCityList: (list: { name: string }[]) => void;
    errors?: Record<string, boolean>;
    workSetupOptions: { name: string }[];
    employmentTypeOptions: { name: string }[];
}

function CareerDetails({
    jobTitle,
    setJobTitle,
    description,
    setDescription,
    workSetup,
    setWorkSetup,
    employmentType,
    setEmploymentType,
    salaryNegotiable,
    setSalaryNegotiable,
    minimumSalary,
    setMinimumSalary,
    maximumSalary,
    setMaximumSalary,
    country,
    setCountry,
    province,
    setProvince,
    city,
    setCity,
    provinceList,
    cityList,
    setCityList,
    errors,
    workSetupOptions,
    employmentTypeOptions,
}: CareerDetailsProps) {
  return (
    <div>
        <div className="layered-card-middle">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 26, marginLeft: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>1</span>
                </div>
                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Career Information</span>
            </div>
            <div className="layered-card-content">
                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Basic Information</span>
                <span>Job Title</span>
                <input
                    value={jobTitle}
                    className={`form-control ${errors.jobTitle ? "border border-danger" : ""}`}
                    placeholder="Enter job title"
                    onChange={(e) => {
                        setJobTitle(e.target.value || "");
                }}
                >
                </input>
                {errors.jobTitle && <span style={{ color: "#F04438", fontSize: 14 }}>This is a required field.</span>}
                    <div className="my-3">
                        <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Work Setting</span>
                        <div className="row mt-2">
                            <div className="col-sm">
                                <span>Employment Type</span>
                                <CustomDropdown
                                    onSelectSetting={(employmentType) => {
                                        setEmploymentType(employmentType);
                                    }}
                                    screeningSetting={employmentType}
                                    settingList={employmentTypeOptions}
                                    placeholder="Select Employment Type"
                                    error={errors.employmentType}
                                />
                                    {errors.employmentType && <span style={{ color: "#F04438", fontSize: 14 }}>This is a required field.</span>}
                            </div>
                            <div className="col-sm">
                                <span>Arrangement</span>
                                <CustomDropdown
                                    onSelectSetting={(setting) => {
                                        setWorkSetup(setting);
                                    }}
                                    screeningSetting={workSetup}
                                    settingList={workSetupOptions}
                                    placeholder="Select Work Setup"
                                    error={errors.arrangement}
                                />
                                {errors.arrangement && <span style={{ color: "#F04438", fontSize: 14 }}>This is a required field.</span>}
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Location</span>
                        <div className="row mt-2">
                            <div className="col-sm">
                                <span>Country</span>
                                <CustomDropdown
                                    onSelectSetting={(setting) => {
                                        setCountry(setting);
                                    }}
                                    screeningSetting={country}
                                    settingList={[]}
                                    placeholder="Select Country"
                                    error={errors.country}
                                />
                                {errors.country && <span style={{ color: "#F04438", fontSize: 14 }}>This is a required field.</span>}
                            </div>
                            <div className="col-sm">
                                <span>State / Province</span>
                                <CustomDropdown
                                    onSelectSetting={(province) => {
                                        setProvince(province);
                                        const provinceObj = provinceList.find((p) => p.name === province);
                                        const cities = philippineCitiesAndProvinces.cities.filter((city) => city.province === provinceObj.key);
                                        setCityList(cities);
                                        setCity(cities[0].name);
                                    }}
                                    screeningSetting={province}
                                    settingList={provinceList}
                                    placeholder="Select State / Province"
                                    error={errors.province}
                                />
                                {errors.province && <span style={{ color: "#F04438", fontSize: 14 }}>This is a required field.</span>}
                            </div>
                            <div className="col-sm">
                                <span>City</span>
                                <CustomDropdown
                                    onSelectSetting={(city) => {
                                        setCity(city);
                                    }}
                                    screeningSetting={city}
                                    settingList={cityList}
                                    placeholder="Select City"
                                    error={errors.city}
                                />
                                {errors.city && <span style={{ color: "#F04438", fontSize: 14 }}>This is a required field.</span>}
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Salary</span>

                            <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 8, minWidth: "130px" }}>
                                <label className="switch">
                                    <input type="checkbox" checked={salaryNegotiable} onChange={() => setSalaryNegotiable(!salaryNegotiable)} />
                                    <span className="slider round"></span>
                                </label>
                                <span>{salaryNegotiable ? "Negotiable" : "Fixed"}</span>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-sm">
                                <span>Minimum Salary</span>
                                <div style={{ position: "relative" }}>
                                    <span
                                        style={{
                                            position: "absolute",
                                            left: "12px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#6c757d",
                                            fontSize: "16px",
                                            pointerEvents: "none",
                                        }}
                                    >
                                        ₱
                                    </span>
                                    <input
                                        type="number"
                                        className={`form-control mt-2 ${errors.minimumSalary ? "border border-danger" : ""}`}
                                        style={{ paddingLeft: "28px" }}
                                        placeholder="0"
                                        min={0}
                                        value={minimumSalary}
                                        disabled={salaryNegotiable}
                                        onChange={(e) => {
                                            setMinimumSalary(e.target.value || "");
                                    }}
                                    />
                                    <span style={{
                                        position: "absolute",
                                        right: "30px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6c757d",
                                        fontSize: "16px",
                                        pointerEvents: "none",
                                    }}>
                                        PHP
                                    </span>
                                </div>
                                {errors.minimumSalary && <span style={{ color: "#F04438", fontSize: 14 }}>This is a required field.</span>}
                            </div>

                            <div className="col-sm">
                                <span>Maximum Salary</span>
                                <div style={{ position: "relative" }}>
                                    <span
                                    style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6c757d",
                                        fontSize: "16px",
                                        pointerEvents: "none",
                                    }}
                                    >
                                        ₱
                                    </span>
                                    <input
                                        type="number"
                                        className={`form-control mt-2 ${errors.maximumSalary || errors.salaryRange ? "border border-danger" : ""}`}
                                        style={{ paddingLeft: "28px" }}
                                        placeholder="0"
                                        min={0}
                                        value={maximumSalary}
                                        disabled={salaryNegotiable}
                                        onChange={(e) => {
                                        setMaximumSalary(e.target.value || "");
                                        }}
                                    ></input>
                                    <span style={{
                                        position: "absolute",
                                        right: "30px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6c757d",
                                        fontSize: "16px",
                                        pointerEvents: "none",
                                    }}>
                                        PHP
                                    </span>
                                </div>
                                {errors.maximumSalary && <span style={{ color: "#F04438", fontSize: 14 }}>This is a required field.</span>}
                                {errors.salaryRange && <span style={{ color: "#F04438", fontSize: 14 }}>Minimum salary cannot be greater than maximum salary.</span>}
                            </div>
                        </div>
                    </div>
            </div>
        </div>
        <div className="layered-card-middle mt-4">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 26, marginLeft: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>2</span>
                </div>
                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Job Description</span>
            </div>
            <div className="layered-card-content">
                <RichTextEditor setText={setDescription} text={description} error={errors.description} />
            </div>
        </div>
    </div>
  )
}

export default CareerDetails