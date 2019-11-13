import Mail from '../../lib/Mail';

class AnswerHelpRequestMail {
  get key() {
    return 'AnswerHelpRequestMail';
  }

  async handle({ data }) {
    const { student, question, answer } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Resposta ao pedido de auxílio',
      template: 'answerHelpRequest',
      context: {
        studentName: student.name,
        question,
        answer,
      },
    });
  }
}

export default new AnswerHelpRequestMail();
