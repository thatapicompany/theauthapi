# theauthapi

Client library for [TheAuthAPI](https://theauthapi.com/)

## Installation

This library is published on [npm](https://www.npmjs.com/), you can add it as a dependency using the following
command

```bash
npm install theauthapi
# or
yarn add theauthapi
```

## Configuration

You'll need to configure the library with your access key, you can grab it from [TheAuthApi](https://theauthapi.com) dashboard

```javascript
const TheAuthAPI = require("theauthapi-test").default;
const theAuthAPI = new TheAuthAPI("YOUR_ACCESS_KEY");
```

You can also provide custom options

```javascript
const theAuthAPI = new TheAuthAPI("YOUR_ACCESS_KEY", {
  timeout: 3600,
  retryCount: 2,
});
```

Where options is

```typescript
type Options = {
  // server url
  host?: string;
  // request timeout in ms
  timeout?: string | number;
  // number of retries before failing
  retryCount?: number;
};
```

## Usage

After initiating the client, you can access endpoint methods using the following pattern
`[object instance].[endpoint].[method]`

for example, getting the projects for an account would be `theAuthApiClient.projects.getProjects("ACCOUNT_ID")`, similarly
getting the api keys would be `theAuthApiClient.apiKeys.getKeys("PROJECT_ID")`

| endpoint  | attribute | example                                       |
| --------- | --------- | --------------------------------------------- |
| /api-keys | apiKeys   | `client.apiKeys.createKey("MY_KEY")`          |
| /projects | projects  | `client.projects.createProject("MY_PROJECT")` |
| /accounts | accounts  | `client.accounts.createAccount("MY_ACCOUNT")` |

All methods return a promise containing the returned JSON as a javascript object. Each method of an endpoint maps HTTP methods to

| HTTP Method | method name | example                                       |
| ----------- | ----------- | --------------------------------------------- |
| POST        | create\*    | `client.projects.createProject("PROJECT_NAME")`          |
| GET         | get\*       | `client.projects.getProject("PROJECT_ID")` |
| DELETE      | delete\*    | `client.projects.deleteProject("PROJECT_ID")` |
| PATCH       | update\*    | `client.projects.updateProject("PROJECT_ID", {name: "updated project name"})` |

### Example: Authenticating an api-key

```javascript
theAuthAPI.apiKeys
  .authenticateKey("API_KEY")
  .then((key) => {
    // the key is valid
    console.log(key);
  })
  .catch((error) => {
    // the key is invalid
    console.log("invalid key");
  });
```

using async/await

```javascript
try {
  const key = await theAuthAPI.apiKeys.authenticateKey(
    "live_6RfG6w9gXi9ixbPo43gkDeBR2jhtP9QAGsixUaxr1Lgacjchgy7hIYtH2zOZp5Q"
  );
  console.log("valid key:", key.key);
} catch (error) {
  console.log("invalid key!");
}
```

### Example: Listing the projects of an account

```javascript
theAuthAPI.projects
  .getProjects("ACCOUNT_ID")
  .then((projects) => console.log(projects))
  .catch((error) => console.log(error));
```

using async/await

```javascript
try {
  const projects = await client.projects.getProjects("ACCOUNT_ID");
} catch (error) {
  console.log(error);
}
```

## Typescript

This library is written in [Typescript](https://www.typescriptlang.org/), types are provided out of the box.

Example of usage with Typescript:

```typescript
import TheAuthAPI from "theauthapi";
import { Project } from "theauthapi/types";

const client = new TheAuthAPI("ACCESS_KEY");

async function getProjects(accountId: string): Promise<string[]> {
  const projects: Project[] = await client.projects.getProjects(accountId);
  return projects.map((project) => project.name);
}
```

### See Also

our API [documentation](https://theauthapi.com)