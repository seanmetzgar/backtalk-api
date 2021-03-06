require('dotenv').config();
const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const {
  checkValidationResult,
  checkTitle,
  checkSurveyQuestions,
} = require('../../middleware/validate');
const { Survey } = require('../../models');
const hashIds = require('../../helpers/hashIds');

router.get('/getHash', async (req, res) => {
  const { num } = req.query;
  const hash = await hashIds.encode(num);
  res.json({ hash });
});

router.post(
  '/new',
  authenticate,
  [checkTitle, checkSurveyQuestions],
  checkValidationResult,
  async (req, res, next) => {
    try {
      let sanitizedSurvey = {
        title: req.body.title,
        description: req.body.description || null,
        Questions: req.body.questions,
        UserId: req.user.id,
      };
      const survey = await Survey.create(
        {
          ...sanitizedSurvey,
        },
        {
          include: [Survey.questions],
        },
      );

      let result = survey.toJSON().renameProperty('Questions', 'questions');
      return res.status(200).json({
        created: true,
        result,
      });
    } catch (err) {
      next({
        status: 500,
        stack: err,
        errors: [
          {
            msg: err.msg,
          },
        ],
      });
    }
  },
);

router.get('/', authenticate, async (req, res, next) => {
  try {
    const surveys = await Survey.findAll({
      where: {
        UserId: req.user.id,
      },
      limit: req.query.count || 20,
      offset: req.query.offset || 0,
      include: [Survey.questions],
    });
    let results = surveys.map((survey) =>
      survey.toJSON().renameProperty('Questions', 'questions'),
    );
    res.status(200).json({
      results,
    });
  } catch (err) {
    next({
      status: 500,
      stack: err,
      errors: [
        {
          msg: err.msg,
        },
      ],
    });
  }
});

router.get('/:hash', async (req, res, next) => {
  try {
    const id = await hashIds.decode(req.params.hash)[0];
    if (!id) {
      return next({
        status: 404,
        errors: [
          {
            msg: 'Not Found',
            location: 'url',
          },
        ],
      });
    }
    const survey = await Survey.findOne({
      where: {
        id,
      },
      include: [Survey.questions],
    });
    let result = survey.toJSON().renameProperty('Questions', 'questions');
    result = { ...result };
    res.status(200).json({
      result,
    });
  } catch (err) {
    next({
      status: 500,
      stack: err,
      errors: [
        {
          msg: err.msg,
        },
      ],
    });
  }
});

router.delete('/delete', authenticate, async (req, res, next) => {
  try {
    const id = req.body.surveyId;
    if (!id) {
      return next({
        status: 404,
        errors: [
          {
            msg: 'Not Found',
            location: 'url',
          },
        ],
      });
    }
    const survey = await Survey.destroy({
      where: {
        id,
        UserId: req.user.id,
      },
    });
    if (survey < 1) {
      return res.status(200).json({ deleted: false });
    }
    res.status(200).json({
      deleted: true,
    });
  } catch (err) {
    next({
      status: 500,
      stack: err,
      errors: [
        {
          msg: err.msg,
        },
      ],
    });
  }
});

module.exports = router;
