import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Admin_Key {
  id: UUIDString;
  __typename?: 'Admin_Key';
}

export interface AnalyticsReport_Key {
  id: UUIDString;
  __typename?: 'AnalyticsReport_Key';
}

export interface Announcement_Key {
  id: UUIDString;
  __typename?: 'Announcement_Key';
}

export interface AppConfig_Key {
  id: UUIDString;
  __typename?: 'AppConfig_Key';
}

export interface CreateAdminData {
  admin_insert: Admin_Key;
}

export interface GetLatestAnalyticsReportData {
  analyticsReports: ({
    reportName: string;
    totalCount: Int64String;
    dateRange: string;
  })[];
}

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

export interface LogMetricEventData {
  metricEvent_insert: MetricEvent_Key;
}

export interface LogMetricEventVariables {
  eventType: string;
}

export interface MetricEvent_Key {
  id: UUIDString;
  __typename?: 'MetricEvent_Key';
}

interface ListAllActiveAnnouncementsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllActiveAnnouncementsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllActiveAnnouncementsData, undefined>;
  operationName: string;
}
export const listAllActiveAnnouncementsRef: ListAllActiveAnnouncementsRef;

export function listAllActiveAnnouncements(options?: ExecuteQueryOptions): QueryPromise<ListAllActiveAnnouncementsData, undefined>;
export function listAllActiveAnnouncements(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllActiveAnnouncementsData, undefined>;

interface CreateAdminRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateAdminData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateAdminData, undefined>;
  operationName: string;
}
export const createAdminRef: CreateAdminRef;

export function createAdmin(): MutationPromise<CreateAdminData, undefined>;
export function createAdmin(dc: DataConnect): MutationPromise<CreateAdminData, undefined>;

interface LogMetricEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogMetricEventVariables): MutationRef<LogMetricEventData, LogMetricEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LogMetricEventVariables): MutationRef<LogMetricEventData, LogMetricEventVariables>;
  operationName: string;
}
export const logMetricEventRef: LogMetricEventRef;

export function logMetricEvent(vars: LogMetricEventVariables): MutationPromise<LogMetricEventData, LogMetricEventVariables>;
export function logMetricEvent(dc: DataConnect, vars: LogMetricEventVariables): MutationPromise<LogMetricEventData, LogMetricEventVariables>;

interface GetLatestAnalyticsReportRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetLatestAnalyticsReportData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetLatestAnalyticsReportData, undefined>;
  operationName: string;
}
export const getLatestAnalyticsReportRef: GetLatestAnalyticsReportRef;

export function getLatestAnalyticsReport(options?: ExecuteQueryOptions): QueryPromise<GetLatestAnalyticsReportData, undefined>;
export function getLatestAnalyticsReport(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetLatestAnalyticsReportData, undefined>;

