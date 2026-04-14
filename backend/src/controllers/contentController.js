import { Course, Subject, Module, Topic, TaskType, MCQ } from '../models/index.js';

export const getCourses = async (req, res) => res.json(await Course.find().lean());
export const getSubjects = async (req, res) => res.json(await Subject.find({ course_id: req.params.course_id }).lean());
export const getModules = async (req, res) => res.json(await Module.find({ subject_id: req.params.subject_id }).lean());
export const getTopics = async (req, res) => res.json(await Topic.find({ module_id: req.params.module_id }).lean());
export const getTaskTypes = async (req, res) => res.json(await TaskType.find({ topic_id: req.params.topic_id }).lean());
export const getMcqs = async (req, res) => res.json(await MCQ.find({ task_type_id: req.params.task_type_id, published: true }).lean());
