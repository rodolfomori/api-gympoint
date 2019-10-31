import * as Yup from 'yup';
// import { isBefore, addMonths, parseISO, startOfDay, format } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { student_id, plan_id, start_date } = req.body;
    const plan = Plan.findByPk(plan_id);
    const student = Student.findByPk(student_id);

    // Check if student exists
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    // Check if plan exists
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    // const end_date = addMonths(start_date, plan.duration);

    const price = plan.price * plan.duration;

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date: 1572469255063,
      price,
    });

    return res.json(registration);
  }
}

export default new RegistrationController();
