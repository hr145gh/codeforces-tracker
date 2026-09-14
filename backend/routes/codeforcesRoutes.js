const Problem= require("../models/Problem");
const express= require("express");
const { getUserSubmissions } = require("../services/codeforcesService");

const router= express.Router();

router.get("/test", (req, res) => {
    res.send("Codeforces route is working");
});

router.get("/:handle", async(req, res) => {
    try {
        const submissions= await getUserSubmissions(req.params.handle);
        res.json(submissions);
    } catch(error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch Codeforces submissions",
            error: error.message
        });
    }
});

router.post("/sync/:handle", async(req, res) => {
    try {
        const submissions= await getUserSubmissions(req.params.handle);
        let added=0;

        for(const submission of submissions){
            const contestId= submission.problem.contestId;
            const index= submission.problem.index;
            
            const existingProblem= await Problem.findOne({
                contestId: contestId,
                index: index
            });

            if(existingProblem){
                continue;
            }

            const problem= new Problem({
                contestId: contestId,
                index: index,
                name: submission.problem.name,
                rating: submission.problem.rating,
                tags: submission.problem.tags,
                problemUrl: `https://codeforces.com/problemset/problem/${contestId}/${index}`,
                solvedAt: new Date(submission.creationTimeSeconds * 1000)
            });

            await problem.save();
            added++;
        }
        res.json({
            message: "Codeforces problem synced successfully",
            added: added
        });

    } catch(error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to sync Codeforces problem",
            error: error.message
        });
    }
});

module.exports= router;