const express = require("express");
const Job = require("../models/job");
const User = require("../models/user");
const JobMapping = require("../models/job_mapping");
const { authenticateUser, authorizeAdmin } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     security:
 *       - BearerAuth: []
 *     description: Add a new job to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               company:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: integer
 *               jobType:
 *                 type: string
 *                 enum: ["full-time", "part-time", "contract"]
 *     responses:
 *       201:
 *         description: Job created successfully
 */
router.post("/", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { title, description, company, location, salary, jobType } = req.body;
    const newJob = await Job.create({ title, description, company, location, salary, jobType });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * @swagger
 * /jobs/apply:
 *   post:
 *     summary: Apply a new job
 *     description: Apply for new job.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: number
 *               job_id:
 *                 type: number
 *     responses:
 *       201:
 *         description: Job applied successfully
 */
router.post("/apply", async (req, res) => {
  try {
    const { user_id, job_id } = req.body;
    const newJob = await JobMapping.create({ user_id, job_id });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     description: Retrieve a list of all jobs.
 *     responses:
 *       200:
 *         description: Successfully retrieved jobs
 */
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /jobs/applied:
 *   get:
 *     summary: Get all jobs
 *     description: Retrieve a list of all jobs.
 *     responses:
 *       200:
 *         description: Successfully retrieved jobs
 */
router.get("/applied", async (req, res) => {
  try {
    const jobs = await JobMapping.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"], // include only needed fields
        },
        {
          model: Job,
          attributes: ["id", "title", "company"], // customize fields as per your schema
        },
      ],
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     description: Retrieve a job by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved job
 *       404:
 *         description: Job not found
 */
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update job by ID
 *     security:
 *       - BearerAuth: []
 *     description: Update a job's details by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               company:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: integer
 *               jobType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       404:
 *         description: Job not found
 */
router.put("/:id", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { title, description, company, location, salary, jobType } = req.body;
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await job.update({ title, description, company, location, salary, jobType });
    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete job by ID
 *     security:
 *       - BearerAuth: [] 
 *     description: Delete a job from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 */
router.delete("/:id", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await job.destroy();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
