import * as Yup from 'yup';

import HelpRequest from '../models/HelpRequest';
import Student from '../models/Student';

class HelpRequestController {
  async index(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const helpRequests = await HelpRequest.findAll({
      where: { student_id: student.id },
      order: ['created_at'],
    });

    return res.json(helpRequests);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const helpRequest = await HelpRequest.create({
      student_id: student.id,
      question: req.body.question,
    });

    return res.json(helpRequest);
  }
}

export default new HelpRequestController();
