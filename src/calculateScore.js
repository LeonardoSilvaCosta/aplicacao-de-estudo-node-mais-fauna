const faunaQueries = require("./faunaQueries");
const formQuestionsList = require("./formQuestionsList");
module.exports = calculateScoreForEachForm = async (getResponses) => {
  const responses = await getResponses();
  const scoresListData = await faunaQueries.retrieveScores();
  const scoresList = scoresListData.data.map((e) => {
    return e.data;
  });

  const formToCalculateScore = responses.map((form) => {
    const containsElement = scoresList.some(
      (scoreData) =>
        scoreData.psychosocialRecord ===
        form.answers["096f3bf0"].textAnswers.answers[0].value
    );
    if (containsElement) return;

    return form;
  });

  const totalScore = formToCalculateScore.map((form) => {
    if (form) {
      const identification =
        form.answers["66ea8d74"].textAnswers.answers[0].value;
      const psychosocialRecord =
        form.answers["096f3bf0"].textAnswers.answers[0].value;
      let score = 0;

      formQuestionsList.map((item) => {
        if (item.description === "eAtendidoSae") {
          switch (form.answers[item.id].textAnswers.answers[0].value) {
            case "Sim":
              score = score + 1;
              break;
            case "Não":
              score = score;
              break;
            default:
              "Opção inválida";
              break;
          }
        }

        if (item.description === "meios") {
          switch (form.answers[item.id].textAnswers.answers[0].value) {
            case "Arma de fogo":
              score = score + 3;
              break;
            case "Arma branca":
              score = score + 2;
              break;
            case "Atropelamento":
              score = score + 1;
              break;
            default:
              "opção inválida";
              break;
          }
        }

        if (item.description === "motivacao") {
          switch (form.answers[item.id].textAnswers.answers[0].value) {
            case "Funcional direta":
              score = score + 3;
              break;
            case "Funcional indireta":
              score = score + 2;
              break;
            case "Pessoal":
              score = score + 1;
              break;
            default:
              "opção inválida";
              break;
          }
        }

        if (item.description === "localMoradia") {
          switch (form.answers[item.id].textAnswers.answers[0].value) {
            case "Conjunto habitacional":
              score = score + 1;
              break;
            case "Área de ocupação":
              score = score + 3;
              break;
            case "Loteamento":
              score = score + 2;
              break;
            default:
              "opção inválida";
              break;
          }
        }

        if (item.description === "temDespesasSaudePropria") {
          switch (form.answers[item.id].textAnswers.answers[0].value) {
            case "Sim":
              score = score + 1;
              break;
            case "Não":
              score = score;
              break;
            default:
              "opção inválida";
              break;
          }
        }

        if (item.description === "temDespesasSaudeDependente") {
          switch (form.answers[item.id].textAnswers.answers[0].value) {
            case "Sim":
              score = score + 1;
              break;
            case "Não":
              score = score;
              break;
            default:
              "opção inválida";
              break;
          }
        }
      });

      const scoreData = { identification, psychosocialRecord, score };

      faunaQueries.saveScore(scoreData);

      return scoreData;
    }
  });

  return totalScore;
};
