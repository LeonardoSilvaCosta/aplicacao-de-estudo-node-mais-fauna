const faunaQuerie = require("./faunaQueries"); 
const calculateScore = require("./calculateScore");

const { google } = require("googleapis");

const express = require("express");
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: '*'
}))

const getGoogleFormResponses = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: [
      "https://www.googleapis.com/auth/forms.body.readonly",
      "https://www.googleapis.com/auth/forms.responses.readonly",
    ],
  });

  const client = await auth.getClient();
  const forms = google.forms({ version: "v1", auth: client });
  const formId = "11DahP8CT-Azlq4sfcHxq-Qi5lCPl62Nf7HsEjkF_vKU";

  const allResponsesData = await forms.forms.responses.list({
    auth,
    formId,
  });

  const allResponses = allResponsesData.data.responses;

  return allResponses;
};

app.get("/scores", async (request, response) => {
  score = request.query.score;
  ref = request.query.ref;

  listScores = response.status(200).json(await faunaQuerie.retrieveScores(score && Number(score), ref && ref));
  return listScores;
});

app.post("/scores", async (request, response) => {
  return response
    .status(200)
    .json(await calculateScore(getGoogleFormResponses));
});

app.delete("/scores/:id", async(request, response) => {
  return response.status(204).json(faunaQuerie.deleteScore(request.params.id));
})

app.get("/teste", async(request, response) => {

  try {
    const responses = await faunaClient.query(
      q.Map(
        q.Paginate(q.Match(q.Index("form_sort_by_score_desc")),
        {
          size: 1,
          after: [
            10, q.Ref(q.Collection("form_data"), "338664596101399121"),
          ]
        }
        ),
        q.Lambda(
          ["score", "ref"],
          q.Get(q.Var("ref")))
      )
    );

    return response.status(200).json(responses);
  } catch (error) {
    return error;
  }
  
})


app.listen(3333, (req, res) => console.log("running on 3333"));
