# Client library for [TheAuthAPI](https://theauthapi.com/)

**Contents**
- [Client library for TheAuthAPI](#client-library-for-theauthapi)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Usage](#usage)
      - [Example: Authenticating an api-key](#example-authenticating-an-api-key)
      - [Example: Listing the projects of an account](#example-listing-the-projects-of-an-account)
      - [Example: Listing projects and associated API Keys](#example-listing-projects-and-associated-api-keys)
      - [Example: Creating an API Key](#example-creating-an-api-key)
      - [Typescript](#typescript)
    - [📙 Further Reading](#-further-reading)

**Scalable API Key Management and Auth Control**
Secure your API with best in class API Key management, user access, all with great analytics.

## Installation

This library is published on [npm](https://www.npmjs.com/package/theauthapi), you can add it as a dependency using the following
command

```bash
npm install theauthapi
# or
yarn add theauthapi
```

## Configuration

You'll need to configure the library with your `access key` and `account id`, you can grab these from [TheAuthApi](https://app.theauthapi.com/auth/signup) dashboard.

```javascript
const TheAuthAPI = require("theauthapi").default;
const theAuthAPI = new TheAuthAPI("YOUR_ACCESS_KEY");
```
For futher instructions on creating an account, checkout [these docs](https://thatapicompany.notion.site/The-Auth-API-Knowledge-Base-21660cee84e640729714fad43d9ce546).

You can also provide custom options:

```javascript
const theAuthAPI = new TheAuthAPI("YOUR_ACCESS_KEY", {
  timeout: 3600,
  retryCount: 2,
});
```

**Full option types:**
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
After initiating the client, you can access endpoint methods using the following pattern:
`[object instance].[endpoint].[method]`

For example, getting the projects for an account would be: `theAuthApiClient.projects.getProjects("ACCOUNT_ID")`, 

Similarly getting the api keys would be:
`theAuthApiClient.apiKeys.getKeys("PROJECT_ID")`


| endpoint  | attribute | example                                       |
| --------- | --------- | --------------------------------------------- |
| /api-keys | apiKeys   | `client.apiKeys.createKey("MY_KEY")`          |
| /projects | projects  | `client.projects.createProject("MY_PROJECT")` |
| /accounts | accounts  | `client.accounts.createAccount("MY_ACCOUNT")` |

For details on each endpoints accepted values, please reference these docs: [**COMING SOON**]

All methods return a promise containing the returned JSON as a javascript object. Each method of an endpoint maps HTTP methods to

| HTTP Method | method name | example                                       |
| ----------- | ----------- | --------------------------------------------- |
| POST        | create\*    | `client.projects.createProject("PROJECT_NAME")`          |
| GET         | get\*       | `client.projects.getProject("PROJECT_ID")` |
| DELETE      | delete\*    | `client.projects.deleteProject("PROJECT_ID")` |
| PATCH       | update\*    | `client.projects.updateProject("PROJECT_ID", {name: "updated project name"})` |

#### Example: Authenticating an api-key

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

**Using async/await**

```javascript
try {
  const key = await theAuthAPI.apiKeys.authenticateKey("API_KEY");
  console.log("valid key:", key.key);
} catch (error) {
  console.log("invalid key!");
}
```

#### Example: Listing the projects of an account

```javascript
theAuthAPI.projects
  .getProjects("ACCOUNT_ID")
  .then((projects) => console.log(projects))
  .catch((error) => console.log(error));
```

**Using async/await**

```javascript
try {
  const projects = await client.projects.getProjects("ACCOUNT_ID");
} catch (error) {
  console.log(error);
}
```

#### Example: Listing projects and associated API Keys

```javascript
  const projects = await theAuthAPI.projects.getProjects(
    "ACCOUNT_ID"
  );
  let allProjects = [];
  for (let i = 0; i < projects.length; i++) {
    allProjects.push(
      theAuthAPI.apiKeys.getKeys(projects[i].id).then((data: any) => {
        return { project: projects[i], data: data };
      })
    );
  }
  const allKeys = await Promise.all(allProjects).then((results: any) => {
    return results;
  });
```

#### Example: Creating an API Key

```Javascript
    .createKey({
      projectId: "PROJECT_ID",
      customMetaData: { metadata_val: 'value to store' },
      customAccountId: "[any info you want]",
      name: "[any info you want e.g. name of customer or the key]",
    })
    .then((createkey) => console.log("Key created > ", createkey))
    .catch((error) => console.log("Couldn't make the key", error));
``` 
**Using async/await**

```Javascript
try {
  const createkey = await theAuthAPI.apiKeys.createKey({
    projectId: "PROJECT_ID",
    customMetaData: { metadata_val: 'value to store' },
    customAccountId: "[any info you want]",
    name: "[any info you want e.g. name of customer or the key]",
  });
   console.log("Key created > ", createkey);
  } catch (error) {
  console.log("Couldn't make the key ", error);
}
 
```

#### Typescript

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

### 📙 Further Reading

* Create your account https://theauthapi.com
* View our [Knowledge Base](https://thatapicompany.notion.site/The-Auth-API-Knowledge-Base-21660cee84e640729714fad43d9ce546) help centre
* Articles on best Auth practice - https://theauthapi.com/articles
* Meet the team behind The Auth API - [That API Company](https://thatapicompany.com/).