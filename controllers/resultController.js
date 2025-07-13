import Result from '../models/Result.js';

export const submitResult = async (req, res) => {
  const { paperId, score, accuracy } = req.body;
  const result = await Result.create({
    user: req.user.id,
    paper: paperId,
    score,
    accuracy
  });
  res.json(result);
};

export const getResult = async (req, res) => {
  const { resultId } = req.params;
  const result = await Result.findById(resultId);
  res.json(result);
};
