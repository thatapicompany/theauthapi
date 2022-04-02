import TheAuthAPI from "../index";
import express from "express"
const version = require('../../package.json').version

const port = 4063

const createClient = (options?: any)=> {
  options = Object.assign({
    host: `http://localhost:${port}`
  }, options)
  return new TheAuthAPI('writeKey', options)
}


beforeAll(() => {
  express()
      .get('/api-keys/:key', (req, res) => {
        const key = req.params.key;
        const writeKey = req.header('Authorization')
        if (!writeKey) {
          return res.status(400).json({
            error: { message: 'missing write key' }
          })
        }

        if (!key) {
          return res.status(400).json({
            error: { message: 'missing api-key'}
          })
        }

        const ua = req.headers['user-agent']
        if (ua !== `theauthapi-client-node/${version}`) {
          return res.status(400).json({
            error: { message: 'invalid user-agent' }
          })
        }

        return res.json({
          key: "KGTSsxbDndjRRcpJGuQQp2or9UmQkqRrVQpCWgQruIXnvnNatmfdmOTcsgYnNwnH",
          name: "My customers first Api Key",
          customMetaData: {},
          customAccountId: null,
          env: "live",
          createdAt: "2022-03-16T10:34:23.353Z",
          updatedAt: "2022-03-16T10:34:23.353Z"
        })
      })
      .listen(port)
})


it('should auth api-key', async () => {
  const client = createClient();
  const data = await client.authenticateAPIKeyV2('123');
  expect(data.name).toEqual('My customers first Api Key')
  expect(data.key).toEqual("KGTSsxbDndjRRcpJGuQQp2or9UmQkqRrVQpCWgQruIXnvnNatmfdmOTcsgYnNwnH")
  expect(data.name)
})