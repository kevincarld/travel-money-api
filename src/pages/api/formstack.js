import fetch from "node-fetch";
import Cors from 'cors'

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST'],
  origin: ['brandedcontent.nine.com.au'],
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
    const config = {
      method: "POST",
      headers: {
        accept: 'application/json',
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Bearer 154935645fdd40d88096faa4eeaf8999"
      },
      body: JSON.stringify(body),
    };
    //await fetch('https://competition.nine.com.au/enter-phase/436', config)
    await fetch('https://www.formstack.com/api/v2/form/5252692/submission.json', config)
      .then(response => response.json())
      .then(response => {
        // console.log(response);
        res.status(200).json({...response, success: true});
      })
      .catch(err => console.error(err));
  } else {

    // Return 404 if someone pings the API with a method other than
    // POST
    return res.status(404).send("Invalid request sir");
  }

}