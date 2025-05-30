import { Request, Response, Router } from "express";
import { DefaultSections } from "../../data/default-sections";
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

        const form = await db.form.findUnique({ 
            where: { id: formId },
            include: {
                sections: {
                orderBy: { order: 'asc' },
                include: {
                    fields: {
                        orderBy: { order: 'asc' },
                        include: {
                            subField: { orderBy: { order: 'asc' } }, 
                        },
                    },
                },
                },
            },
        });

        if (!form) {
            res.status(404).json({ success: false, message: "form does not exists" })
            return;
        }

        res.status(200).json({ success: true, message: "Form fetched successfully", form })
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

    if (!userId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const completedQuery = req.query.completed;

    let forms;

    if (typeof completedQuery === "string") {
      const completed = completedQuery === "true";
      forms = await db.form.findMany({
        where: {
          userId,
          completed,
        }, 
        orderBy: {
            createdAt: "desc"
        }
      });
    } else {
      forms = await db.form.findMany({
        where: { userId },
      });
    }

    res.status(200).json({ success: true, message: "Forms fetched", forms });
    return;

  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
});

NewFormRouter.post("/", TokenAuthorization, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { name, pageOption, multiPageChoice, template } = req.body;
        
        if (!userId) {
            res.status(401).json({ success: false, message: "No user id" })
            return;
        }
        if (!name) {
            res.status(401).json({ success: false, message: "No Name" })
            return;
        }

        const existingName = await db.form.findUnique({ where: { name }})
        if (existingName) {
            res.status(400).json({ success: false, message: "Name is already taken" })
            return;
        }

        let newForm = { create: [{ title: "Untitled section", order: 1 }] }; 
        if (pageOption === "multiple" && multiPageChoice === "template") {
            newForm = DefaultSections;
        }

        const form = await db.form.create({
            data: { 
                name,
                userId,
                pageOption,
                sections: newForm
            }, include: {
                sections: true
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


export default NewFormRouter