import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  // async index(req, res) {
  //   const plans = await Plan.findAll({});
  //   return res.json(plans);
  // }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    const { title, duration, price } = await req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    // const planExists = await Plan.findOne({ where: { title: req.body.title } });

    // if (planExists) {
    //   return res.status(400).json({ error: 'Plan already exists.' });
    // }

    await Plan.create(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  //   async update(req, res) {
  //     const schema = Yup.object().shape({
  //       title: Yup.string(),
  //       duration: Yup.string(),
  //       price: Yup.string(),
  //     });

  //     if (!(await schema.isValid(req.body))) {
  //       return res.status(400).json({ error: 'Validations fails' });
  //     }

  //     const { title } = req.body;

  //     const plan = await Plan.findByPk(req.planId);

  //     if (title !== plan.title) {
  //       const planExists = await Plan.findOne({ where: { title } });

  //       if (planExists) {
  //         return res.status(400).json({ error: 'Plan already exists.' });
  //       }
  //     }

  //     const { id, name } = await plan.update(req.body);

  //     return res.json({
  //       id,
  //       name,
  //     });
  //   }
}

export default new PlanController();
