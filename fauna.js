const faunaToken = process.env.FAUNASECRET;

const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({ secret: faunaToken });

const createP = client.query(
    q.Create(
      q.Collection('andrewTest'),
      { data: { testField: 'testValue' } }
    )
)

createP.then((response) => {
    console.log(response.ref); // Logs the ref to the console.
}).catch((err) => console.error(err))