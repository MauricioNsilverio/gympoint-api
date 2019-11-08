import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { student, plan, end_date, price } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula Gympoint efetuada!',
      template: 'enrollment',
      context: {
        studentName: student.name,
        planTitle: plan.title,
        planEndDate: format(
          parseISO(end_date),
          "'dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        planPrice: `R$${price}`,
      },
    });
  }
}

export default new EnrollmentMail();
