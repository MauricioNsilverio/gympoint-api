import * as Yup from 'yup';
import { addMonths, isBefore, parseISO, startOfDay } from 'date-fns';

import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';

import Mail from '../../lib/Mail';

class EnrollmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const enrollments = await Enrollment.findAll({
      order: ['id'],
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const hasEnrollment = await Enrollment.findOne({ where: { student_id } });
    if (hasEnrollment) {
      return res
        .status(400)
        .json({ error: 'Student has already been enrolled' });
    }

    const parsedStartDate = startOfDay(parseISO(start_date));

    if (isBefore(parsedStartDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const end_date = addMonths(parsedStartDate, plan.duration);

    const price = plan.price * plan.duration;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date: parsedStartDate,
      end_date,
      price,
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula Gympoint efetuada!',
      template: 'enrollment',
      context: {
        studentName: student.name,
        planTitle: plan.title,
        planEndDate: end_date,
        planPrice: price,
      },
    });

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
