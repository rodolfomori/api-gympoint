// import * as Yup from 'yup';
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

    const checkin = await Checkin.create({
      student_id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
