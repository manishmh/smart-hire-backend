import { FieldType } from "@prisma/client"

export const DefaultSections = {
    create: [
        {
            title: "Careers Profile",
            order: 1,
            fields: {
                create: [
                    {
                        label: "Resume",
                        order: 1,
                        fieldType: FieldType.file,
                        required: true
                    },
                    {
                        label: "Full Name",
                        order: 2,
                        fieldType: FieldType.text,
                        required: true,
                        placeholder: "Enter your full name"
                    },
                    {
                        label: "Email",
                        order: 3,
                        fieldType: FieldType.email,
                        required: true,
                        subField: {
                            create: [
                                {
                                    label: "Primary Email Address",
                                    type: FieldType.email,
                                    required: true,
                                    order: 1,
                                    placeholder: "Enter your primary email"
                                },
                                {
                                    label: "Secondary Email Address",
                                    type: FieldType.email,
                                    required: false,
                                    order: 2,
                                    placeholder: "Enter your secondary email"
                                }
                            ]
                        }
                    },
                    {
                        label: "Phone Number",
                        order: 4,
                        fieldType: FieldType.text,
                        required: true,
                        placeholder: "Enter your phone number"
                    },
                    {
                        label: "Address",
                        order: 5,
                        fieldType: FieldType.text,
                        required: true,
                        subField: {
                            create: [
                                {
                                    label: "Street Address",
                                    type: FieldType.text,
                                    order: 1,
                                    required: false,
                                    placeholder: "Enter your street address"
                                },
                                {
                                    label: "City",
                                    type: FieldType.text,
                                    order: 2,
                                    required: true,
                                    placeholder: "Enter your city"
                                },
                                {
                                    label: "State",
                                    type: FieldType.text,
                                    order: 3,
                                    required: false,
                                    placeholder: "Enter your state"
                                },
                                {
                                    label: "ZIP Code",
                                    type: FieldType.text,
                                    order: 4,
                                    required: false,
                                    placeholder: "Enter your ZIP code"
                                },
                                {
                                    label: "Country",
                                    type: FieldType.text,
                                    order: 5,
                                    required: true,
                                    placeholder: "Enter your country"
                                }
                            ]
                        }
                    },
                    {
                        label: "Higher Education",
                        order: 6,
                        fieldType: FieldType.group,
                        required: true,
                        placeholder: "Provide higher education details",
                        subField: {
                            create: [
                                {
                                    label: "Attended university degree program?",
                                    type: FieldType.radio,
                                    order: 1,
                                    required: true,
                                    defaultValue: "Yes",
                                    options: { choices: ["Yes", "No"] }
                                },
                                {
                                    label: "School name",
                                    type: FieldType.text,
                                    order: 2,
                                    required: true,
                                    placeholder: "Enter your university name"
                                },
                                {
                                    label: "Degree",
                                    type: FieldType.select,
                                    order: 3,
                                    required: true,
                                    placeholder: "Select your degree",
                                    options: { choices: ["B.Tech", "B.Sc", "M.Tech", "MBA", "PhD"] }
                                },
                                {
                                    label: "Degree Status",
                                    type: FieldType.select,
                                    order: 4,
                                    required: true,
                                    placeholder: "Select your degree status",
                                    options: { choices: ["Completed", "Ongoing", "Dropped"] }
                                },
                                {
                                    label: "Major / area of study",
                                    type: FieldType.text,
                                    order: 5,
                                    required: true,
                                    placeholder: "e.g., Computer Science"
                                },
                                {
                                    label: "Country / Region",
                                    type: FieldType.select,
                                    order: 6,
                                    required: true,
                                    placeholder: "Select country",
                                    options: { choices: ["India", "USA", "UK", "Canada"] }
                                }
                            ]
                        }
                    },
                    {
                        label: "Work Experience",
                        order: 7,
                        fieldType: FieldType.group,
                        required: true,
                        placeholder: "Provide your most recent work experience",
                        subField: {
                            create: [
                                {
                                    label: "Applying for your first job?",
                                    type: FieldType.radio,
                                    order: 1,
                                    required: true,
                                    defaultValue: "No",
                                    options: { choices: ["Yes", "No"] }
                                },
                                {
                                    label: "Employer name",
                                    type: FieldType.text,
                                    order: 2,
                                    required: true,
                                    placeholder: "Enter your employer name"
                                },
                                {
                                    label: "Job title",
                                    type: FieldType.text,
                                    order: 3,
                                    required: true,
                                    placeholder: "Enter your job title"
                                },
                                {
                                    label: "Start Month",
                                    type: FieldType.select,
                                    order: 4,
                                    required: true,
                                    placeholder: "Select start month",
                                    options: {
                                        choices: [
                                            "January", "February", "March", "April", "May", "June",
                                            "July", "August", "September", "October", "November", "December"
                                        ]
                                    }
                                },
                                {
                                    label: "Start Year",
                                    type: FieldType.number,
                                    order: 5,
                                    required: true,
                                    placeholder: "Enter start year"
                                },
                                {
                                    label: "This is your current job",
                                    type: FieldType.checkbox,
                                    order: 6,
                                    required: false
                                },
                                {
                                    label: "End Month",
                                    type: FieldType.select,
                                    order: 7,
                                    required: true,
                                    placeholder: "Select end month",
                                    options: {
                                        choices: [
                                            "January", "February", "March", "April", "May", "June",
                                            "July", "August", "September", "October", "November", "December"
                                        ]
                                    }
                                },
                                {
                                    label: "End Year",
                                    type: FieldType.number,
                                    order: 8,
                                    required: true,
                                    placeholder: "Enter end year"
                                },
                                {
                                    label: "Country / Region",
                                    type: FieldType.select,
                                    order: 9,
                                    required: true,
                                    placeholder: "Select country",
                                    options: { choices: ["India", "USA", "UK", "Canada"] }
                                },
                                {
                                    label: "City",
                                    type: FieldType.text,
                                    order: 10,
                                    required: true,
                                    placeholder: "Enter city"
                                },
                                {
                                    label: "State",
                                    type: FieldType.text,
                                    order: 11,
                                    required: false,
                                    placeholder: "Enter state"
                                }
                            ]
                        }
                    },
                    {
                        label: "Social Links",
                        order: 8,
                        fieldType: FieldType.group,
                        required: false,
                        placeholder: "Add your professional social links",
                        subField: {
                            create: [
                                {
                                    label: "LinkedIn Profile",
                                    type: FieldType.text,
                                    order: 1,
                                    required: false,
                                    placeholder: "Paste your LinkedIn profile URL"
                                },
                                {
                                    label: "GitHub Profile",
                                    type: FieldType.text,
                                    order: 2,
                                    required: false,
                                    placeholder: "Paste your GitHub profile URL"
                                },
                                {
                                    label: "Portfolio Website",
                                    type: FieldType.text,
                                    order: 3,
                                    required: false,
                                    placeholder: "Paste your portfolio website URL"
                                }
                            ]
                        }
                    },
                    {
                        label: "Consent & Certification",
                        order: 9,
                        fieldType: FieldType.group,
                        required: true,
                        placeholder: "Please review and acknowledge the following statements",
                        subField: {
                            create: [
                                {
                                    label: "I consent to the processing of my information as described in Google's applicant and candidate privacy policy. In limited circumstances, Google may share my contact information with trusted third parties to assist in certain phases of the hiring process (such as conducting background checks).",
                                    type: FieldType.checkbox,
                                    order: 1,
                                    required: true
                                },
                                {
                                    label: "I hereby certify that, to the best of my knowledge, the provided information is true and accurate.",
                                    type: FieldType.checkbox,
                                    order: 2,
                                    required: true
                                }
                            ]
                        }
                    }
                ]
            }
        }, 
        {
            title: "Role Information",
            order: 2,
            fields: {
                create: [
                    {
                        label: "Minimum Qualifications",
                        fieldType: FieldType.group,
                        order: 1,
                        required: true,
                        placeholder: "Confirm your qualifications",
                        subField: {
                            create: [
                                {
                                    label: "Do you have a Bachelor's degree or equivalent practical experience?",
                                    type: FieldType.radio,
                                    order: 1,
                                    required: true,
                                    options: {
                                        choices: ["Yes", "No", "Not sure"]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        label: "Work Authorization",
                        fieldType: FieldType.group,
                        order: 2,
                        required: true,
                        placeholder: "Confirm your eligibility",
                        subField: {
                            create: [
                                {
                                    label: "Are you legally eligible to work in the country of employment?",
                                    type: FieldType.radio,
                                    order: 1,
                                    required: true,
                                    options: {
                                        choices: ["Yes", "No"]
                                    }
                                },
                                {
                                    label: "Do you currently need, or will you someday require, company to sponsor work authorization for you to work in the country of employment?",
                                    type: FieldType.radio,
                                    order: 2,
                                    required: true,
                                    options: {
                                        choices: ["Yes", "No"]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        label: "Years of Experience",
                        fieldType: FieldType.number,
                        order: 3,
                        required: true,
                        placeholder: "Enter years of experience"
                    },
                    {
                        label: "Expected Salary",
                        fieldType: FieldType.number,
                        order: 4,
                        required: false,
                        placeholder: "Enter expected salary in inr"
                    }
                ]
            }
        },
        {
            title: "Voluntary Self-Identification",
            order: 3,
            fields: {
                create: [
                    {
                        label: "Gender",
                        fieldType: FieldType.group,
                        order: 1,
                        required: false,
                        placeholder: "",
                        subField: {
                            create: [
                                {
                                    label: "Gender",
                                    type: FieldType.radio,
                                    order: 1,
                                    required: false,
                                    options: {
                                        choices: [
                                            "Male",
                                            "Female",
                                            "Non-binary",
                                            "Prefer not to say"
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        label: "Ethnicity",
                        fieldType: FieldType.group,
                        order: 2,
                        required: false,
                        placeholder: "Select your ethnicity",
                        subField: {
                            create: [
                                {
                                    label: "Ethnicity",
                                    type: FieldType.select,
                                    order: 1,
                                    required: false,
                                    placeholder: "Select your ethnicity",
                                    options: {
                                        choices: [
                                            "Asian",
                                            "Black or African American",
                                            "Hispanic or Latino",
                                            "White",
                                            "Other",
                                            "Prefer not to say"
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        label: "Disability Status",
                        fieldType: FieldType.group,
                        order: 3,
                        required: false,
                        placeholder: "",
                        subField: {
                            create: [
                                {
                                    label: "Disability Status",
                                    type: FieldType.radio,
                                    order: 1,
                                    required: false,
                                    options: {
                                        choices: [
                                            "Yes, I have a disability",
                                            "No, I do not have a disability",
                                            "Prefer not to say"
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        label: "Veteran Status",
                        fieldType: FieldType.group,
                        order: 4,
                        required: false,
                        placeholder: "",
                        subField: {
                            create: [
                                {
                                    label: "Veteran Status",
                                    type: FieldType.radio,
                                    order: 1,
                                    required: false,
                                    options: {
                                        choices: [
                                            "I am a veteran",
                                            "I am not a veteran",
                                            "Prefer not to say"
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            title: "Review & Apply",
            order: 4,
            fields: {
                create: [
                    {
                        label: "Review Your Information",
                        fieldType: FieldType.review,
                        order: 1,
                        required: false,
                        placeholder: ""
                    },
                    {
                        label: "Confirm and Submit",
                        fieldType: FieldType.checkbox,
                        order: 2,
                        required: true,
                        placeholder: "",
                        subField: {
                            create: [
                                {
                                    label: "I confirm that the information provided is accurate",
                                    type: FieldType.checkbox,
                                    order: 1,
                                    required: true,
                                    defaultValue: "true"
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}