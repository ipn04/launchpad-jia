import React, { useState } from 'react';
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";

interface PreScreeningProps {
    screeningSettingList: { name: string }[];
    screeningSetting: string;
    setScreeningSetting: (value: string) => void;
    preScreeningQuestions: any[];
    setPreScreeningQuestions: (value: any[]) => void;
}

function PreScreening({
    screeningSettingList,
    screeningSetting,
    setScreeningSetting,
    preScreeningQuestions,
    setPreScreeningQuestions,
}: PreScreeningProps) {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const suggestedQuestions = [
    {
      id: 'notice-period',
      title: 'Notice Period',
      question: 'How long is your notice period?',
      type: 'dropdown',
      options: ['Immediately', '< 30 days', '> 30 days']
    },
    {
      id: 'work-setup',
      title: 'Work Setup',
      question: 'How often are you willing to report to the office?',
      type: 'dropdown',
      options: ['At least 1-2x a week', 'At least 3-4x a week', 'Open to fully onsite work', 'Only open to fully remote work']
    },
    {
      id: 'salary',
      title: 'Asking Salary',
      question: 'How much is your expected monthly salary?',
      type: 'range',
      min: 40000,
      max: 60000,
      currency: '₱'
    }
  ];

  const questionTypes = [
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'checkboxes', label: 'Checkboxes' },
    { value: 'range', label: 'Range' }
  ];

  const addSuggestedQuestion = (suggested: any) => {
    const newQuestion = {
      id: Date.now(),
      title: suggested.title,
      question: suggested.question,
      type: suggested.type,
      options: suggested.options || [],
      min: suggested.min,
      max: suggested.max,
      currency: suggested.currency,
      isEditing: false
    };
    setPreScreeningQuestions([...preScreeningQuestions, newQuestion]);
  };

  const addCustomQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      title: '',
      question: '',
      type: 'dropdown',
      options: ['Option 1'],
      isEditing: true
    };
    setPreScreeningQuestions([...preScreeningQuestions, newQuestion]);
  };

  const deleteQuestion = (id: number) => {
    setPreScreeningQuestions(preScreeningQuestions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: number, field: string, value: any) => {
    setPreScreeningQuestions(preScreeningQuestions.map(q => {
        if (q.id === id) {
        let updated = { ...q, [field]: value };

        if (q.type === 'range') {
            if (field === 'min' && value > q.max) {
            updated.min = q.max;
            }
            if (field === 'max' && value < q.min) {
            updated.max = q.min;
            }
        }

        return updated;
        }
        return q;
    }));
    };


  const addOption = (id: number) => {
    setPreScreeningQuestions(preScreeningQuestions.map(q => {
      if (q.id === id) {
        return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
      }
      return q;
    }));
  };

  const deleteOption = (questionId: number, optionIndex: number) => {
    setPreScreeningQuestions(preScreeningQuestions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: q.options.filter((_: any, i: number) => i !== optionIndex) };
      }
      return q;
    }));
  };

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    setPreScreeningQuestions(preScreeningQuestions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  return (
    <div>
        <div className="layered-card-middle">
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 26, marginLeft: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>1</span>
                </div>
                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>CV Review Settings</span>
            </div>
            <div className="layered-card-content">
                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>CV Screening</span>
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

        <div className="layered-card-middle" style={{ marginTop: '1rem' }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 26, marginLeft: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>2</span>
                </div>
                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Pre-Screening Questions</span>
                <span style={{fontSize: 12, color: "#6B7280"}}>(optional)</span>
                <span style={{
                    marginLeft: '8px',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    color: '#4B5563'
                }}>
                    {preScreeningQuestions.length}
                </span>
                <button
                    onClick={addCustomQuestion}
                    style={{
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 16px',
                        backgroundColor: '#1F2937',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: 14,
                        fontWeight: 500,
                        border: 'none',
                        cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#111827'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1F2937'}
                >
                    <i className="la la-plus" style={{ fontSize: 16 }}></i>
                    Add custom
                </button>
            </div>

            <div className="layered-card-content">
                {preScreeningQuestions.length === 0 ? (
                    <span>No pre-screening questions added yet.</span>
                ) : (
                    <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                        {preScreeningQuestions.map((q, index) => (
                            <div className='mb-4' key={q.id} style={{
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, borderBottom: '1px solid #E5E7EB', paddingBottom: 12 }}>
                                    <div style={{ flex: 1 }}>
                                        <div className='d-flex justify-content-between align-items-center' style={{ background: "#F8F9FC", padding: 16 }}>
                                            <input
                                                type="text"
                                                value={q.question}
                                                onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                                                placeholder="Your question..."
                                                style={{
                                                    width: '100%',
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    padding: '4px 0px',
                                                    borderBottom: '1px solid transparent',
                                                    border: 'none',
                                                    outline: 'none',
                                                    background: 'transparent',
                                                }}
                                                onMouseOut={(e) => {
                                                    if (document.activeElement !== e.currentTarget) {
                                                        e.currentTarget.style.borderBottom = '1px solid transparent';
                                                    }
                                                }}
                                                onBlur={(e) => e.currentTarget.style.borderBottom = '1px solid transparent'}
                                            />
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #D1D5DB', borderRadius: 6, padding: '4px 8px', backgroundColor: 'white', cursor: 'pointer' }}>
                                                <i className="la la-angle-down" style={{ fontSize: 12, color: '#717680', border: "1px solid #717680", padding: 1, borderRadius: 12 }}></i>
                                                <select
                                                    value={q.type}
                                                    onChange={(e) => updateQuestion(q.id, 'type', e.target.value)}
                                                    style={{
                                                        fontSize: 14,
                                                        border: 'none',
                                                        padding: '4px 8px',
                                                        color: 'none',
                                                        outline: 'none',
                                                        backgroundColor: 'transparent',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {questionTypes.map(type => (
                                                        <option key={type.value} value={type.value}>{type.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {q.type === 'dropdown' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
                                                {q.options.map((option: string, optIndex: number) => (
                                                    <div key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <div className='flex' style={{border: "1px solid #E5E7EB", borderRadius: 4, padding: '4px 8px', flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <span style={{ color: '#9CA3AF', fontSize: 14, width: 18, textAlign: 'center' }}>{optIndex + 1}</span>
                                                            <input
                                                                type="text"
                                                                value={option}
                                                                onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                                                                style={{
                                                                    flex: 1,
                                                                    fontSize: 14,
                                                                    padding: '4px 8px',
                                                                    border: 'none',
                                                                    outline: 'none',
                                                                    fontWeight: 500
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    if (document.activeElement !== e.currentTarget) {
                                                                        e.currentTarget.style.borderBottom = '1px solid transparent';
                                                                    }
                                                                }}
                                                                onBlur={(e) => e.currentTarget.style.borderBottom = '1px solid transparent'}
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => deleteOption(q.id, optIndex)}
                                                            style={{
                                                                color: '#9CA3AF',
                                                                backgroundColor: 'transparent',
                                                                border: '1px solid #E5E7EB',
                                                                borderRadius: '18px',
                                                                cursor: 'pointer',
                                                                padding: 4,
                                                                width: 26,
                                                                height: 26,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.color = '#EF4444'}
                                                            onMouseOut={(e) => e.currentTarget.style.color = '#9CA3AF'}
                                                        >
                                                            <i className="la la-times" style={{ fontSize: 16 }}></i>
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => addOption(q.id)}
                                                    style={{
                                                        fontSize: 14,
                                                        color: '#4B5563',
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 4,
                                                        padding: '8px',
                                                        fontWeight: 700
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                                                    onMouseOut={(e) => e.currentTarget.style.color = '#4B5563'}
                                                >
                                                    <i className="la la-plus" style={{ fontSize: 14 }}></i>
                                                    Add Option
                                                </button>
                                            </div>
                                        )}

                                        {q.type === 'range' && (
                                            <div className='salary-input' style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #D1D5DB', padding: '4px 8px', borderRadius: 8 }}>
                                                    <span style={{ fontSize: 14, color: '#4B5563' }}>{q.currency}</span>
                                                    <input
                                                        type="number"
                                                        value={q.min}
                                                        onChange={(e) => updateQuestion(q.id, 'min', parseInt(e.target.value))}
                                                        style={{
                                                            fontSize: 14,
                                                            padding: '4px 8px',
                                                            border: 'none',
                                                            borderRadius: '4px'
                                                        }}
                                                    />
                                                    PHP
                                                    <i className="la la-angle-down" style={{ fontSize: 16, color: '#9CA3AF' }}></i>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #D1D5DB', padding: '4px 8px', borderRadius: 8 }}>
                                                    <span style={{ fontSize: 14, color: '#4B5563' }}>{q.currency}</span>
                                                    <input
                                                        type="number"
                                                        value={q.max}
                                                        onChange={(e) => updateQuestion(q.id, 'max', parseInt(e.target.value))}
                                                        style={{
                                                            fontSize: 14,
                                                            padding: '4px 8px',
                                                            border: 'none',
                                                            borderRadius: '4px'
                                                        }}
                                                    />
                                                    PHP
                                                    <i className="la la-angle-down" style={{ fontSize: 16, color: '#9CA3AF' }}></i>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='mt-4 mb-4 d-flex justify-content-end' style={{ padding: '0 16px' }}>
                                    <button
                                        onClick={() => deleteQuestion(q.id)}
                                        style={{
                                            fontSize: 14,
                                            color: '#B32318',
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: '1px solid #B32318',
                                            gap: 4,
                                            padding: '8px 16px',
                                            borderRadius: 18,
                                            fontWeight: 700
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.color = '#DC2626'}
                                        onMouseOut={(e) => e.currentTarget.style.color = '#EF4444'}
                                    >
                                        <i className="la la-trash" style={{ fontSize: 18 }}></i>
                                        Delete Question
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showSuggestions && (
                    <>
                        <div className='mt-3 mb-2' style={{borderTop: '1px solid #E5E7EB'}}>
                            <p className='mt-4' style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>
                                Suggested Pre-screening Questions:
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {suggestedQuestions.map((suggested) => {
                                const isAdded = preScreeningQuestions.some(q => q.title === suggested.title);

                                return (
                                    <div
                                        key={suggested.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: "12px 0",
                                            opacity: isAdded ? 0.3 : 1,
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                        >
                                        <div>
                                            <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
                                            {suggested.title}
                                            </h4>
                                            <p style={{ fontSize: 14, fontWeight: 500, color: '#6B7280', margin: 0 }}>
                                            {suggested.question}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => !isAdded && addSuggestedQuestion(suggested)}
                                            style={{
                                            padding: '4px 10px',
                                            fontSize: 14,
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '26px',
                                            backgroundColor: isAdded ? '#ffffffff' : 'white',
                                            cursor: isAdded ? 'not-allowed' : 'pointer',
                                            color: isAdded ? '#6B7280' : 'black',
                                            fontWeight: 500
                                            }}
                                            disabled={isAdded}
                                            onMouseOver={(e) => {
                                            if (!isAdded) e.currentTarget.style.backgroundColor = '#F3F4F6';
                                            }}
                                            onMouseOut={(e) => {
                                            if (!isAdded) e.currentTarget.style.backgroundColor = 'white';
                                            }}
                                        >
                                            {isAdded ? 'Added' : 'Add'}
                                        </button>
                                    </div>
                                );
                                })}
                            </div>
                        </div>
                    </>
                    )}
            </div>
        </div>
    </div>
  );
}

export default PreScreening;