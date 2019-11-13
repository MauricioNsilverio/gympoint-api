import * as Yup from 'yup';

import HelpRequest from '../models/HelpRequest';
import Student from '../models/Student';

import AnswerHelpRequestMail from '../jobs/AnswerHelpRequestMail';
import Queue from '../../lib/Queue';

class AnswerHelpRequestController {
  async index(req, res) {
    const noAnsweredHelpRequests = await HelpRequest.findAll({
      where: { answer: null },
      order: ['created_at'],
    });

    return res.json(noAnsweredHelpRequests);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const helpRequest = await HelpRequest.findByPk(req.params.id);

    if (!helpRequest) {
      return res.status(400).json({ error: 'Help request does not exist' });
    }

    await helpRequest.update({
      answer: req.body.answer,
      answer_at: new Date(),
    });

    const student = await Student.findByPk(helpRequest.student_id);

    await Queue.add(AnswerHelpRequestMail.key, {
      student,
      question: helpRequest.question,
      answer: helpRequest.answer,
    });

    return res.json(helpRequest);
  }
}

export default new AnswerHelpRequestController();
