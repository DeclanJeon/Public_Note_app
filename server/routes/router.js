import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    res.render("index", {
        viewTitle: "Note App",
    });
});

export default router;
