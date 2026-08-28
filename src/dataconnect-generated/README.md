# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListAllActiveAnnouncements*](#listallactiveannouncements)
  - [*GetLatestAnalyticsReport*](#getlatestanalyticsreport)
- [**Mutations**](#mutations)
  - [*CreateAdmin*](#createadmin)
  - [*LogMetricEvent*](#logmetricevent)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListAllActiveAnnouncements
You can execute the `ListAllActiveAnnouncements` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllActiveAnnouncements(options?: ExecuteQueryOptions): QueryPromise<ListAllActiveAnnouncementsData, undefined>;

interface ListAllActiveAnnouncementsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllActiveAnnouncementsData, undefined>;
}
export const listAllActiveAnnouncementsRef: ListAllActiveAnnouncementsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllActiveAnnouncements(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllActiveAnnouncementsData, undefined>;

interface ListAllActiveAnnouncementsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllActiveAnnouncementsData, undefined>;
}
export const listAllActiveAnnouncementsRef: ListAllActiveAnnouncementsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllActiveAnnouncementsRef:
```typescript
const name = listAllActiveAnnouncementsRef.operationName;
console.log(name);
```

### Variables
The `ListAllActiveAnnouncements` query has no variables.
### Return Type
Recall that executing the `ListAllActiveAnnouncements` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllActiveAnnouncementsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllActiveAnnouncementsData {
  announcements: ({
    title: string;
    content: string;
    createdAt: TimestampString;
    author?: {
      email: string;
    };
  })[];
}
```
### Using `ListAllActiveAnnouncements`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllActiveAnnouncements } from '@dataconnect/generated';


// Call the `listAllActiveAnnouncements()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllActiveAnnouncements();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllActiveAnnouncements(dataConnect);

console.log(data.announcements);

// Or, you can use the `Promise` API.
listAllActiveAnnouncements().then((response) => {
  const data = response.data;
  console.log(data.announcements);
});
```

### Using `ListAllActiveAnnouncements`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllActiveAnnouncementsRef } from '@dataconnect/generated';


// Call the `listAllActiveAnnouncementsRef()` function to get a reference to the query.
const ref = listAllActiveAnnouncementsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllActiveAnnouncementsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.announcements);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.announcements);
});
```

## GetLatestAnalyticsReport
You can execute the `GetLatestAnalyticsReport` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getLatestAnalyticsReport(options?: ExecuteQueryOptions): QueryPromise<GetLatestAnalyticsReportData, undefined>;

interface GetLatestAnalyticsReportRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetLatestAnalyticsReportData, undefined>;
}
export const getLatestAnalyticsReportRef: GetLatestAnalyticsReportRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLatestAnalyticsReport(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetLatestAnalyticsReportData, undefined>;

interface GetLatestAnalyticsReportRef {
  ...
  (dc: DataConnect): QueryRef<GetLatestAnalyticsReportData, undefined>;
}
export const getLatestAnalyticsReportRef: GetLatestAnalyticsReportRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLatestAnalyticsReportRef:
```typescript
const name = getLatestAnalyticsReportRef.operationName;
console.log(name);
```

### Variables
The `GetLatestAnalyticsReport` query has no variables.
### Return Type
Recall that executing the `GetLatestAnalyticsReport` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLatestAnalyticsReportData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetLatestAnalyticsReportData {
  analyticsReports: ({
    reportName: string;
    totalCount: Int64String;
    dateRange: string;
  })[];
}
```
### Using `GetLatestAnalyticsReport`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLatestAnalyticsReport } from '@dataconnect/generated';


// Call the `getLatestAnalyticsReport()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLatestAnalyticsReport();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLatestAnalyticsReport(dataConnect);

console.log(data.analyticsReports);

// Or, you can use the `Promise` API.
getLatestAnalyticsReport().then((response) => {
  const data = response.data;
  console.log(data.analyticsReports);
});
```

### Using `GetLatestAnalyticsReport`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLatestAnalyticsReportRef } from '@dataconnect/generated';


// Call the `getLatestAnalyticsReportRef()` function to get a reference to the query.
const ref = getLatestAnalyticsReportRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLatestAnalyticsReportRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.analyticsReports);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.analyticsReports);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateAdmin
You can execute the `CreateAdmin` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAdmin(): MutationPromise<CreateAdminData, undefined>;

interface CreateAdminRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateAdminData, undefined>;
}
export const createAdminRef: CreateAdminRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAdmin(dc: DataConnect): MutationPromise<CreateAdminData, undefined>;

interface CreateAdminRef {
  ...
  (dc: DataConnect): MutationRef<CreateAdminData, undefined>;
}
export const createAdminRef: CreateAdminRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAdminRef:
```typescript
const name = createAdminRef.operationName;
console.log(name);
```

### Variables
The `CreateAdmin` mutation has no variables.
### Return Type
Recall that executing the `CreateAdmin` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAdminData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAdminData {
  admin_insert: Admin_Key;
}
```
### Using `CreateAdmin`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAdmin } from '@dataconnect/generated';


// Call the `createAdmin()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAdmin();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAdmin(dataConnect);

console.log(data.admin_insert);

// Or, you can use the `Promise` API.
createAdmin().then((response) => {
  const data = response.data;
  console.log(data.admin_insert);
});
```

### Using `CreateAdmin`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAdminRef } from '@dataconnect/generated';


// Call the `createAdminRef()` function to get a reference to the mutation.
const ref = createAdminRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAdminRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.admin_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.admin_insert);
});
```

## LogMetricEvent
You can execute the `LogMetricEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
logMetricEvent(vars: LogMetricEventVariables): MutationPromise<LogMetricEventData, LogMetricEventVariables>;

interface LogMetricEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogMetricEventVariables): MutationRef<LogMetricEventData, LogMetricEventVariables>;
}
export const logMetricEventRef: LogMetricEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
logMetricEvent(dc: DataConnect, vars: LogMetricEventVariables): MutationPromise<LogMetricEventData, LogMetricEventVariables>;

interface LogMetricEventRef {
  ...
  (dc: DataConnect, vars: LogMetricEventVariables): MutationRef<LogMetricEventData, LogMetricEventVariables>;
}
export const logMetricEventRef: LogMetricEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the logMetricEventRef:
```typescript
const name = logMetricEventRef.operationName;
console.log(name);
```

### Variables
The `LogMetricEvent` mutation requires an argument of type `LogMetricEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LogMetricEventVariables {
  eventType: string;
}
```
### Return Type
Recall that executing the `LogMetricEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LogMetricEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LogMetricEventData {
  metricEvent_insert: MetricEvent_Key;
}
```
### Using `LogMetricEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, logMetricEvent, LogMetricEventVariables } from '@dataconnect/generated';

// The `LogMetricEvent` mutation requires an argument of type `LogMetricEventVariables`:
const logMetricEventVars: LogMetricEventVariables = {
  eventType: ..., 
};

// Call the `logMetricEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await logMetricEvent(logMetricEventVars);
// Variables can be defined inline as well.
const { data } = await logMetricEvent({ eventType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await logMetricEvent(dataConnect, logMetricEventVars);

console.log(data.metricEvent_insert);

// Or, you can use the `Promise` API.
logMetricEvent(logMetricEventVars).then((response) => {
  const data = response.data;
  console.log(data.metricEvent_insert);
});
```

### Using `LogMetricEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, logMetricEventRef, LogMetricEventVariables } from '@dataconnect/generated';

// The `LogMetricEvent` mutation requires an argument of type `LogMetricEventVariables`:
const logMetricEventVars: LogMetricEventVariables = {
  eventType: ..., 
};

// Call the `logMetricEventRef()` function to get a reference to the mutation.
const ref = logMetricEventRef(logMetricEventVars);
// Variables can be defined inline as well.
const ref = logMetricEventRef({ eventType: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = logMetricEventRef(dataConnect, logMetricEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.metricEvent_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.metricEvent_insert);
});
```

