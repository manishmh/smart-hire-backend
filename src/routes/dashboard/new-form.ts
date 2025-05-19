import { Request, Response, Router } from "express";
import { db } from "../../lib/db";
import { TokenAuthorization } from "../../middleware/token-authorization";
import { updateFormSchema } from "../../schema/form-validation";

const NewFormRouter = Router();

NewFormRouter.get("/:formId", TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const { formId } = req.params;
        if (!formId) {
            res.status(404).json({ success: false, message: "form id not found. check params" })
            return;
        }

        const form = await db.form.findUnique({ where: {id: formId} });
        if (!form) {
            res.status(404).json({ success: false, message: "form does not exists" })
            return;
        }

        res.status(200).json({ success: false, message: "Form fetched successfully", form })
        return;

    } catch (error) {
        console.error(error)        
        res.status(500).json({ success: false, messag: "Something went wrong! try again" })
        return;
    }
})

NewFormRouter.get("/", TokenAuthorization, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; 
    const completedQuery = req.query.completed;

    if (!completedQuery) {
        res.status(404).json({ success: false, message: "completed query missing" })
        return;
    }
    const completed = completedQuery === "true" ? true : false;

    const forms = await db.form.findMany({
      where: {
        userId,
        completed,
      },
    });

    res.status(200).json(forms);
    return;
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});


NewFormRouter.get("/", TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(404).json({ success: false, message: "user not authenticated" });
            return;
        }

        const userWithForms = await db.user.findUnique({ where: 
            { id: userId },
            include: {
                forms: true,
            }
        })

        if (!userWithForms) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        res.status(200).json({ success: true, message: "forms fetched", form: userWithForms?.forms })
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
        return;
    }
})

NewFormRouter.post("/", TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { name } = req.body;
        
        if (!userId) {
            res.status(401).json({ success: false, message: "No user id" })
            return;
        }
        if (!name) {
            res.status(401).json({ success: false, message: "No user id" })
            return;
        }

        const existingName = await db.form.findUnique({ where: { name }} )
        if (existingName) {
            res.status(400).json({ success: false, message: "Name is already taken" })
            return;
        }

        const form = await db.form.create({
            data: {
                name,
                userId
            }
        })

        res.status(200).json({
            success: true,
            message: "From created successfully",
            form: form
        })
        return;
        
    } catch (error) {
        console.error(error)        
        res.status(500).json({ success: false, message: "something went wrong! try again"})
        return;
    }
})

NewFormRouter.delete("/:formId", TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const { formId } = req.params;
        const userId = req.user?.id;

        if (!formId || typeof formId !== "string") {
            res.status(404).json({ success: false, message: "Form Id missing" })
            return;
        }

        const form = await db.form.findUnique({ where: { id: formId } })

        if (!form) {
            res.status(404).json({ success: false, message: "Form not found." })
            return;
        }

        if (form?.userId !== userId) {
            res.status(404).json({ success: false, message: "Unauthorized to delete this form." })
            return;
        }

        await db.form.delete({ where: { id: formId } })

        res.status(200).json({ success: true, message: "Form deleted successfully" })
        return;
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "something went wrong! try again" })
        return;
    }
})

NewFormRouter.put("/:formId", TokenAuthorization, async (req: Request, res: Response) => {
    try {
        let formData = req.body;
        const userId = req.user?.id;
        const { formId } = req.params;

        if (!formId || typeof formId !== "string") {
            res.status(404).json({ success: false, message: "form id not found"});
            return;
        }

        const validatedSchema = updateFormSchema.safeParse(formData);
        if (!validatedSchema.success) {
            res.status(400).json({ success: false, messaeg: validatedSchema.error.errors[0].message })
            return;
        }

        const existingForm = await db.form.findUnique({ where: { id: formId }})
        if (!existingForm) {
            res.status(404).json({ success: false, message: "Form not found." })
            return;
        }
        
        if (existingForm.userId !== userId) {
            res.status(403).json({ success: false, message: "Unauthorized to update this form" })
            return;
        }
        
        formData = validatedSchema.data;
        const form = await db.form.update({
            where: { id: formId },
            data: formData
        })

        res.status(200).json({ success: true, message: "Form updated successfully", form })
        return;

    } catch (error) {
        
    }
})

export default NewFormRouter