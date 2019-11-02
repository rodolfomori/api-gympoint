// import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async show(req, res) {
    const helpOrders = await HelpOrder.findOne({
      where: { student_id: req.params.id },
    });
    return res.json(helpOrders);
  }

  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: { answer: null },
    });
    return res.json(helpOrders);
  }

  async store(req, res) {
    const { question } = req.body;
    const student_id = req.params.id;
    const student = Student.findByPk(student_id);

    // Check if student exists
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const helpOrder = await HelpOrder.create({
      student_id,
      question,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
