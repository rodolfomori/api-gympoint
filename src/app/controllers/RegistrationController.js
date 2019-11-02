import * as Yup from 'yup';
import { isBefore, addMonths, parseISO } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Queue from '../../lib/Queue';
import RegistrationMail from '../jobs/RegistrationMail';
import UpdateRegistrationMail from '../jobs/UpdateRegistrationMail';

class RegistrationController {
  async show(req, res) {
    const registrations = await Registration.findOne({
      where: { student_id: req.params.id },
    });
    if (!registrations) {
      return res
        .status(400)
        .json({ error: 'There is not any registration with this student ID!' });
    }
    return res.json(registrations);
  }

  async index(req, res) {
    const registrations = await Registration.findAll({});
    if (!registrations) {
      return res.status(400).json({ error: 'There are not any registration!' });
    }
    return res.json(registrations);
  }

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
    const plan = await Plan.findByPk(plan_id);
    const student = await Student.findByPk(student_id);

    // Check if student exists
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    // check if the student has a other registration
    const registationExists = await Registration.findOne({
      where: { student_id },
    });

    if (registationExists) {
      return res
        .status(400)
        .json({ error: 'Student has a another registration' });
    }

    // Check if plan exists
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const startDate = parseISO(start_date);

    if (isBefore(startDate, new Date())) {
      return res.status(400).json({ error: ' The chosen date has passed ' });
    }

    const end_date = addMonths(startDate, plan.duration);

    const price = plan.price * plan.duration;

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date: startDate,
      end_date,
      price,
    });

    await Queue.add(RegistrationMail.key, {
      student,
      plan,
      start_date,
      end_date,
      price,
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    const schemaParams = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    if (!(await schemaParams.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const { plan_id, start_date } = req.body;
    const student = await Student.findByPk(id);

    // check if registration exists
    const registration = await Registration.findOne({
      where: {
        student_id: id,
      },
    });

    if (!registration) {
      return res.status(400).json({ error: 'Registration does not exists' });
    }

    // Check if plan exists
    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const startDate = parseISO(start_date);

    // check start date
    if (!start_date || isBefore(startDate, new Date())) {
      return res.status(400).json({
        error: ' Inform a correct start date, always in the future',
      });
    }

    const end_date = addMonths(startDate, plan.duration);

    const price = plan.price * plan.duration;

    await registration.update({
      plan_id,
      start_date: startDate,
      end_date,
      price,
    });

    await Queue.add(UpdateRegistrationMail.key, {
      student,
      plan,
      start_date,
      end_date,
      price,
    });

    return res.json(registration);
  }

  async delete(req, res) {
    const registration = await Registration.findOne({
      where: { student_id: req.params.id },
    });

    if (!registration) {
      return res
        .status(400)
        .json({ error: 'This registration does not exists' });
    }

    registration.destroy();

    return res.json({ message: `The registration was deleted!` });
  }
}

export default new RegistrationController();
