import { Router, Request, Response } from 'express';
import { db } from '../../lib/db'; 
import { TokenAuthorization } from '../../middleware/token-authorization';
import { subFieldSchema, updateSubFieldSchema } from '../../schema/form-validation';

const SubFieldRouter = Router();

SubFieldRouter.get('/', TokenAuthorization, async (req: Request, res: Response) => {
    const { fieldId, id } = req.query;

    try {
        if (id) {
            const subField = await db.subField.findUnique({
                where: { id: id as string }
            });

            if (!subField) {
                res.status(404).json({ success: false, message: 'Subfield not found' });
                return;
            }

            res.status(200).json({ success: true, subField });
            return;
        }

        if (fieldId) {
            const subFields = await db.subField.findMany({
                where: { fieldId: fieldId as string },
                orderBy: { order: 'asc' }
            });

            if (!subFields.length) {
                res.status(404).json({ success: false, message: 'No subfields found for the given fieldId' });
                return;
            }

            res.status(200).json({ success: true, subFields });
            return;
        }

        res.status(400).json({ success: false, message: 'Provide either fieldId or subfield id' });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
        return;
    }
});

SubFieldRouter.post('/', TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const validatedData = subFieldSchema.safeParse(data); 
        if (!validatedData.success) {
            res.status(400).json({
                success: false,
                message: validatedData.error.errors[0].message
            });
            return;
        }

        const { label, fieldId, type, required, placeholder, defaultValue, hint, options } = validatedData.data;

        const existingField = await db.subField.findUnique({
            where: {
                fieldId_label: {
                    fieldId,
                    label
                }
            }
        });

        if (existingField) {
            res.status(400).json({
                success: false,
                message: `Subfield with label "${label}" already exists in this field.`
            });
            return;
        }

        const lastField = await db.subField.findFirst({
            where: { fieldId },
            orderBy: { order: 'desc' }
        });

        const nextOrder = lastField ? lastField.order + 1 : 0;

        const subField = await db.subField.create({
            data: {
                label,
                fieldId,
                type,
                required,
                order: nextOrder,
                placeholder,
                defaultValue,
                hint,
                options
            }
        });

        res.status(201).json({
            success: true,
            message: 'Subfield created successfully',
            subField
        });
        return;
    } catch (error) {
        console.error('Error creating subfield:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating subfield'
        });
        return;
    }
});

SubFieldRouter.put("/", async (req: Request, res: Response) => {
  try {
    const parsed = updateSubFieldSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    const { id, ...updates } = parsed.data;

    const subField = await db.subField.findUnique({ where: { id } });
    if (!subField) {
      res.status(404).json({ success: false, message: "SubField not found" });
      return;
    }

    const updated = await db.subField.update({
      where: { id },
      data: updates,
    });

    res.status(200).json({ success: true, message: "SubField updated", subField: updated });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
    return;
  }
});

SubFieldRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      res.status(400).json({ success: false, message: "Invalid or missing id" });
      return;
    }

    const existing = await db.subField.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: "SubField not found" });
      return;
    }

    await db.subField.delete({ where: { id } });

    res.status(200).json({ success: true, message: "SubField deleted" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
});

export default SubFieldRouter;
