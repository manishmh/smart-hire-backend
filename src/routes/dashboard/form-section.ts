import { Request, Response, Router } from "express";
import { db } from "../../lib/db";
import { TokenAuthorization } from "../../middleware/token-authorization";
import { formSectionSchema } from "../../schema/form-validation";

const FormSectionRouter = Router();

// get all the form sections of a form. 
FormSectionRouter.get('/:formId', TokenAuthorization, async(req: Request, res: Response) => {
    try {
        const { formId } = req.params;
        if (!formId)  {
            res.status(404).json({ success: false, message: "Form id is missing in params" })
            return;
        }

        const sections = await db.form.findUnique({
            where: { id: formId },
            include: {
                sections: true
            }
        })

        if (!sections) {
            res.status(404).json({ success: false, message: "Form was not found" })
            return;
        }

        res.status(200).json({ success: true, message: "Form sections retreived.", sections: sections.sections })
        return;

    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Something went wrong! try again" })
        return;
    }
})

FormSectionRouter.post("/name", TokenAuthorization, async(req: Request, res: Response) => {
    try {
        const { title, formId } = req.body;

        if (!title || !formId) {
            res.status(400).json({ success: false, message: "Name and Section ID are required." });
            return;
        }

        const formSection = await db.formSection.findFirst({
            where: {
                title,
                formId 
            }
        })

        if (formSection) {
            res.status(200).json({ success: true, exists: true, message: "section name already exists" })
            return; 
        } else {
            res.status(200).json({ success: true, exists: false, message: "section name is available." });
            return;
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Something went wrong. try again" }) 
        return;
    }
})

FormSectionRouter.post("/", TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const sectionData = req.body;

        const validatedSection = formSectionSchema.safeParse(sectionData);
        if (!validatedSection.success) {
            res.status(400).json({ success: false, message: validatedSection.error.errors[0].message });
            return;
        }

        const { title, formId } = validatedSection.data;

        const existingField = await db.formSection.findFirst({
            where: {
                title,
                formId
            }
        });

        if (existingField) {
            res.status(400).json({ success: false, message: "Field name already exists in this section" });
            return;
        }

        const lastSection = await db.formSection.findFirst({
            where: { formId: formId }, 
            orderBy: { order: "desc" }
        })

        const nextOrder = lastSection ? lastSection.order + 1 : 0;
        const section = await db.formSection.create({ data: { title, order: nextOrder, formId }});

        res.status(200).json({ success: true, message: "Form section created", section });
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong. Try again" });
        return;
    }
});

FormSectionRouter.put("/", TokenAuthorization, async(req: Request, res: Response) => {
    try {
        const { title, newOrder, sectionId, formId } = req.body;

        if (!sectionId || !formId) {
            res.status(400).json({ success: false, message: "Section Id and form Id is required" });
            return;
        }

        const section = await db.formSection.findUnique({ where: { id: sectionId } });
        if (!section) {
            res.status(404).json({ success: false, message: "Form section not found" });
            return;
        }

        const updates: any = {};

        if (title) {
            updates.title = title;
        }

        if (typeof newOrder === "number" && newOrder !== section.order) {
            const conflictingSection = await db.formSection.findFirst({ where: { formId, order: newOrder } });

            if (!conflictingSection) {
                res.status(400).json({ success: false, message: "Target order does not exist" });
                return;
            }

            await db.formSection.update({
                where: { id: sectionId },
                data: { order: -1 },
            });

            await db.formSection.update({
                where: { id: conflictingSection.id },
                data: { order: section.order }
            })

            updates.order = newOrder;
        }

        if (Object.keys(updates).length === 0) {
            res.status(400).json({ success: false, message: "No valid fields to update" });
            return;
        }

        const updatedSection = await db.formSection.update({
            where: { id: sectionId },
            data: updates,
        });

        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            section: updatedSection,
        });
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong. Try again" });
        return;
    }
})

FormSectionRouter.delete("/:sectionId", TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const { sectionId } = req.params; 
        if (!sectionId) {
            res.status(404).json({ success: false, message: "section id param is missing" })
            return;
        }

        const existingSection = await db.formSection.findUnique({ where: { id: sectionId }})
        if (!existingSection) {
            res.status(404).json({ success: false, message: "Section does not exist" })
            return;
        }

        await db.formSection.delete({ where: { id: existingSection.id }});

        res.status(200).json({ success: true, message: `${existingSection.title} section deleted successfully` })
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong. Try again" });
        return;  
    }
})


export default FormSectionRouter;