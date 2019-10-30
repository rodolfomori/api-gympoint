import * as Yup from 'yup';
import { Op } from 'sequelize';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({});
    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const planExists = await Plan.findOne({ where: { title: req.body.title } });
    if (planExists) {
      return res.status(400).json({ error: 'This plan is already registered' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().positive(),
      price: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const planExists = await Plan.findOne({
      where: {
        title: req.body.title,
        id: { [Op.not]: req.params.id },
      },
    });
    if (planExists) {
      return res.status(400).json({ error: 'This plan is already registered' });
    }

    const plan = await Plan.findByPk(req.params.id);
    // const plan = await Plan.findOne({ where: { title: req.body.id } });

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);
    const { title } = plan;

    plan.destroy();

    return res.json({ message: `The plan ${title} was deleted!` });
  }
}

export default new PlanController();
