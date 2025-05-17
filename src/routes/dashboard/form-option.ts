import { Request, Response, Router } from "express";
import { db } from "../../lib/db";
import { TokenAuthorization } from "../../middleware/token-authorization";
import { fieldOptionsSchema, putFieldOptionsSchema } from "../../schema/form-validation";

const FormOptionRouter = Router();

// get all the field options for a formfield
FormOptionRouter.get('/:fieldId', TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const { fieldId } = req.params;
        if (!fieldId) {
            res.status(404).json({ success: false, message: "No field id given" })
            return;
        }

        const options = await db.formField.findUnique({ 
            where: { id: fieldId },
            include: { 
                option: {
                    orderBy: {
                        label: 'asc'
                    }
                }
            },
        });

        if (!options) {
            res.status(404).json({ success: false, message: "No field Options for this section" })
            return;
        }

        res.status(200).json({ success: true, message: "field fetched", fields: options.option })
        return;

    } catch (error) {
        console.error(error) 
        res.status(500).json({ success: false, message: "Something went wrong! try again" });
        return;
    }
})

FormOptionRouter.post('/', TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const validatedData = fieldOptionsSchema.safeParse(data);
        if (!validatedData.success) {
            res.status(400).json({ success: false, message: validatedData.error.errors[0].message })
            return;
        }

        const { label, fieldId, value } = validatedData.data;
        const existingField = await db.fieldOptions.findFirst({ 
            where: {
                label,
                fieldId
            }
        })

        if (existingField) {
            res.status(400).json({ success: false, message: "Field already exists" })
            return;
        }

        const field = await db.fieldOptions.create({ data: { label, value, fieldId } })

        res.status(200).json({ success: true, message: "Field created.", field })
        return;

    } catch (error) {
        console.error(error) 
        res.status(500).json({ success: false, message: "Something went wrong! try again" });
        return; 
    }
})

FormOptionRouter.put('/', TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const validatedData = putFieldOptionsSchema.safeParse(data);
        if (!validatedData.success) {
            res.status(400).json({ success: false, message: validatedData.error.errors[0].message })
            return;
        }

        const { id } = validatedData.data
        const existingOptions = await db.fieldOptions.findUnique({ where: { id: id }});
        if (!existingOptions) {
            res.status(404).json({ success: false, message: "Field option does not exist" })
            return;
        }

        if (existingOptions.id !== id) {
            res.status(403).json({ success: false, message: `${id} not have access` })
            return;
        }

        const newField = await db.fieldOptions.update({
            where: { id },
            data: validatedData.data 
        })

        res.status(200).json({ success: true, message: "field updated", field: newField })
        return;

    } catch (error) {
        console.error(error) 
        res.status(500).json({ success: false, message: "Something went wrong! try again" });
        return; 
    }
})

FormOptionRouter.delete('/:optionId', TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const { optionId }  = req.params;
        if (!optionId) {
            res.status(404).json({ success: false, message: "option id is missing" })
            return;
        }

        const existingOption = await db.fieldOptions.findUnique({ where: { id: optionId }});
        if (!existingOption) {
            res.status(400).json({ success: false, message: "Field option does not exist" })
            return;
        }

        await db.fieldOptions.delete({ where: { id: optionId }})

        res.status(200).json({ success: true, message: "Field Option deleted" })
        return;

    } catch (error) {
        console.error(error) 
        res.status(500).json({ success: false, message: "Something went wrong! try again" });
        return; 
    }
})

export default FormOptionRouter;