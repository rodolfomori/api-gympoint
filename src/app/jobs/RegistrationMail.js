import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { student, plan, start_date, end_date, price } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Seja Bem-Vindo a GymPoint',
      template: 'registration',
      context: {
        student: student.name,
        plan: plan.title,
        startDate: format(parseISO(start_date), "'dia' dd 'de' MMMM", {
          locale: pt,
        }),
        endDate: format(parseISO(end_date), "'dia' dd 'de' MMMM", {
          locale: pt,
        }),
        price,
      },
    });
  }
}

export default new RegistrationMail();
