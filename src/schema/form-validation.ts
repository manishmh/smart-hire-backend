import z from 'zod';

export const titleSchema = z.object({
    title: z.string({ required_error: "title is requried" })
})

export const formSchema =  z.object({
    name: z.string({ required_error: "Name is required"}).min(1),
    description: z.string({ required_error: "Description is required"}).optional().nullable(),
})

export const pageOptionEnum = z.enum(["single", "multiple"]);

export const updateFormSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  completed: z.boolean().optional(),
  pageOption: pageOptionEnum.optional(),
  sections: z.array(z.any()).optional(), 
});

export const formSectionSchema = z.object({
    title: z.string({ required_error: "Title is required" }),
    formId: z.string({ required_error: "Form id is required" })
})

export const formFieldSchema = z.object({
    label: z.string({ required_error: "Label is required" }),
    fieldType: z.string({ required_error: "Field type is required" }),
    required: z.boolean({ required_error: "requried is required" }),
    sectionId: z.string({ required_error: "section id is required" })
})

export const putFormFieldSchema = formFieldSchema
    .extend({ order: z.number().optional() })
    .partial()
    .strict()
    .extend({ fieldId: z.string(), sectionId: z.string() })

export const fieldTypeEnum = z.enum([
  'text',
  'number',
  'email',
  'select',
  'checkbox',
  'radio',
  'file',
  'date',
  'group',
  'submit',
  'review',
]);

export const subFieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  type: fieldTypeEnum,
  required: z.boolean(),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
  hint: z.string().optional(),
  options: z.any().optional(), 
  fieldId: z.string().uuid(),
});

export const updateSubFieldSchema = subFieldSchema
  .partial()
  .strict()
  .extend({
    id: z.string().uuid(),
    order: z.number().int().nonnegative().optional()
  });
