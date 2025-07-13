import Subject from '../models/Subject.js';

export const getSubjects = async (req, res) => {
  const subs = await Subject.find();
  res.json(subs);
};
