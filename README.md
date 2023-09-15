# Client library for [TheAuthAPI](https://theauthapi.com/)

**Contents**

- [Client library for TheAuthAPI](#client-library-for-theauthapi)
  - [Installation](#installation)
  - [Configuration](#configuration)
    - [Imports](#imports)
      - [CommonJS](#commonjs)
      - [ES Modules](#es-modules)
  - [Usage](#usage)
    - [Example: Validating an API-Key](#example-validating-an-api-key)
    - [Example: Listing API-keys](#example-listing-api-keys)
    - [Example: Listing the projects of an account](#example-listing-the-projects-of-an-account)
    - [Example: Listing projects and associated API-Keys](#example-listing-projects-and-associated-api-keys)
    - [Example: Creating an API-Key](#example-creating-an-api-key)
    - [Example: Rotating an API-Key](#example-rotating-an-api-key)
    - [Handling Errors](#handling-errors)
      - [ApiRequestError](#apirequesterror)
      - [ApiResponseError](#apiresponseerror)
      - [Example: Getting a key throws an ApiResponseError if the key is invalid](#example-getting-a-key-throws-an-apiresponseerror-if-the-key-is-invalid)
      - [Error](#error)
      - [Handling Errors the Right Way](#handling-errors-the-right-way)
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

You'll need to configure the library with your `access key` and `account id`, you can grab these from [TheAuthAPI](https://app.theauthapi.com) dashboard.

For further instructions on creating an account, check out our [how to guides](https://support.theauthapi.com/).

### Imports

#### CommonJS

```javascript
const TheAuthAPI = require("theauthapi").default;
```

#### ES Modules

```typescript
import TheAuthAPI from "theauthapi";
```

initialize the client using your access key:

```javascript
const theAuthAPI = new TheAuthAPI("YOUR_ACCESS_KEY");
```

You can also provide custom options:

```javascript
const theAuthAPI = new TheAuthAPI("YOUR_ACCESS_KEY", {
  retryCount: 2,
});
```

**Full option types:**

```typescript
type Options = {
  // server url
  host?: string;
  // number of retries before failing
  retryCount?: number;
};
```

## Usage

After initiating the client, you can access endpoint methods using the following pattern:
`[object instance].[endpoint].[method]`

For example, getting the projects for an account would be: `theAuthApiClient.projects.getProjects("ACCOUNT_ID")`,

Similarly, getting the api keys would be:
`theAuthApiClient.apiKeys.getKeys("PROJECT_ID")`

| endpoint  | attribute | example                                       |
| --------- | --------- | --------------------------------------------- |
| /api-keys | apiKeys   | `client.apiKeys.createKey("MY_KEY")`          |
| /projects | projects  | `client.projects.createProject("MY_PROJECT")` |
| /accounts | accounts  | `client.accounts.createAccount("MY_ACCOUNT")` |

For details on each endpoint accepted values, please reference these docs: [docs.theauthapi.com](https://docs.theauthapi.com/)

All methods return a promise containing the returned JSON as a javascript object. Each method of an endpoint maps HTTP methods to

| HTTP Method | method name | example                                                                   |
| ----------- | ----------- | ------------------------------------------------------------------------- |
| POST        | create\*    | `client.apiKeys.createKey({ name: "KEY_NAME", projectId: "PROJECT_ID" })` |
| GET         | get\*       | `client.apiKeys.getKeys()`                                                |
| DELETE      | delete\*    | `client.apiKeys.deleteKey("MY_KEY")`                                      |
| PATCH       | update\*    | `client.apiKeys.updateKey("MY_KEY", { name: "UPDATED_KEY_NAME" })`        |

#### Example: Validating an API-Key

You can easily validate an API key using `apiKeys.isValidKey` which returns `true` if the key is valid, `false` otherwise.
`isValidKey` throws an `ApiRequestError` if there's a network issue, it's advised to wrap it in a `try/catch` to handle the potential error

```javascript
theAuthAPI.apiKeys
  .isValidKey("API_KEY")
  .then((isValidKey) => {
    if (isValidKey) {
      console.log("The API is valid!");
    } else {
      console.log("Invalid API key!");
    }
  })
  .catch((error) => {
    // handle network error
  });
```

**Using async/await**

```javascript
try {
  const isValidKey = await theAuthAPI.apiKeys.isValidKey("API_KEY");
  if (isValidKey) {
    console.log("The API is valid!");
  } else {
    console.log("Invalid API key!");
  }
} catch (error) {
  // handle network error
}
```

**Note:** If you want to consume the API key and get the API key entity in return, you can use `apiKeys.authenticateKey` which returns an ApiKey.

#### Example: Listing API-keys

```javascript
theAuthAPI.apiKeys
  .getKeys()
  .then((keys) => console.log(keys))
  .catch((error) => console.log(error));
```

**Using async/await**

```javascript
try {
  const keys = await theAuthAPI.apiKeys.getKeys();
} catch (error) {
  console.log(error);
}
```

**Filtering API Keys**: You can filter the listed API keys by passing an object of type filter as an argument to `getKeys`

```typescript
type ApiKeyFilter = {
  projectId?: string;
  name?: string;
  customAccountId?: string | null;
  customUserId?: string | null;
  isActive?: boolean;
};
```

**Example**: filtering api-keys with a specific `projectId` where the keys are not active

```javascript
try {
  const keys = await theAuthAPI.apiKeys.getKeys({
    projectId: "PROJECT_ID",
    isActive: false,
  });
} catch (error) {
  console.log(error);
}
```

**NOTE** that if your access key is at account level, you need to specify `projectId` when listing the API keys:
`getKeys({ projectId: "PROJECT_ID" })`, otherwise if your access key is created at project level, you don't have to specify `projectId`,
the access key's `projectId` will be used to get the API-keys (i.e. you'll see only the keys of the project your access key is created against)

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

#### Example: Listing projects and associated API-Keys

```javascript
async function getProjectsWithKeys(accountId: string) {
  try {
    const projects = await theAuthAPI.projects.getProjects(accountId);
    const projectsKeys = projects.map(async (project) => {
      const keys = await theAuthAPI.apiKeys.getKeys(project.id);
      return { project, keys };
    });
    return await Promise.all(projectsKeys);
  } catch (error) {
    // handle error
  }
}
```

#### Example: Creating an API-Key

```javascript
theAuthAPI.apiKeys
  .createKey({
    projectId: "PROJECT_ID",
    customMetaData: { metadata_val: "value to store" },
    customAccountId: "[any info you want]",
    name: "[any info you want e.g. name of customer or the key]",
  })
  .then((key) => console.log("Key created > ", key))
  .catch((error) => console.log("Couldn't make the key", error));
```

**Using async/await**

```javascript
try {
  const key = await theAuthAPI.apiKeys.createKey({
    projectId: "PROJECT_ID",
    customMetaData: { metadata_val: "value to store" },
    customAccountId: "[any info you want]",
    name: "[any info you want e.g. name of customer or the key]",
  });
  console.log("Key created > ", key);
} catch (error) {
  console.log("Couldn't make the key ", error);
}
```

#### Example: Rotating an API-Key

When you need to quickly and securely rotate a compromised key, while preserving the key's metadata, use the `rotateKey` method. This method while clone your key and return you with a new one.

```javascript
theAuthAPI.apiKeys
  .rotateKey("API_KEY")
  .then((key) => console.log("Rotated Key > ", key))
  .catch((error) => console.log("Couldn't rotate the key", error));
```

**Using async/await**

```javascript
try {
  const key = await theAuthAPI.apiKeys.createKey("API_KEY");
  console.log("Rotated Key > ", key);
} catch (error) {
  console.log("Couldn't rotate the key", error);
}
```

**NOTE** In the background, this marks the old key as inactive and issues you with a new key. Any requests to the old key will be instantly blocked.

### Handling Errors

[comment]: <> (All methods that return a promise throw 3 types of errors)

##### ApiRequestError

Thrown when there's a network or a connectivity issue, for example, if the client didn't establish any network connection with the host

```
ApiRequestError: getaddrinfo EAI_AGAIN api.theauthapi.com
```

##### ApiResponseError

Thrown when the server responds with an HTTP status code not in the `2xx` range. `ApiRequestError` provides two properties to distinguish the type of the error

- `statusCode` HTTP status code
- `message` the message the server responded with in the body

This is the most common thrown error, you should expect and handle it each time you use any of the library methods

##### Example: Getting a key throws an ApiResponseError if the key is invalid

If you try to GET an invalid key using `apiKeys.getKey("invalid-key")`, the server responds with a 404 error and an `ApiResponseError` is thrown

```
ApiResponseError: (404): Invalid client key
```

"404" is the `statusCode`, "Invalid client Key" is the `message`, you can access these properties using `error.statusCode` and `error.message` respectively

##### Error

Unknown error, just a normal javascript error

#### Handling Errors the Right Way

Since all the possible thrown errors are instances of classes, we can check the type of the thrown error and handle it accordingly

```javascript
try {
  const key = await theAuthAPI.apiKeys.getKey("KEY");
} catch (error) {
  if (error instanceof ApiResponseError) {
    // handle response error
  }
  if (error instanceof ApiRequestError) {
    // handle network error
  }
  // unknown error
  throw error;
}
```

### Typescript

This library is written in [Typescript](https://www.typescriptlang.org/), types are provided out of the box.

Example of usage with Typescript:

```typescript
import TheAuthAPI from "theauthapi";
import { Project } from "theauthapi/types";

const client = new TheAuthAPI("ACCESS_KEY");

async function getProjectsIds(accountId: string): Promise<string[]> {
  const projects: Project[] = await client.projects.getProjects(accountId);
  return projects.map((project) => project.name);
}
```

### 📙 Further Reading

- Create your account [https://theauthapi.com](https://theauthapi.com)
- View our [Knowledge Base](https://thatapicompany.notion.site/The-Auth-API-Knowledge-Base-21660cee84e640729714fad43d9ce546) help centre
- Read our [API docs](https://docs.theauthapi.com)
- Articles on best Auth practice - [https://theauthapi.com/articles](https://theauthapi.com/articles)
- Meet the team behind The Auth API - [That API Company](https://thatapicompany.com/)
