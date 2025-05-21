import { Request, Response, Router } from "express";
import { db } from "../../lib/db";
import { TokenAuthorization } from "../../middleware/token-authorization";
import { formFieldSchema, putFormFieldSchema } from "../../schema/form-validation";
import { FieldType } from '@prisma/client'; 

const FormFieldRouter = Router();

// check label name for the field
FormFieldRouter.post("/name", TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const { label, fieldId } = req.body;
        if (!fieldId || !label) {
            res.status(404).json({ success: false, message: "fieldId and label missinng" })
            return;
        }

        const existingLabel = await db.formField.findFirst({
            where: { id: fieldId, label }
        })

        if (existingLabel) {
            res.status(200).json({ success: true, exists: true, message: "field label already exists" })
            return; 
        } else {
            res.status(200).json({ success: true, exists: false, message: "field label is available." });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong! Try again." });
        return; 
    }
})

// get all the form fields of a form section
FormFieldRouter.get('/:sectionId', TokenAuthorization, async (req: Request, res: Response) => {
    const { sectionId } = req.params;

    if (!sectionId) {
        res.status(404).json({ success: false, message: "Form section id not given" })
        return;
    }

    const fields = await db.formSection.findUnique({ 
        where: { id: sectionId },
        include: {
            fields: true
        }
    })

    if (!fields) {
        res.status(404).json({ success: false, message: "Form fields not found" })
        return;
    }

    res.status(200).json({ success: true, message: "Form fields retrieved", fields: fields.fields })
}) 

FormFieldRouter.post('/', TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const validatedData = formFieldSchema.safeParse(data);

        if (!validatedData.success) {
            res.status(400).json({ success: false, message: validatedData.error.errors[0].message });
            return;
        }

        const { label, sectionId, fieldType, required } = validatedData.data;

        if (!Object.values(FieldType).includes(fieldType as FieldType)) {
            res.status(400).json({ success: false, message: `Invalid fieldType: ${fieldType}` });
            return;
        }

        const existingField = await db.formField.findUnique({
            where: {
                sectionId_label: {
                    sectionId,
                    label
                }
            }
        });

        if (existingField) {
            res.status(400).json({ success: false, message: `${existingField.label} with order ${existingField.order} already exists` });
            return;
        }

        const lastField = await db.formField.findFirst({
            where: { sectionId },
            orderBy: { order: "desc" }
        });

        const nextOrder: number = lastField ? lastField.order + 1 : 0;

        const baseData = {
            label,
            fieldType: fieldType as FieldType,
            required,
            order: nextOrder,
            sectionId,
        };

        const field = await db.formField.create({
            data: baseData
        });

        res.status(200).json({ success: true, message: "form field created", field });
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong! try again" });
        return;
    }
});

FormFieldRouter.put('/', TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const validatedData = putFormFieldSchema.safeParse(data);
        if (!validatedData.success) {
            res.status(400).json({ success: false, message: validatedData.error.errors[0].message });
            return;
        }

        const { fieldId, sectionId, order: newOrder } = validatedData.data;

        const field = await db.formField.findUnique({ where: { id: fieldId } });
        if (!field) {
            res.status(400).json({ success: false, message: "Field does not exist" });
            return;
        }

        // Build updateFields while removing non-updatable fields
        const updateFields: any = { ...validatedData.data };
        delete updateFields.fieldId;
        delete updateFields.sectionId;
        delete updateFields.order;

        // Convert fieldType to Prisma Enum if present
        if (updateFields.fieldType) {
            if (!Object.values(FieldType).includes(updateFields.fieldType)) {
                res.status(400).json({ success: false, message: `Invalid fieldType: ${updateFields.fieldType}` });
                return;
            }
            updateFields.fieldType = updateFields.fieldType as FieldType;
        }

        // Handle order swap
        if (typeof newOrder === "number" && newOrder !== field.order) {
            const conflictingField = await db.formField.findFirst({
                where: { order: newOrder, sectionId }
            });

            if (!conflictingField) {
                res.status(400).json({ success: false, message: "Target order does not exist" });
                return;
            }

            await db.formField.update({
                where: { id: fieldId },
                data: { order: -1 }
            });

            await db.formField.update({
                where: { id: conflictingField.id },
                data: { order: field.order }
            });

            updateFields.order = newOrder;
        }

        const updatedField = await db.formField.update({
            where: { id: fieldId },
            data: updateFields
        });

        res.status(200).json({
            success: true,
            message: "Field updated successfully",
            field: updatedField
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong! Try again." });
        return;
    }
});

FormFieldRouter.delete('/:fieldId', TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const { fieldId } = req.params;
        if (!fieldId) {
            res.status(404).json({ success: false, message: "Field id missing" })
            return;
        }

        const existingField = await db.formField.findUnique({ where: { id: fieldId }})
        if (!existingField) {
            res.status(404).json({ success: false, message: "Field does not exists" })
            return;
        }

        await db.formField.delete({ where: { id: fieldId }});

        res.status(200).json({ success: true, message: "Field delted successfully" })
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong! Try again." });
        return;
    }
})

export default FormFieldRouter;