// import * as Yup from 'yup';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const checkins = await Checkin.findAll({
      where: { student_id: req.params.id },
    });
    return res.json(checkins);
  }

  async store(req, res) {
    const student_id = req.params.id;
    const student = Student.findByPk(student_id);

    // Check if student exists
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const date = endOfDay(new Date());
    const datePast = startOfDay(subDays(date, 6));

    const checkinReleased = await Checkin.findAll({
      where: {
        student_id,
        createdAt: {
          [Op.between]: [datePast, date],
        },
      },
    });

    if (checkinReleased.length > 5) {
      return res
        .status(400)
        .json({ error: 'Student already exceeded the checkins of the week.' });
    }

    const checkin = await Checkin.create({
      student_id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
