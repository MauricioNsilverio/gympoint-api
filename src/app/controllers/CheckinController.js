import { Op } from 'sequelize';
import { startOfDay, endOfDay, subDays, addDays } from 'date-fns';

import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Checkin from '../schemas/Checkin';

class CheckinController {
  async index(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const checkins = await Checkin.find({
      student: student.id,
    })
      .sort({ createdAt: 'desc' })
      .limit(5);

    return res.json(checkins);
  }

  async store(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const currentDate = startOfDay(new Date());

    const enrollment = await Enrollment.findOne({
      where: {
        student_id: student.id,
        start_date: {
          [Op.lte]: currentDate, // less than or equal to currentDate
        },
        end_date: {
          [Op.gte]: currentDate, // greater than or equal to currentDate
        },
      },
    });

    if (!enrollment) {
      return res.status(401).json({
        error: 'This student must have an active enrollment to check in',
      });
    }

    const lastCheckinDay = subDays(currentDate, 7);
    const nextAvailableCheckin = addDays(currentDate, 8);

    const checkins = await Checkin.find({
      student: student.id,
    })
      .gte('createdAt', startOfDay(lastCheckinDay))
      .lte('createdAt', endOfDay(currentDate))
      .countDocuments();

    if (checkins > 5) {
      return res.status(400).json({
        error: `You can only check in 5 times every 7 days. You'll be able to check in again in ${nextAvailableCheckin}`,
      });
    }

    const checkin = await Checkin.create({
      student: student.id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
