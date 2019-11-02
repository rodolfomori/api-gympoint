import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import HelpOrderAnswer from '../jobs/HelpOrderAnswer';
import Queue from '../../lib/Queue';

class HelpOrderAnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { answer } = req.body;
    const { id } = req.params;
    const question = await HelpOrder.findByPk(id);
    const { student_id } = question;
    const student = await Student.findByPk(student_id);

    // Check if student exists
    if (!question) {
      return res.status(400).json({ error: 'The question does not exists' });
    }

    await question.update({
      answer,
      answer_at: new Date(),
    });

    await Queue.add(HelpOrderAnswer.key, {
      student,
      question,
      answer,
    });

    return res.json(question);
  }
}

export default new HelpOrderAnswerController();
