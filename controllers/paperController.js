import Paper from '../models/Paper.js';

export const getPapersBySubject = async (req, res) => {
  const { subjectId } = req.params;
  const papers = await Paper.find({ subject: subjectId });
  res.json(papers);
};

export const getPaper = async (req, res) => {
  const { paperId } = req.params;
  const paper = await Paper.findById(paperId);
  res.json(paper);
};
