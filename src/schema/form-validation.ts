import z from 'zod';

export const titleSchema = z.object({
    title: z.string({ required_error: "title is requried" })
})

export const formSchema =  z.object({
    name: z.string({ required_error: "Name is required"}).min(1),
    description: z.string({ required_error: "Description is required"}).optional().nullable(),
}).strict();

export const updateFormSchema = formSchema.partial().strict();

export const formSectionSchema = z.object({
    title: z.string({ required_error: "Title is required" }),
    formId: z.string({ required_error: "Form id is required" })
})

export const formFieldSchema = z.object({
    label: z.string({ required_error: "Label is required" }),
    fieldType: z.string({ required_error: "Field type is required" }),
    required: z.boolean({ required_error: "requried is required" }),
    placeholder: z.string().optional(),
    defaultValue: z.string().optional(),
    sectionId: z.string({ required_error: "section id is required" })
})

export const putFormFieldSchema = formFieldSchema
    .extend({ order: z.number().optional() })
    .partial()
    .strict()
    .extend({ fieldId: z.string(), sectionId: z.string() })

export const fieldOptionSchmea = z.object({
    value: z.string({ required_error: "Value is required" }),
    label: z.string({ required_error: "Label is required" }),
    order: z.string({ required_error: "Order is required" }),
    fieldId: z.string({ required_error: "Field id is required" })
})