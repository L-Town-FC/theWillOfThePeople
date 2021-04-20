module.exports = {
    name: 'ping',
    description: 'says pong',
    execute(message, fauna_token, master){
        message.channel.send('pong');
        //Test(fauna_token, master)
        //Test2(fauna_token, master)
    }
}


async function Test(fauna_token, master){
    const faunadb = require('faunadb')
    const fauna_client = new faunadb.Client({ secret: fauna_token })
    const q = faunadb.query

    console.log(master)
fauna_client.query(
      q.Update(q.Ref(q.Collection("master"), "296421904547316230"), {
        data: 
          master
      }
      )
)

}

