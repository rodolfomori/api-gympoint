// import { format, parseISO } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrderAnswer {
  get key() {
    return 'helpOrderAnswer';
  }

  async handle({ data }) {
    const { student, question, answer } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Sua solicitação foi responidade pela equipe GymPoint',
      template: 'helpOrderAnswer',
      context: {
        student: student.name,
        question: question.question,
        answer,
      },
    });
  }
}

export default new HelpOrderAnswer();
