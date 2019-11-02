import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class UpdateRegistrationMail {
  get key() {
    return 'UpdateRegistrationMail';
  }

  async handle({ data }) {
    const { student, plan, start_date, end_date, price } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Seu Plano foi Atualizado na GymPoint',
      template: 'helpOrderAnswer',
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

export default new UpdateRegistrationMail();
