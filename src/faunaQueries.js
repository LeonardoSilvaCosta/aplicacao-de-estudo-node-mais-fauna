const faunadb = require("faunadb");
const faunaClient = require("./fauna");

q = faunadb.query;

module.exports = {
  saveScore: async function saveScoreAndIdentification(totalScore) {
    try {
      const data = await faunaClient.query(
        q.Create(q.Collection("form_data"), {
          data: {
            identification: totalScore.identification,
            psychosocialRecord: totalScore.psychosocialRecord,
            score: totalScore.score,
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  },
  retrieveScores: async function listScoresAndIdentificationsByScoreDesc(score = 10, ref = "338737482730308178") {
    console.log(score, ref)
    try {
      const responses = await faunaClient.query(
        q.Map(
          q.Paginate(q.Match(q.Index("form_sort_by_score_desc")), {
            size: 10,
            after:
            [
              score, q.Ref(q.Collection("form_data"), ref),
            ]
          }),
          q.Lambda(["score", "ref"], q.Get(q.Var("ref")))
        )
      );

      return responses;
    } catch (error) {
      return error;
    }
  },
  deleteScore: async function deleteScoreAndIdentification(ref) {
    faunaClient
      .query(q.Delete(q.Ref(q.Collection("form_data"), ref)))
      // .then((ret) => console.log(ret))
      .catch((err) =>
        console.error(
          "Error: [%s] %s: %s",
          err.name,
          err.message,
          err.errors()[0].description
        )
      );
  },
};
