import fetch from "node-fetch";
import Cors from 'cors'

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST'],
  origin: '*',
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware( req, res, fn ) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(req, res) {
  const { body, method } = req;

  // Run the middleware
  await runMiddleware(req, res, cors)

  // Extract the email and captcha code from the request body
  if (method === "POST") {
    console.log(body)
  }

  try {
    // Ping the google recaptcha verify API to verify the captcha code you received
    const config = {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": '*',
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Bearer 154935645fdd40d88096faa4eeaf8999"
      },
      // mode: 'no-cors',
      body: JSON.stringify({
        "field_143047240": "2fromnextjs",
        "field_143047326": "s",
        "field_143048112": "s",
        "field_143048125": "s",
        "field_143048108": "s",
        "field_143048126": "s",
        "field_143048302": true,
        "field_143048305": true,
        "meta": {
          "createdOn": "2023-04-18T00:58:38.318Z"
        }
      }),
    };
    // fetch('https://competition.nine.com.au/enter-phase/436', config)
        fetch('https://www.formstack.com/api/v2/form/5252692/submission.json', config)
          .then((response) => response.json())
          .then((json) => {
            console.log('data', json);

          })
  } catch(err) {
    // console.log(error);
    return res.status(422).json({ message: "Something went wrong" });
  }
  // Return 404 if someone pings the API with a method other than
  // POST
  return res.status(404).send("Not found");
}